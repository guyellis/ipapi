import path from 'path';
import { promises as fsPromises } from 'fs';
import parse from 'csv-parse/lib/sync';
import { CastingContext, CastingFunction } from 'csv-parse';
import { getIpRange } from './ip-utils';
import { logAction } from './log-utils';
import { CityBlock, CityBlockRaw, insertCityBlocks } from './db/mongo/city-blocks-ip-v4';

const columns = [
  'network',
  'geoname_id',
  'registered_country_geoname_id',
  'represented_country_geoname_id',
  'is_anonymous_proxy',
  'is_satellite_provider',
  'postal_code',
  'latitude',
  'longitude',
  'accuracy_radius',
];

/*
GeoLite2-City-Blocks-IPv4.csv File looks like this:

network,
geoname_id,
registered_country_geoname_id,
represented_country_geoname_id,
is_anonymous_proxy,
is_satellite_provider,
postal_code,
latitude,
longitude,
accuracy_radius

1.0.0.0/24,
2077456,
2077456,
,
0,
0,
,
-33.4940,
143.2104,
1000


1.0.1.0/24,1814991,1814991,,0,0,,34.7725,113.7266,50

*/

const cast: CastingFunction = (value: string, context: CastingContext) => {
  const { header } = context;
  if (header) {
    return value;
  }

  switch(context.column) {
    case 'geoname_id':
    case 'registered_country_geoname_id':
    case 'represented_country_geoname_id':
    case 'latitude':
    case 'longitude':
    case 'accuracy_radius':
      return parseInt(value);
    case 'is_anonymous_proxy':
    case 'is_satellite_provider':
      return value === '1';
    default:
      return value;
  }
};
const BATCH_SIZE = 250_000;

export const buildCityBlocksIpv4 = async (fileLocation: string): Promise<void> => {
  const endAction = logAction('Parse, Map and Load City Blocks');
  const cityBlocksFile = path.join(fileLocation, 'GeoLite2-City-Blocks-IPv4.csv');
  const cityBlocksCsv = await fsPromises.readFile(cityBlocksFile);
  let fromLine = 2;
  let toLine = BATCH_SIZE;
  let rawRecords: CityBlockRaw[] = [];
  let count = 0;
  do {
    rawRecords = parse(cityBlocksCsv, {
      cast,
      columns,
      fromLine,
      toLine,
    });
    console.log(`Block parse fromLine ${fromLine.toLocaleString()} \
toLine ${toLine.toLocaleString()} count ${count.toLocaleString()} \
rawRecords.length ${rawRecords.length.toLocaleString()}`);
    if (rawRecords.length) {
      const records: CityBlock[] = rawRecords.map((rawRecord) => {
        const [_id, ipHigh] = getIpRange(rawRecord.network);
        const cityBlock: CityBlock = {
          ...rawRecord,
          _id,
          ipHigh,
        };
        return cityBlock;
      });

      count += await insertCityBlocks(records);
      fromLine = toLine + 1;
      toLine += BATCH_SIZE;
    }
  } while (rawRecords.length);
  endAction(`Total Records loaded ${count.toLocaleString()}`);
};

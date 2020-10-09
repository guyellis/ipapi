import loki from 'lokijs';
import path from 'path';
import { promises as fsPromises } from 'fs';
import parse from 'csv-parse/lib/sync';
import { CastingContext, CastingFunction } from 'csv-parse';
import { getIpRange } from './ip-utils';

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

export type CityBlocksRaw = {
  network: string; // 1.0.0.0/24,
  geoname_id: number; // 2077456,
  registered_country_geoname_id: number; // 2077456,
  represented_country_geoname_id?: number; // ,
  is_anonymous_proxy: boolean; // 0,
  is_satellite_provider: boolean; // 0,
  postal_code?: string; // ,
  latitude: number; // -33.4940,
  longitude: number; // 143.2104,
  accuracy_radius: number; // 1000
};

const cast: CastingFunction = (value: string, context: CastingContext) => {
  const { header } = context;
  if (header) {
    return value;
  }
  switch(context.column) {
    case 'geoname_id':
      return parseInt(value);
    default:
      return value;
  }
};

export type CityBlocks = {
  geonameId: number;
  ipHigh: number;
  ipLow: number;
}

export const buildCityBlocksIpv4 = async (fileLocation: string, db: loki): Promise<Collection<CityBlocks>> => {
  const cityBlocksFile = path.join(fileLocation, 'GeoLite2-City-Blocks-IPv4.csv');
  const cityBlocksCsv = await fsPromises.readFile(cityBlocksFile);
  const rawRecords: CityBlocksRaw[] = parse(cityBlocksCsv, {
    cast,
    columns: true,
    to_line: 10, // TODO: Just get first 10 lines while testing
  });

  const records: CityBlocks[] = rawRecords.map((rawRecord) => {
    const [ipLow, ipHigh] = getIpRange(rawRecord.network);
    return {
      geonameId: rawRecord.geoname_id,
      ipHigh,
      ipLow,
    };
  });

  const cityBlocksCollection = db.addCollection<CityBlocks>('city-blocks', {
    disableMeta: true,
    unique: ['ipHigh', 'ipLow'],
  });

  cityBlocksCollection.insert(records);

  return cityBlocksCollection;
};

import loki from 'lokijs';
import path from 'path';
import { promises as fsPromises } from 'fs';
import parse from 'csv-parse/lib/sync';
import { CastingContext, CastingFunction } from 'csv-parse';
import { logAction } from './log-utils';

/*
GeoLite2-City-Locations-en.csv File looks like this:

geoname_id,
locale_code,
continent_code,
continent_name,
country_iso_code,
country_name,
subdivision_1_iso_code,
subdivision_1_name,
subdivision_2_iso_code,
subdivision_2_name,
city_name,
metro_code,
time_zone,
is_in_european_union

5819,
en,
EU,
Europe,
CY,
Cyprus,
02,
"Limassol District",
,
,
Souni,
,
Asia/Nicosia,
1
*/

export type CityLocationRaw = {
  city_name: string;
  continent_code: string;
  continent_name: string;
  country_iso_code: string;
  country_name: string;
  geoname_id: number;
  is_in_european_union: boolean;
  locale_code: string;
  metro_code: string;
  subdivision_1_iso_code: string;
  subdivision_1_name: string;
  subdivision_2_iso_code: string;
  subdivision_2_name: string;
  time_zone: string;
};

const cast: CastingFunction = (value: string, context: CastingContext) => {
  const { header } = context;
  if (header) {
    return value;
  }
  switch(context.column) {
    case 'geoname_id':
      return parseInt(value);
    case 'is_in_european_union':
      return value === "1";
    default:
      return value;
  }
};

export const buildCityLocations = async (fileLocation: string, db: loki): Promise<Collection<CityLocationRaw>> => {
  let endAction = logAction('Parse City Locations');
  const cityLocationsFile = path.join(fileLocation, 'GeoLite2-City-Locations-en.csv');
  const cityLocationsCsv = await fsPromises.readFile(cityLocationsFile);
  const records: CityLocationRaw[] = parse(cityLocationsCsv, {
    cast,
    columns: true,
    // to_line: 10, // TODO: Just get first 10 lines while testing
  });
  endAction(`Total Records parsed: ${records.length.toLocaleString()}`);

  endAction = logAction('Load City Locations to DB');
  const cityLocationsCollection = db.addCollection<CityLocationRaw>('city-locations', {
    disableMeta: true,
    unique: ['geoname_id'],
  });

  cityLocationsCollection.insert(records);
  endAction(`Total Records loaded ${cityLocationsCollection.count().toLocaleString()}`);

  return cityLocationsCollection;
};

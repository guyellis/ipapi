import loki from 'lokijs';
import path from 'path';
import { promises as fsPromises } from 'fs';
import parse from 'csv-parse/lib/sync';
import { CastingContext, CastingFunction } from 'csv-parse';

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

export type CityLocation = {
  cityName: string;
  continentCode: string;
  continentName: string;
  countryIsoCode: string;
  countryName: string;
  geonameId: number;
  isInEuropeanUnion: boolean;
  localeCode: string;
  metroCode: string;
  subdivision1IsoCode: string;
  subdivision1Name: string;
  subdivision2IsoCode: string;
  subdivision2Name: string;
  timeZone: string;
}

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
      // console.log(value, context);
      return value;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const buildCityLocations = async (fileLocation: string, db: loki): Promise<Collection<any>> => {
  const cityLocationsFile = path.join(fileLocation, 'GeoLite2-City-Locations-en.csv');
  const cityLocationsCsv = await fsPromises.readFile(cityLocationsFile);
  const records = parse(cityLocationsCsv, {
    cast,
    columns: true,
    to_line: 10, // TODO: Just get first 10 lines while testing
  });
  // console.log(records);
  // const lines = cityLocationsCsv.toString().split('\n').slice(1); // drop first line
  const cityLocationsCollection = db.addCollection('city-locations');
  records.forEach((record) => {
    cityLocationsCollection.insert(record);
  });
  return cityLocationsCollection;
};

// const fl = path.join(__dirname, '../dist/lib/db/GeoLite2-City-CSV_20201006');
// buildCityLocations(fl);

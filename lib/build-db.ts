import loki from 'lokijs';
import path from 'path';
import glob from 'fast-glob';
import { buildCityLocations, CityLocation } from './build-city-locations';
import { buildCityBlocksIpv4 } from './build-city-blocks-ip-v4';

const findFileLocation = async (): Promise<string> => {
  const base = path.join(__dirname, 'db');
  const dir = await glob(base + '/**/GeoLite2-City-CSV*', {
    onlyDirectories: true,
  });
  if(dir.length === 0) {
    throw new Error('No directory found match pattern.');
  }
  dir.sort().reverse();
  return dir[0];
};

export type IpFinderFunc = (ip: string) => CityLocation;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const ipFinderSetup = (db: loki) => (ip: string): CityLocation => {
  const cityLocation: CityLocation = {
    city_name: 'demo',
    continent_code: 'demo',
    continent_name: 'demo',
    country_iso_code: 'demo',
    country_name: 'demo',
    geoname_id: 1,
    is_in_european_union: false,
    locale_code: 'demo',
    metro_code: 'demo',
    subdivision_1_iso_code: 'demo',
    subdivision_1_name: 'demo',
    subdivision_2_iso_code: 'demo',
    subdivision_2_name: 'demo',
    time_zone: 'demo',
  };
  return cityLocation;
  // db.collections('city-blocks').;
};

export const buildDb = async (): Promise<IpFinderFunc> => {
  const fileLocation = await findFileLocation();
  // console.log(fileLocation);

  const db = new loki('ip.db');
  await buildCityLocations(fileLocation, db);
  await buildCityBlocksIpv4(fileLocation, db);
  return ipFinderSetup(db);
};

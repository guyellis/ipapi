import loki from 'lokijs';
import path from 'path';
import glob from 'fast-glob';
import { buildCityLocations, CityLocation } from './build-city-locations';
import { buildCityBlocksIpv4, CityBlocks } from './build-city-blocks-ip-v4';
import { ipToNumber } from './ip-utils';

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

const emptyCityLocation: CityLocation = {
  city_name: '',
  continent_code: '',
  continent_name: '',
  country_iso_code: '',
  country_name: '',
  geoname_id: 0,
  is_in_european_union: false,
  locale_code: '',
  metro_code: '',
  subdivision_1_iso_code: '',
  subdivision_1_name: '',
  subdivision_2_iso_code: '',
  subdivision_2_name: '',
  time_zone: '',
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const ipFinderSetup = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  cityLocationsCollection: Collection<CityLocation>,
  cityBlocksCollection: Collection<CityBlocks>,
) => (ipRaw: string): CityLocation => {
  const ip = ipToNumber(ipRaw);
  const cityBlocks = cityBlocksCollection.find({
    ipHigh: { $lte: ip},
    ipLow: {$gte: ip },
  });
  if (!cityBlocks) {
    console.error(`No cityBocks found.`, cityBlocks, ipRaw);
    return emptyCityLocation;
  }
  if (cityBlocks.length !== 1) {
    console.error(`Unexpected number of cityBocks of ${cityBlocks.length}. Expecting 1`, cityBlocks, ipRaw);
    return emptyCityLocation;
  }
  const [cityBlock] = cityBlocks;

  const cityLocations = cityLocationsCollection.find({
    geoname_id: { $eq: cityBlock.geonameId }
  });
  if (!cityLocations) {
    console.error(`No cityLocations found.`, cityLocations, ipRaw);
    return emptyCityLocation;
  }
  if (cityLocations.length !== 1) {
    console.error(`Unexpected number of cityLocations of ${cityLocations.length}. Expecting 1`, cityLocations, ipRaw);
    return emptyCityLocation;
  }

  return emptyCityLocation[0];
};

export const buildDb = async (): Promise<IpFinderFunc> => {
  const fileLocation = await findFileLocation();
  // console.log(fileLocation);

  const db = new loki('ip.db');
  const cityLocationsCollection = await buildCityLocations(fileLocation, db);
  const cityBlocksCollection = await buildCityBlocksIpv4(fileLocation, db);
  return ipFinderSetup(cityLocationsCollection, cityBlocksCollection);
};

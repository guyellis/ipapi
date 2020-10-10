import loki from 'lokijs';
import path from 'path';
import glob from 'fast-glob';
import { buildCityLocations, CityLocation } from './build-city-locations';
import { buildCityBlocksIpv4, CityBlocks } from './build-city-blocks-ip-v4';
import { ipToNumber } from './ip-utils';
import { IPInfo, mapToLegacy } from './legacy';

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

export type IpFinderFunc = (ip: string) => IPInfo;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const ipFinderSetup = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  cityLocationsCollection: Collection<CityLocation>,
  cityBlocksCollection: Collection<CityBlocks>,
) => (ipRaw: string): IPInfo => {
  const ip = ipToNumber(ipRaw);
  const cityBlocks = cityBlocksCollection.find({
    ipHigh: { $gte: ip },
    ipLow: { $lte: ip },
  });
  if (!cityBlocks) {
    console.error(`No cityBocks found.`, cityBlocks, ipRaw);
    return mapToLegacy();
  }
  if (cityBlocks.length !== 1) {
    console.error(`Unexpected number of cityBocks of ${cityBlocks.length}. Expecting 1`, cityBlocks, ipRaw);
    return mapToLegacy();
  }
  const [cityBlock] = cityBlocks;

  const cityLocations = cityLocationsCollection.find({
    geoname_id: { $eq: cityBlock.geonameId }
  });
  if (!cityLocations) {
    console.error(`No cityLocations found.`, cityLocations, ipRaw);
    return mapToLegacy();
  }
  if (cityLocations.length !== 1) {
    console.error(`Unexpected number of cityLocations of ${cityLocations.length}. Expecting 1`, cityLocations, ipRaw);
    return mapToLegacy();
  }

  return mapToLegacy(cityLocations[0]);
};

export const buildDb = async (): Promise<IpFinderFunc> => {
  const fileLocation = await findFileLocation();
  // console.log(fileLocation);

  const db = new loki('ip.db');
  const cityLocationsCollection = await buildCityLocations(fileLocation, db);
  const cityBlocksCollection = await buildCityBlocksIpv4(fileLocation, db);
  return ipFinderSetup(cityLocationsCollection, cityBlocksCollection);
};

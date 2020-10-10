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

type IpCity = {
  block: CityBlocks | null;
  location: CityLocation | null;
}
export type IpFinderLegacy = (ip: string) => IPInfo;
export type IpFinder = (ip: string) => IpCity;
type GetRecordResult = [CityBlocks | null, CityLocation | null];

export const getRecords = (
  ipRaw: string,
  cityLocationsCollection: Collection<CityLocation>,
  cityBlocksCollection: Collection<CityBlocks>,
): GetRecordResult => {
  const ip = ipToNumber(ipRaw);
  const cityBlocks = cityBlocksCollection.find({
    ipHigh: { $gte: ip },
    ipLow: { $lte: ip },
  });
  if (!cityBlocks) {
    console.error(`No cityBocks found.`, cityBlocks, ipRaw);
    return [null, null];
  }
  if (cityBlocks.length !== 1) {
    console.error(`Unexpected number of cityBocks of ${cityBlocks.length}. Expecting 1`, cityBlocks, ipRaw);
    return [null, null];
  }
  const [cityBlock] = cityBlocks;

  const cityLocations = cityLocationsCollection.find({
    geoname_id: { $eq: cityBlock.geonameId }
  });
  if (!cityLocations) {
    console.error(`No cityLocations found.`, cityLocations, ipRaw);
    return [cityBlock, null];
  }
  if (cityLocations.length !== 1) {
    console.error(`Unexpected number of cityLocations of ${cityLocations.length}. Expecting 1`, cityLocations, ipRaw);
    return [cityBlock, null];
  }
  const [cityLocation] = cityLocations;

  return [cityBlock, cityLocation];
};

export const ipFinderSetupLegacy = (
  cityLocationsCollection: Collection<CityLocation>,
  cityBlocksCollection: Collection<CityBlocks>,
) => (ipRaw: string): IPInfo => {
  const [, cityLocation] = getRecords(ipRaw, cityLocationsCollection, cityBlocksCollection);
  return mapToLegacy(cityLocation);
};

export const ipFinderSetup = (
  cityLocationsCollection: Collection<CityLocation>,
  cityBlocksCollection: Collection<CityBlocks>,
) => (ipRaw: string): IpCity => {
  const [block, location] = getRecords(ipRaw, cityLocationsCollection, cityBlocksCollection);
  return { block, location };
};

type BuildDbResult = [IpFinderLegacy, IpFinder];

export const buildDb = async (): Promise<BuildDbResult> => {
  const fileLocation = await findFileLocation();

  const db = new loki('ip.db');
  const cityLocationsCollection = await buildCityLocations(fileLocation, db);
  const cityBlocksCollection = await buildCityBlocksIpv4(fileLocation, db);
  const ipFinderLegacy = ipFinderSetupLegacy(cityLocationsCollection, cityBlocksCollection);
  const ipFinder = ipFinderSetup(cityLocationsCollection, cityBlocksCollection);
  return [ipFinderLegacy, ipFinder];
};

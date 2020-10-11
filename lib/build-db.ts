import path from 'path';
import glob from 'fast-glob';
import { buildCityLocations } from './build-city-locations';
import { buildCityBlocksIpv4 } from './build-city-blocks-ip-v4';
import { ipToNumber } from './ip-utils';
import { IPInfo, mapToLegacy } from './legacy';
import { CityBlock, findCityBlockByIp } from './db/mongo/city-blocks-ip-v4';
import { CityLocation, findCityLocationByGeonameId } from './db/mongo/city-locations';
import { resetDb, setupIndexes } from './db/mongo/db-helper';

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
  block: CityBlock | null;
  location: CityLocation | null;
}
export type IpFinderLegacy = (ip: string) => IPInfo;
export type IpFinder = (ip: string) => IpCity;
type GetRecordResult = [CityBlock | null, CityLocation | null];

export const getRecords = async (ipRaw: string): Promise<GetRecordResult> => {
  const ip = ipToNumber(ipRaw);
  const cityBlocks = await findCityBlockByIp(ip);
  if (!cityBlocks) {
    console.error('No cityBocks found.', cityBlocks, ipRaw);
    return [null, null];
  }
  // if (cityBlocks.length !== 1) {
  //   console.error(`Unexpected number of cityBocks of ${cityBlocks.length}. Expecting 1`, cityBlocks, ipRaw);
  //   return [null, null];
  // }
  const cityBlock = cityBlocks;

  const cityLocations = await findCityLocationByGeonameId(cityBlock.geonameId);
  if (!cityLocations) {
    console.error('No cityLocations found.', cityLocations, ipRaw);
    return [cityBlock, null];
  }
  // if (cityLocations.length !== 1) {
  //   console.error(`Unexpected number of cityLocations of ${cityLocations.length}. Expecting 1`, cityLocations, ipRaw);
  //   return [cityBlock, null];
  // }
  const cityLocation = cityLocations;

  return [cityBlock, cityLocation];
};

export const ipFinderLegacy = async (ipRaw: string): Promise<IPInfo> => {
  const [, cityLocation] = await getRecords(ipRaw);
  return mapToLegacy(cityLocation);
};

export const ipFinder = async (ipRaw: string): Promise<IpCity> => {
  const [block, location] = await getRecords(ipRaw);
  return { block, location };
};

export const buildDb = async (): Promise<void> => {
  const fileLocation = await findFileLocation();

  await resetDb();
  await setupIndexes();
  await buildCityLocations(fileLocation);
  await buildCityBlocksIpv4(fileLocation);
};

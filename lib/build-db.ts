import { buildCityLocations } from './build-city-locations';
import { buildCityBlocksIpv4 } from './build-city-blocks-ip-v4';
import { IPInfo, mapToLegacy } from './legacy';
import { resetDb, setupIndexes } from './db/mongo/db-helper';
import { findFileLocation } from './file-utils';
import { findCityByIp } from './db/maxmind/city';

export type IpFinderLegacy = (ip: string) => IPInfo;

export const ipFinderLegacy = async (ipRaw: string): Promise<IPInfo> => {
  const city = await findCityByIp(ipRaw);
  return mapToLegacy(city);
};

export const buildDb = async (): Promise<void> => {
  const fileLocation = await findFileLocation();

  await resetDb();
  await buildCityLocations(fileLocation);
  await buildCityBlocksIpv4(fileLocation);
  await setupIndexes();
};

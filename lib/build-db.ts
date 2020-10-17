import { buildCityLocations } from './build-city-locations';
import { buildCityBlocksIpv4 } from './build-city-blocks-ip-v4';
import { ipToNumber } from './ip-utils';
import { IPInfo, mapToLegacy } from './legacy';
import { CityBlock, findCityBlocksByIps } from './db/mongo/city-blocks-ip-v4';
import { CityLocation, findCityLocationsByGeonameIds } from './db/mongo/city-locations';
import { resetDb, setupIndexes } from './db/mongo/db-helper';
import { findFileLocation } from './file-utils';

type IpCity = {
  block: CityBlock | null;
  location: CityLocation | null;
}
export type IpFinderLegacy = (ip: string) => IPInfo;
export type IpFinder = (ip: string) => IpCity;
type GetRecordResult = [CityBlock | null, CityLocation | null];

export const getRecords = async (ipRaw: string): Promise<GetRecordResult> => {
  const ip = ipToNumber(ipRaw);
  const cityBlocks = await findCityBlocksByIps([ip]);
  if (!cityBlocks || !cityBlocks.length) {
    console.error('No cityBocks found.', cityBlocks, ipRaw);
    return [null, null];
  }

  const [cityBlock] = cityBlocks;

  const cityLocations = await findCityLocationsByGeonameIds([cityBlock.geoname_id], []);
  if (!cityLocations || !cityLocations.length) {
    console.error('No cityLocations found.', cityLocations, ipRaw);
    return [cityBlock, null];
  }

  const [cityLocation] = cityLocations;

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
  await buildCityLocations(fileLocation);
  await buildCityBlocksIpv4(fileLocation);
  await setupIndexes();
};

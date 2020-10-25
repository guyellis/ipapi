import { IPInfo, mapToLegacy } from './legacy';
import { findCityByIp } from './db/maxmind/city';

export type IpFinderLegacy = (ip: string) => IPInfo;

export const ipFinderLegacy = async (ipRaw: string): Promise<IPInfo> => {
  const city = await findCityByIp(ipRaw);
  return mapToLegacy(city);
};

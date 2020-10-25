import { CountryRecord, SubdivisionsRecord } from '@maxmind/geoip2-node';
import { findCityByIp } from '../db/maxmind/city';

import { ipToNumber, numberToIp } from '../ip-utils';

export {
  ipToNumber,
  numberToIp,
};

type IpCountry = {
  ip: number;
  country_name: string;
  subdivision_1_name: string;
}

/**
 * Given a collection of IP addresses returns the country associated with each one.
 * @param ips - numeric IP addresses
 */
export const getCityLocationsByIp = async (ips: number[]): Promise<IpCountry[]> => {
  const promises = ips.map(async (ip) => {
    const ipAddress = numberToIp(ip);
    const city = await findCityByIp(ipAddress);
    const country_name = (city.country as CountryRecord).names?.en ?? 'unknown';
    const subdivisions = (city.subdivisions || []) as SubdivisionsRecord[];
    const subdivision_1_name = subdivisions.length > 0 ? subdivisions[0].names?.en ?? 'unknown' : 'unknown';
    const ipCountry: IpCountry = {
      country_name,
      ip,
      subdivision_1_name,
    };
    return ipCountry;
  });
  const ipCountries = await Promise.all(promises);
  return ipCountries;
};

import { CityBlock, findCityBlocksByIps } from '../db/mongo/city-blocks-ip-v4';
import { findCityLocationsByGeonameIds } from '../db/mongo/city-locations';

export { ipToNumber, numberToIp } from '../ip-utils';

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
  const cityBlockFields = ['_id', 'ipHigh', 'geoname_id'] as const;
  type SomeFields = Pick<CityBlock, typeof cityBlockFields[number]>;
  const cityBlocks: SomeFields[] = await findCityBlocksByIps(ips, cityBlockFields);

  const cityLocations = await findCityLocationsByGeonameIds(
    cityBlocks.map(({geoname_id}) => geoname_id),
    ['country_name', 'subdivision_1_name', '_id'],
  );

  const ipCountry = ips.map((ip) => {
    const cityBlock = cityBlocks.find((cb) => cb._id <= ip && cb.ipHigh >= ip);
    const cityLocation = cityLocations.find((cl) => cl._id === cityBlock.geoname_id);
    const { country_name, subdivision_1_name } = cityLocation;
    return {
      country_name,
      ip,
      subdivision_1_name,
    };
  }, {} as IpCountry);
  return ipCountry;
};

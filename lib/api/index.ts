import { findCityBlocksByIps } from '../db/mongo/city-blocks-ip-v4';
import { findCityLocationsByGeonameIds } from '../db/mongo/city-locations';
// import { ipToNumber } from '../ip-utils';

type IpCountry = {
  ip: number;
  country_name: string;
}

/**
 * Given a collection of IP addresses returns the country associated with each one.
 * @param ips - numeric IP addresses
 */
export const getCityLocationsByIp = async (ips: number[]): Promise<IpCountry[]> => {
  const cityBlocks = await findCityBlocksByIps(ips);


  const cityLocations = await findCityLocationsByGeonameIds(
    cityBlocks.map(({geoname_id}) => geoname_id),
    ['country_name', '_id'],
  );

  const ipCountry = ips.map((ip) => {
    const cityBlock = cityBlocks.find((cb) => cb._id <= ip && cb.ipHigh >= ip);
    const cityLocation = cityLocations.find((cl) => cl._id === cityBlock.geoname_id);
    const { country_name } = cityLocation;
    return {
      country_name,
      ip,
    };
  }, {} as IpCountry);
  return ipCountry;
};

export const getCountries = async (ips: number[]): Promise<IpCountry[]> => {
  return getCityLocationsByIp(ips);
};

// const main = async (): Promise<void> => {
//   const ips = ['1.2.3.4', '5.6.7.8'].map(ipToNumber);
//   const countries = await getCountries(ips);
//   console.log(countries);
//   process.exit(0);
// };

// main();

import { findCityBlockByIp, findCityBlocksByIps } from '../db/mongo/city-blocks-ip-v4';
import { findCityLocationByGeonameId, findCityLocationsByGeonameIds } from '../db/mongo/city-locations';
// import { ipToNumber } from '../ip-utils';

/**
 * Given an IP returns the country that the IP is associated with.
 * @param ip - numeric IP address
 */
export const getCountry = async (ip: number): Promise<string> => {
  const cityBlock = await findCityBlockByIp(ip);
  const cityLocations = await findCityLocationByGeonameId(cityBlock.geoname_id);
  return cityLocations.country_name;
};

export const getCountries = async (ip: number[]): Promise<string[]> => {
  const cityBlocks = await findCityBlocksByIps(ip);
  const cityLocations = await findCityLocationsByGeonameIds(
    cityBlocks.map(({geoname_id}) => geoname_id)
  );
  return cityLocations.map(({country_name}) => country_name);
};

// const main = async (): Promise<void> => {
//   const ips = ['1.2.3.4', '5.6.7.8'].map(ipToNumber);
//   const countries = await getCountries(ips);
//   console.log(countries);
//   process.exit(0);
// };

// main();

import { findCityBlockByIp } from '../db/mongo/city-blocks-ip-v4';
import { findCityLocationByGeonameId } from '../db/mongo/city-locations';

/**
 * Given an IP returns the country that the IP is associated with.
 * @param ip - numeric IP address
 */
export const getCountry = async (ip: number): Promise<string> => {
  const cityBlock = await findCityBlockByIp(ip);
  const cityLocations = await findCityLocationByGeonameId(cityBlock.geoname_id);
  return cityLocations.country_name;
};

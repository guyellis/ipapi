import { getDatabase } from "./db-helper";
import { City } from "@maxmind/geoip2-node";

export const findCityBlockByIp = async (
  ipAddress: string,
): Promise<City> => {
  const { cityReader } = await getDatabase();
  const city = cityReader.city(ipAddress);

  return city;
};

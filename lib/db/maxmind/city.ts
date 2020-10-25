import { getDatabase } from "./db-helper";
import { City } from "@maxmind/geoip2-node";
import { unknownCity } from "./city-unknown";

export const findCityByIp = async (
  ipAddress: string,
): Promise<City> => {
  try {
    const { cityReader } = await getDatabase();
    const city = cityReader.city(ipAddress);

    return city;
  } catch {
    return unknownCity;
  }
};

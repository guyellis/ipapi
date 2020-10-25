import { getDatabase } from "./db-helper";
import { Asn } from "@maxmind/geoip2-node";

export const findCityBlockByIp = async (
  ipAddress: string,
): Promise<Asn> => {
  const { asnReader } = await getDatabase();
  const asn = asnReader.asn(ipAddress);

  return asn;
};

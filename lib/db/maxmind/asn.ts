import { getDatabase } from "./db-helper";
import { Asn } from "@maxmind/geoip2-node";

const unknownAsn: Asn = {
  autonomousSystemNumber: 0,
  autonomousSystemOrganization: 'unknown',
  network: 'unknown',
}

export const findAsnByIp = async (
  ipAddress: string,
): Promise<Asn> => {
  try {
    const { asnReader } = await getDatabase();
    const asn = asnReader.asn(ipAddress);

    return asn;
  } catch {
    return {
      ...unknownAsn,
      ipAddress,
    };
  }
};

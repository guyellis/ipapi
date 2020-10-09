
const octetsToNumbers = (octets: string[]): number[] => {
  return octets.map((octet) => {
    const value = parseInt(octet);
    if (value < 0 || value > 255) {
      throw new Error(`Expecting octet in range of 0 to 255 but got ${value} from ${octet} and this array ${octets.join()}`);
    }
    return value;
  });
};

const ipToNumber = (ip: string): number => {
  const parts = ip.split('.');
  if (parts.length !== 4) {
    throw new Error(`Expecting . to split string into 4 parts but got ${parts.length} for ${ip}`);
  }
  const [one, two, three, four] = octetsToNumbers(parts);
  return one << 24 | two << 16 | three << 8 | four;
};

const getHighIp = (lowIp: number, cidr: string): number => {
  const cidrValue = parseInt(cidr);
  if(cidrValue < 0 || cidrValue > 32) {
    throw new Error(`Expecting cidr in range 0 to 32 but got ${cidr}`);
  }
  return lowIp + Math.pow(2, 32 - cidrValue);
};

/**
 * Calculates the integer IP range from a CIDR notated IP string
 * @param network - e.g. 1.0.0.0/24 or 1.0.0.0
 */
export const getIpRange = (network: string): [number, number] => {
  
  const parts = network.split('/');
  if (parts.length > 2) {
    throw new Error(`Expecting / to split string into 1 or 2 parts but got ${parts.length} for ${network}`);
  }
  const lowIp = ipToNumber(parts[0]);
  const highIp = parts[1] ? getHighIp(lowIp, parts[1]) : lowIp;
  return [lowIp, highIp];
};

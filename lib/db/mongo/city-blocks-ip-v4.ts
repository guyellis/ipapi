import { getDatabase } from "./db-helper";
import pMap from 'p-map';
import { FindOneOptions } from "mongodb";

const collectionName = 'city-block-ip-v4';

export type CityBlockRaw = {
  network: string; // 1.0.0.0/24,
  geoname_id: number; // 2077456,
  registered_country_geoname_id: number; // 2077456,
  represented_country_geoname_id?: number; // ,
  is_anonymous_proxy: boolean; // 0,
  is_satellite_provider: boolean; // 0,
  postal_code?: string; // ,
  latitude: number; // -33.4940,
  longitude: number; // 143.2104,
  accuracy_radius: number; // 1000
};

export type CityBlock = {
  ipHigh: number;
  _id: number;
} & CityBlockRaw;

export type CityBlockFields = keyof CityBlock;

export const createIndexCityBlocks = async () => {
  const db = await getDatabase();
  await db.collection(collectionName).createIndex({
    ipHigh: 1,
  });
}

/**
 * Finds all City Blocks that have IP ranges surrounding the inputs
 * @param ips - a collection of numeric IP addresses
 */
export const findCityBlocksByIps = async (
  ips: number[], fields?: readonly CityBlockFields[],
): Promise<CityBlock[]> => {
  const db = await getDatabase();

  const options: FindOneOptions<CityBlock> = {};
  if(fields && fields.length) {
    options.projection = fields.reduce((acc, field) => {
      acc[field] = 1;
      return acc;
    }, {});
    if (!fields.includes('_id')) {
      // _id is automatically included so needs to be explicitly excluded.
      options.projection._id = -1;
    }
  }

  const mapper = async (ip: number) => {
    const query = {
      ipHigh: { $gte: ip },
      _id: { $lte: ip },
    };
    return db.collection(collectionName).findOne<CityBlock>(query, options);
  }
  const results = await pMap(ips, mapper, { concurrency: 1 });
  return results;
};

export const insertCityBlocks = async (cityLocations: CityBlock[]): Promise<number> => {
  const db = await getDatabase();
  const insertWriteOpResult = await db.collection(collectionName).insertMany(cityLocations);
  return insertWriteOpResult.insertedCount;
};

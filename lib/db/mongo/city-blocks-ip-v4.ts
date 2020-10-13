import { getDatabase } from "./db-helper";

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

export const createIndexCityBlocks = async () => {
  const db = await getDatabase();
  await db.collection(collectionName).createIndex({
    ipHigh: 1,
  });
}

export const findCityBlockByIp = async (ip: number): Promise<CityBlock> => {
  const db = await getDatabase();
  const result = await db.collection(collectionName).findOne({
    ipHigh: { $gte: ip },
    _id: { $lte: ip },
  });
  return result;
};

export const insertCityBlocks = async (cityLocations: CityBlock[]): Promise<number> => {
  const db = await getDatabase();
  const result = await db.collection(collectionName).insertMany(cityLocations);
  return result.insertedCount;
};

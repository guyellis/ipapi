import { getDatabase } from "./db-helper";

const collectionName = 'city-locations';

export type CityLocation = {
  city_name: string;
  continent_code: string;
  continent_name: string;
  country_iso_code: string;
  country_name: string;
  geoname_id: number;
  is_in_european_union: boolean;
  locale_code: string;
  metro_code: string;
  subdivision_1_iso_code: string;
  subdivision_1_name: string;
  subdivision_2_iso_code: string;
  subdivision_2_name: string;
  time_zone: string;
};

export const createIndexCityLocations = async () => {
  const db = await getDatabase();
  await db.collection(collectionName).createIndex({
    geoname_id: 1,
  });
}

export const findCityLocationByGeonameId = async (geonameId: number): Promise<CityLocation> => {
  const db = await getDatabase();
  const result = await db.collection(collectionName).findOne({
    geoname_id: { $eq: geonameId }
  });
  return result;
}

export const insertCityLocations = async (cityLocations: CityLocation[]): Promise<void> => {
  const db = await getDatabase();
  db.collection(collectionName).insertMany(cityLocations);
};

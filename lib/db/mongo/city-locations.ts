import { getDatabase } from "./db-helper";

const collectionName = 'city-locations';

export type CityLocation = {
  _id: number; // Was geoname_id
  city_name: string;
  continent_code: string;
  continent_name: string;
  country_iso_code: string;
  country_name: string;
  is_in_european_union: boolean;
  locale_code: string;
  metro_code: string;
  subdivision_1_iso_code: string;
  subdivision_1_name: string;
  subdivision_2_iso_code: string;
  subdivision_2_name: string;
  time_zone: string;
};

export const findCityLocationByGeonameId = async (geonameId: number): Promise<CityLocation> => {
  const db = await getDatabase();
  const result = await db.collection(collectionName).findOne({
    _id: geonameId,
  });
  return result;
}

export const insertCityLocations = async (cityLocations: CityLocation[]): Promise<void> => {
  const db = await getDatabase();
  db.collection(collectionName).insertMany(cityLocations);
};

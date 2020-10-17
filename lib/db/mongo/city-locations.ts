import { FindOneOptions, SchemaMember } from "mongodb";
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

export type CityLocationFields = keyof CityLocation;

export const insertCityLocations = async (cityLocations: CityLocation[]): Promise<number> => {
  const db = await getDatabase();
  const insertWriteOpResult = await db.collection(collectionName).insertMany(cityLocations);
  return insertWriteOpResult.insertedCount;
};

export const findCityLocationsByGeonameIds = async (
  geonameId: number[], fields: CityLocationFields[],
): Promise<CityLocation[]> => {
  const projection: SchemaMember<CityLocation, number> = fields.reduce((acc, field) => {
    acc[field] = 1;
    return acc;
  }, {});
  if (!fields.includes('_id')) {
    // _id is automatically included so needs to be explicitly excluded.
    projection._id = -1;
  }

  const options: FindOneOptions<CityLocation> = fields.length ? {
    projection,
  } : {};

  const db = await getDatabase();
  const result = await db.collection(collectionName).find<CityLocation>({
    _id: { $in: geonameId }
  }, options).toArray();
  return result;
}

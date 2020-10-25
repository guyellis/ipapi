import { City } from "@maxmind/geoip2-node";
import { CityResponse } from "@maxmind/geoip2-node/dist/src/types";

const UNKNOWN = 'unknown';
const names = {
  en: UNKNOWN,
};

const geoname_id = 0;
const isInEuropeanUnion = false;
const code = 'NA' as const;
const iso_code = 'X';
const confidence = 0;
const city = {
  confidence,
  geoname_id,
  names,
};

const continent = {
  code,
  geoname_id,
  names,
};

const country = {
  geoname_id,
  iso_code,
  names,
  confidence,
  isInEuropeanUnion,
};
const maxmind = {
  queriesRemaining: 1000,
};
const registered_country = {
  geoname_id,
  iso_code,
  names,
  isInEuropeanUnion,
};
const represented_country = {
  geoname_id,
  iso_code,
  names,
  type: UNKNOWN,
  isInEuropeanUnion,
};
const traits = {};

const location = {
  accuracy_radius: 1000,
  latitude: 0,
  longitude: 0,
};
const postal = {
  code: UNKNOWN,
};
const subdivisions = [{
  confidence,
  geoname_id,
  iso_code,
  names,
}];

const cityResponse: CityResponse = {
  city,
  continent,
  country,
  location,
  maxmind,
  postal,
  registered_country,
  represented_country,
  subdivisions,
  traits,
};

export const unknownCity = new City(cityResponse);

// Prior to 2020-10 the .mmdb file was used with the reader and it mapped
// a structure that is duplicated here.

import { CityLocation } from './db/mongo/city-locations';

type Names =
{
  en: string;
}

type City =
{
  geoname_id: number;
  names: Names;
}

type Continent =
{
  code: string;
  geoname_id: number;
  names: Names;
}

type Country =
{
  geoname_id: number;
  iso_code: string;
  names: Names;
}

type Location =
{
  latitude: number;
  longitude: number;
  metro_code: number;
  time_zone: string;
}

type Postal =
{
  code: string;
}

export type IPInfo =
{
  city: City;
  continent: Continent;
  country: Country;
  location: Location;
  postal: Postal;
  registered_country: Country;
  subdivisions: Country[];
}

const emptyCityLocation: CityLocation = {
  _id: 0,
  city_name: '',
  continent_code: '',
  continent_name: '',
  country_iso_code: '',
  country_name: '',
  is_in_european_union: false,
  locale_code: '',
  metro_code: '',
  subdivision_1_iso_code: '',
  subdivision_1_name: '',
  subdivision_2_iso_code: '',
  subdivision_2_name: '',
  time_zone: '',
};

export const mapToLegacy = (cityLocation: CityLocation = emptyCityLocation): IPInfo => {
  const ipInfo: IPInfo = {
    city: {
      geoname_id: cityLocation._id,
      names: {
        en: cityLocation.city_name,
      }
    },
    continent: {
      code: cityLocation.continent_code,
      geoname_id: 0, // unused
      names: {
        en: cityLocation.continent_name,
      },
    },
    country: {
      geoname_id: 0,
      iso_code: cityLocation.country_iso_code,
      names: {
        en: cityLocation.country_name,
      }
    },
    location: {
      latitude: 0, // unused
      longitude: 0, // unused
      metro_code: 0, // unused
      time_zone: cityLocation.time_zone,
    },
    postal: {
      code: cityLocation.metro_code, // This is wrong but doesn't matter
    },
    registered_country: {
      geoname_id: 0,
      iso_code: cityLocation.country_iso_code,
      names: {
        en: cityLocation.country_name,
      }
    },
    subdivisions: [{
      geoname_id: 0,
      iso_code: cityLocation.subdivision_1_iso_code,
      names: {
        en: cityLocation.subdivision_1_name,
      }
    }]
  };
  return ipInfo;
};

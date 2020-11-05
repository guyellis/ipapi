// Prior to 2020-10 the .mmdb file was used with the reader and it mapped
// a structure that is duplicated here.

import { City, SubdivisionsRecord } from '@maxmind/geoip2-node';

type Names =
{
  en: string;
}

type CityLegacy =
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
  city: CityLegacy;
  continent: Continent;
  country: Country;
  location: Location;
  postal: Postal;
  registered_country: Country;
  subdivisions: Country[];
}

export const mapToLegacy = (cityLocation: City): IPInfo => {
  const subDivisions = (cityLocation.subdivisions || []) as SubdivisionsRecord[];
  const subdivisions: Country[] = subDivisions.map((subDiv) => {
    return {
      geoname_id: 0,
      iso_code: subDiv.isoCode ?? 'unknown',
      names: {
        en: subDiv.names?.en ?? 'unknown'
      },
    };
  });

  const ipInfo: IPInfo = {
    city: {
      geoname_id: cityLocation.city?.geonameId ?? 0,
      names: {
        en: cityLocation.city?.names?.en ?? 'unknown',
      }
    },
    continent: {
      code: cityLocation.continent?.code ?? 'NA',
      geoname_id: 0, // unused
      names: {
        en: cityLocation.continent?.names?.en ?? 'unknown',
      },
    },
    country: {
      geoname_id: 0,
      iso_code: cityLocation.country?.isoCode ?? 'unknown',
      names: {
        en: cityLocation.country?.names?.en ?? 'unknown',
      }
    },
    location: {
      latitude: 0, // unused
      longitude: 0, // unused
      metro_code: 0, // unused
      time_zone: cityLocation.location?.timeZone ?? 'unknown',
    },
    postal: {
      code: cityLocation.postal?.code ?? 'unknown', // This is wrong but doesn't matter
    },
    registered_country: {
      geoname_id: 0,
      iso_code: cityLocation.registeredCountry?.isoCode ?? 'unknown',
      names: {
        en: cityLocation.registeredCountry?.names?.en ?? 'unknown',
      }
    },
    subdivisions: subdivisions,
  };
  return ipInfo;
};

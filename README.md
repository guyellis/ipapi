# ipapi

Web Server that provides a simple API for IP address information

## Usage

### Prerequisites

- You need to have a MongoDB (or MongoDB API compatible) database available. (Docker is a great option.)
- You need to [setup a free account with Maxmind](https://dev.maxmind.com/geoip/geoip2/geolite2/) and get a License Key from them.
- You need to setup these Environment Variables
  - `MAXMIND_LICENSE_KEY` (required) - Set this to the key you got from Maxmind above
  - `IPAPI_DB_HOST` (required) - The database host (IP or Hostname)
  - `IPAPI_DB_PORT` (required) - The database port
  - `IPAPI_PORT` (optional) - The server port. Defaults to 3334.

### Setup the repo

```shell
git clone git@github.com:guyellis/ipapi.git
npm install
```

### Setup the DB

Backup your existing `ip` DB as this script will clean out the existing data and create new data.

```shell
npm run setup-db
```

This will take a few minutes to complete. This clears out the existing MongoDB `ip` database and downloads the CSV database and unpacks it. It then parses 2 of the files from there and loads them into the database. One of the files is 3m+ rows and it's loaded in batches. Stdout will show the progress.

### Start the Server

```shell
npm start
```

### Call the API

#### /ip/<x.x.x.x>

From a browser or your client code call `http://<your-domain>/ip/<x.x.x.x>`

For example, if you're running the server locally then opening `http://localhost:3334/ip/1.2.3.4` in your browser will return some JSON that looks something like this:

```javascript
{
  "city": {
    "geoname_id": 2077456,
    "names": {
      "en": ""
    }
  },
  "continent": {
    "code": "OC",
    "geoname_id": 0,
    "names": {
      "en": "Oceania"
    }
  },
  "country": {
    "geoname_id": 0,
    "iso_code": "AU",
    "names": {
      "en": "Australia"
    }
  },
  "location": {
    "latitude": 0,
    "longitude": 0,
    "metro_code": 0,
    "time_zone": "Australia/Sydney"
  },
  "postal": {
    "code": ""
  },
  "registered_country": {
    "geoname_id": 0,
    "iso_code": "AU",
    "names": {
      "en": "Australia"
    }
  },
  "subdivisions": [
    {
      "geoname_id": 0,
      "iso_code": "",
      "names": {
        "en": ""
      }
    }
  ]
}
```

#### /ip2/<x.x.x.x>

From a browser or your client code call `http://<your-domain>/ip2/<x.x.x.x>`

For example, if you're running the server locally then opening `http://localhost:3334/ip2/1.2.3.4` in your browser will return some JSON that looks something like this:

```javascript
{
  "block": {
    "_id": "5f831406d9decd3cce4f3ade",
    "network": "1.2.3.0/24",
    "geoname_id": 2077456,
    "registered_country_geoname_id": 2077456,
    "represented_country_geoname_id": null,
    "is_anonymous_proxy": false,
    "is_satellite_provider": false,
    "postal_code": "",
    "latitude": -33,
    "longitude": 143,
    "accuracy_radius": 1000,
    "geonameId": 2077456,
    "ipHigh": 16909312,
    "ipLow": 16909056
  },
  "location": {
    "_id": "5f831402d9decd3cce4dad0e",
    "geoname_id": 2077456,
    "locale_code": "en",
    "continent_code": "OC",
    "continent_name": "Oceania",
    "country_iso_code": "AU",
    "country_name": "Australia",
    "subdivision_1_iso_code": "",
    "subdivision_1_name": "",
    "subdivision_2_iso_code": "",
    "subdivision_2_name": "",
    "city_name": "",
    "metro_code": "",
    "time_zone": "Australia/Sydney",
    "is_in_european_union": false
  }
}
```

## Tested On

* Ubuntu 20.04 (Node v14.11.0)

## Data

The data for the server comes from the GeoLite2 DB provided by [maxmind.com](http://www.maxmind.com).

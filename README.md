# ipapi

Web Server that provides a simple API for IP address information

## Usage

### Prerequisites

- You need to [setup a free account with Maxmind](https://dev.maxmind.com/geoip/geoip2/geolite2/) and get a License Key from them.
- You need to setup these Environment Variables
  - `MAXMIND_LICENSE_KEY` (required) - Set this to the key you got from Maxmind above
  - `IPAPI_PORT` (optional) - The server port. Defaults to 3334.

### Setup the repo

```shell
git clone git@github.com:guyellis/ipapi.git
npm install
```

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

## Tested On

* Ubuntu 20.04 (Node v14.11.0)

## Data

The data for the server comes from the GeoLite2 DB provided by [maxmind.com](http://www.maxmind.com).

# ipapi

[![Greenkeeper badge](https://badges.greenkeeper.io/guyellis/ipapi.svg)](https://greenkeeper.io/)

Web Server that provides a simple API for IP address information

## Usage

### Install and run the server

```
git clone git@github.com:guyellis/ipapi.git
npm install
node index.js
```

or

```
npm install ipapi
node node_modules/ipapi/index.js
```

### Call the API

From a browser or your client code call `http://<your-domain>/ip/<x.x.x.x>`

For example, if you're running the server locally then opening `http://localhost:3000/ip/1.2.3.4` in your browser will return some JSON that looks something like this:

```
{
    "city": {
        "geoname_id": 5804306,
        "names": {
            "en": "Mukilteo",
            ...
        }
    },
    "continent": {
        "code": "NA",
        "geoname_id": 6255149,
        "names": {
            "de": "Nordamerika",
            "en": "North America",
            ...
        }
    },
    "country": {
        "geoname_id": 6252001,
        "iso_code": "US",
        "names": {
            "de": "USA",
            "en": "United States",
            ...
        }
    },
    "location": {
        "latitude": 47.9445,
        "longitude": -122.3046,
        "metro_code": 819,
        "time_zone": "America/Los_Angeles"
    },
    "postal": {
        "code": "98275"
    },
    "registered_country": {
        "geoname_id": 2077456,
        "iso_code": "AU",
        "names": {
            "de": "Australien",
            "en": "Australia",
            ...
        }
    },
    "subdivisions": [{
        "geoname_id": 5815135,
        "iso_code": "WA",
        "names": {
            "en": "Washington",
            "es": "Washington",
            ...
        }
    }]
}
```

## Tested On

* Ubuntu 16.04 (Node v7.6.0)

## Data

The data for the server comes from the GeoLit2 DB provided by [maxmind.com](http://www.maxmind.com).

# Change Log

## 4.0.0

* Replace MongoDB with MMDB
* Remove /ip2/ endpoint
* Add /city/ endpoint
* Add /asn/ endpoint
* Also allow v6 IP addresses

## 3.1.1

* Don't crash if city block is not found.
* Improve typing

## 3.1.0

* Provide an API that allows this module to be used as a dependency in other projects for querying the DB directly.

## 3.0.0

* Change DB schema to use existing MongoDB `_id` for unique fields to make faster and more efficient.

## 2.0.1

* Remove DB creation from startup of server

## 2.0.0

### Breaking

* Download CSV instead of MMDB
* Require MongoDB for datastore
* Require Maxmind License Key

### Features

* Add /ip2/ to provide more data
* Convert to TypeScript

## 1.2.2

* Update dependencies

## 1.2.1

* Update dependencies
* Node 14.11.0

## 1.1.0

* Update Node to 8.x
* Update dependencies

## 1.0.0

* Update Node to 7.x
* Update dependencies
* Switch lint rules to Airbnb
* Add `forever` help commands for running in background
* Change default port to 3334 and make configurable from environment

## 0.0.4

* Add eslint

## 0.0.3

* Lock dependency versions

## 0.0.2

* Add CHANGELOG.md, CONTRIBUTING.md
* Mark repo as public to publish
*

## 0.0.1

* Initial commit
* Single API end point: /ip/x.x.x.x
* Auto-download and unzip DB if not present

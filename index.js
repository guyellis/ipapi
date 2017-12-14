const async = require('async');
const express = require('express');
const fs = require('fs');
const MMDBReader = require('mmdb-reader');
const path = require('path');
const request = require('request');
const zlib = require('zlib');
const validator = require('validator');

const cityUrl = 'http://geolite.maxmind.com/download/geoip/database/GeoLite2-City.mmdb.gz';
const dbFile = path.join(__dirname, 'db/GeoLite2-City.mmdb');
let reader;

const app = express();

/* eslint-disable no-console */

app.get('/ip', (req, res) => {
  console.log('Invalid request:', req.path);
  return res.status(404).send({
    error: 'Missing IP address. Usage example: /ip/8.8.8.8',
  });
});

app.get('/ip/:v4', (req, res) => {
  const { v4 } = req.params;
  if (!validator.isIP(v4, 4)) {
    return res.status(404).send({
      error: `Not a valid v4 IP address: ${v4}`,
    });
  }
  console.log(Date(), '=>', v4);
  return res.send(reader.lookup(v4));
});


// 1. Create "db" directory if it doesn't exist.
function createDbDir(callback) {
  const dir = path.join(__dirname, 'db');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    console.log('Made dir:', dir);
  } else {
    console.log('Dir exists:', dir);
  }
  return callback();
}

// 2. Download DB file if not exist
function downloadDB(callback) {
  if (!fs.existsSync(dbFile)) {
    process.stdout.write('Downloading DB');
    const dotWriter = setInterval(() => {
      process.stdout.write('.');
    }, 1000);
    request.get({
      url: cityUrl,
      encoding: null,
    }, (err, response, body) => {
      clearInterval(dotWriter);
      if (err) {
        return callback(err);
      }
      console.log('\nDownloaded DB');
      console.log('Unzipping DB');
      zlib.gunzip(body, (err2, dezipped) => {
        if (err2) {
          return callback(err2);
        }
        return fs.writeFile(dbFile, dezipped, (err3) => {
          console.log('Unzipped DB');
          return callback(err3);
        });
      });
      return undefined; // for lint
    });
  } else {
    console.log('DB exists');
    return callback();
  }
  return undefined; // for lint
}

// 3. Create MMDB reader
function createReader(callback) {
  reader = new MMDBReader(dbFile);
  console.log('DB reader created');
  callback();
}

async.waterfall([
  createDbDir,
  downloadDB,
  createReader,
], (err) => {
  if (err) {
    return console.log(err);
  }

  const p = process.env.IPAPI_PORT || '3334';
  const port = parseInt(p, 10);
  console.log(`Listening on ${port}`);
  return app.listen(port);
});

/* eslint-enable no-console */

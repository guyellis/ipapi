import express from 'express'
import fs from 'fs'
import path from 'path'
import request from 'request'

import validator from 'validator'
import extract from 'extract-zip'

const { MAXMIND_LICENSE_KEY } = process.env;

const cityUrl = `https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-City-CSV&license_key=${MAXMIND_LICENSE_KEY}&suffix=zip`;
const fileLocation = path.join(__dirname, 'db/');
const dbFile = path.join(__dirname, 'db/GeoLite2-City.mmdb');
const zipFilePath = path.join(__dirname, 'db/GeoLite2-City.zip');
let reader;

const { promises: fsp } = fs;

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
function createDbDir() {
  const dir = path.join(__dirname, 'db');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    console.log('Made dir:', dir);
  } else {
    console.log('Dir exists:', dir);
  }
}

// 2. Download DB file if not exist
const downloadDB = () => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(dbFile)) {
      process.stdout.write('Downloading DB');
      const dotWriter = setInterval(() => {
        process.stdout.write('.');
      }, 500);
      request.get({
        url: cityUrl,
        encoding: null,
      }, async (err, response, body) => {
        if (err) {
          clearInterval(dotWriter);
          return reject(err);
        }
        console.log('\nDownloaded CSV zip');
        await fsp.writeFile(zipFilePath, body);
        console.log('Save CSV zip to db/');
        clearInterval(dotWriter);
        console.log('Unzipping DB');
        await extract(zipFilePath, { dir: fileLocation });
        // zlib..unzip(body, (err2, dezipped) => {
        //   if (err2) {
        //     return callback(err2);
        //   }
        //   return fs.writeFile(dbFile, dezipped, (err3) => {
        //     console.log('Unzipped DB');
        //     return callback(err3);
        //   });
        // });
        return resolve();
      });
    } else {
      console.log('DB exists');
      return resolve();
    }
    return resolve;
  });
}

// 3. Create MMDB reader
// function createReader(callback) {
//   reader = new MMDBReader(dbFile);
//   console.log('DB reader created');
//   callback();
// }

export const main = async () => {
  createDbDir();
  await downloadDB();

  const p = process.env.IPAPI_PORT || '3334';
  const port = parseInt(p, 10);
  console.log(`Listening on ${port}`);
  return app.listen(port);
}

/* eslint-enable no-console */

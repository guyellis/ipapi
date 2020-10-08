import fs from 'fs'
import path from 'path'
import request from 'request'

import extract from 'extract-zip'

const { MAXMIND_LICENSE_KEY } = process.env;

const cityUrl = `https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-City-CSV&license_key=${MAXMIND_LICENSE_KEY}&suffix=zip`;
const fileLocation = path.join(__dirname, 'db/');
const dbFile = path.join(__dirname, 'db/GeoLite2-City.mmdb');
const zipFilePath = path.join(__dirname, 'db/GeoLite2-City.zip');

const { promises: fsp } = fs;

const unzipDb = async () => {
  await extract(zipFilePath, { dir: fileLocation });
}

// Download DB file if not exist
export const downloadDB = () => {
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
        await unzipDb();
        return resolve();
      });
    } else {
      console.log('DB exists');
      return resolve();
    }
    return resolve;
  });
}

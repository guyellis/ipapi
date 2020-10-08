import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'

import extract from 'extract-zip'
import util from 'util';
import { pipeline } from 'stream';

const streamPipeline = util.promisify(pipeline);

const { MAXMIND_LICENSE_KEY } = process.env;

const cityUrl = `https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-City-CSV&license_key=${MAXMIND_LICENSE_KEY}&suffix=zip`;
const fileLocation = path.join(__dirname, 'db/');
const dbFile = path.join(__dirname, 'db/GeoLite2-City.mmdb');
const zipFilePath = path.join(__dirname, 'db/GeoLite2-City.zip');

const unzipDb = async () => {
  await extract(zipFilePath, { dir: fileLocation });
}

// Download DB file if not exist
export const downloadDB = async () => {
  process.stdout.write('Downloading DB');
  const dotWriter = setInterval(() => {
    process.stdout.write('.');
  }, 500);

  const response = await fetch(cityUrl);
  if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);
  console.log('\nDownloaded CSV zip');

  await streamPipeline(response.body, fs.createWriteStream(zipFilePath))
  console.log('Saved CSV zip to db/');

  // const body = await result.blob();

  // await fsp.writeFile(zipFilePath, body);

  console.log('Unzipping DB');
  await unzipDb();

  clearInterval(dotWriter);
}

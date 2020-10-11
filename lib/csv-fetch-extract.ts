import fs from 'fs';
import fetch from 'node-fetch';

import extract from 'extract-zip';
import util from 'util';
import { pipeline } from 'stream';
import { logAction } from './log-utils';
import { getDownloadFileLocation, getZipFilePath } from './file-utils';

const streamPipeline = util.promisify(pipeline);

const { MAXMIND_LICENSE_KEY } = process.env;

const cityUrl = `https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-City-CSV&license_key=${MAXMIND_LICENSE_KEY}&suffix=zip`;
const fileLocation = getDownloadFileLocation();
const zipFilePath = getZipFilePath();

const unzipDb = async (): Promise<void> => {
  await extract(zipFilePath, { dir: fileLocation });
};

// Download DB file if not exist
export const downloadDB = async (): Promise<void> => {
  let endAction = logAction('Downloading DB');
  // process.stdout.write('Downloading DB');
  // const dotWriter = setInterval(() => {
  //   process.stdout.write('.');
  // }, 500);

  const response = await fetch(cityUrl);
  if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);
  // console.log('\nDownloaded CSV zip');
  endAction();

  endAction = logAction('Save CSV zip to db/');
  await streamPipeline(response.body, fs.createWriteStream(zipFilePath));
  // console.log('Saved CSV zip to db/');
  endAction();

  endAction = logAction('Unzip DB');
  // console.log('Unzipping DB');
  await unzipDb();
  endAction();

  // clearInterval(dotWriter);
};

import fs from 'fs';
import fetch from 'node-fetch';
import pMap from 'p-map';

import decompress from 'decompress';
import util from 'util';
import { pipeline } from 'stream';
import { logAction } from './log-utils';
import { getDownloadFileLocation, getZipFilePath } from './file-utils';

const streamPipeline = util.promisify(pipeline);

const { MAXMIND_LICENSE_KEY } = process.env;
type Suffix = 'zip' | 'tar.gz';

const fileLocation = getDownloadFileLocation();

const unzipDb = async (editionId: string, suffix: Suffix): Promise<void> => {
  const zipFilePath = getZipFilePath(editionId, suffix);

  // await decompress(zipFilePath, { dir: fileLocation });
  await decompress(zipFilePath, fileLocation);

};

const getUrl = (editionId: string, suffix: Suffix): string => `https://download.maxmind.com/app/geoip_download?edition_id=${editionId}&license_key=${MAXMIND_LICENSE_KEY}&suffix=${suffix}`;

const downloadEdition = async (editionId: string, suffix: Suffix): Promise<void> => {
  let endAction = logAction(`Downloading DB ${editionId} - ${suffix}`);

  const cityUrl = getUrl(editionId, suffix);
  const response = await fetch(cityUrl);
  if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);
  endAction();

  const zipFilePath = getZipFilePath(editionId, suffix);

  endAction = logAction(`Save ${editionId} zip to ${zipFilePath}`);
  await streamPipeline(response.body, fs.createWriteStream(zipFilePath));
  endAction();

  endAction = logAction(`Unzip ${zipFilePath}`);
  await unzipDb(editionId, suffix);
  endAction();
};

const editionIds: [string, Suffix][] = [
  // ['GeoLite2-City-CSV', 'zip'],
  ['GeoLite2-City', 'tar.gz'],
  ['GeoLite2-ASN', 'tar.gz'],
];

export const downloadDB = async (): Promise<void> => {
  const mapper = ([editionId, suffix]: [string, Suffix]): Promise<void> => downloadEdition(editionId, suffix);

  await pMap(editionIds, mapper, { concurrency: 1 });
};

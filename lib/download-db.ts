import path from 'path';
import { downloadFolder } from './constants';
import { setDbLocation } from './db/maxmind/db-helper';
import { downloadDB } from './file-fetch-extract';

const main = async (): Promise<void> => {
  const downloadFileLocation = path.join(__dirname, downloadFolder);
  await setDbLocation(downloadFileLocation);
  await downloadDB(downloadFileLocation);
};

main();

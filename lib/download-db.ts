import path from 'path';
import { downloadFolder } from './constants';
import { setDbLocation } from './db/maxmind/db-helper';
import { downloadDB } from './file-fetch-extract';

const main = async (): Promise<void> => {
  const { MAXMIND_LICENSE_KEY } = process.env;
  if (!MAXMIND_LICENSE_KEY) {
    console.error('You need to export MAXMIND_LICENSE_KEY');
    process.exit();
  }

  const downloadFileLocation = path.join(__dirname, downloadFolder);
  await setDbLocation(downloadFileLocation);
  await downloadDB(downloadFileLocation);
};

main();

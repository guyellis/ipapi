import fs from 'fs';
import path from 'path';
import glob from 'fast-glob';

const downloadFolder = 'db-csv-dl';

export const getDownloadFileLocation = (): string => path.join(__dirname, downloadFolder);
export const getZipFilePath = (): string => path.join(__dirname, downloadFolder, 'GeoLite2-City.zip');

// Create "db" directory if it doesn't exist.
export const createDbDir = (): void => {
  const dir = getDownloadFileLocation();
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    console.log('Made dir:', dir);
  } else {
    console.log('Dir exists:', dir);
  }
};

export const findFileLocation = async (): Promise<string> => {
  const base = getDownloadFileLocation();
  const dir = await glob(base + '/**/GeoLite2-City-CSV*', {
    onlyDirectories: true,
  });
  if(dir.length === 0) {
    throw new Error('No directory found match pattern.');
  }
  dir.sort().reverse();
  return dir[0];
};

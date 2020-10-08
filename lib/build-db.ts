// import loki from 'lokijs';
import path from 'path';
import glob from 'fast-glob';

const findFileLocation = async (): Promise<string> => {
  const base = path.join(__dirname, 'db');
  const dir = await glob(base + '/**/GeoLite2-City-CSV*', {
    onlyDirectories: true,
  });
  if(dir.length === 0) {
    console.error('No directory found match pattern.');
  }
  dir.sort().reverse();
  return dir[0];
};

export const buildDb = async (): Promise<void> => {
  const fileLocation = await findFileLocation();
  console.log(fileLocation);
};
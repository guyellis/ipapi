import loki from 'lokijs';
import path from 'path';
import glob from 'fast-glob';
import { buildCityLocations } from './build-city-locations';

const findFileLocation = async (): Promise<string> => {
  const base = path.join(__dirname, 'db');
  const dir = await glob(base + '/**/GeoLite2-City-CSV*', {
    onlyDirectories: true,
  });
  if(dir.length === 0) {
    throw new Error('No directory found match pattern.');
  }
  dir.sort().reverse();
  return dir[0];
};


export const buildDb = async (): Promise<void> => {
  const fileLocation = await findFileLocation();
  console.log(fileLocation);

  const db = new loki('ip.db');
  await buildCityLocations(fileLocation, db);
};

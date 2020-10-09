import loki from 'lokijs';
import path from 'path';
import glob from 'fast-glob';
import { buildCityLocations } from './build-city-locations';
import { buildCityBlocksIpv4 } from './build-city-blocks-ip-v4';

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

// export const ipFinderSetup = (db: loki) => {
//   db.collections('city-blocks').;
// };

export const buildDb = async (): Promise<loki> => {
  const fileLocation = await findFileLocation();
  // console.log(fileLocation);

  const db = new loki('ip.db');
  await buildCityLocations(fileLocation, db);
  await buildCityBlocksIpv4(fileLocation, db);
  return db;
};

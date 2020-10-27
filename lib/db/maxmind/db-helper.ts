import { Reader } from '@maxmind/geoip2-node';
import ReaderModel from '@maxmind/geoip2-node/dist/src/readerModel';
import fse from 'fs-extra';
import { getAsnDbFilePath, getCityDbFilePath } from '../../file-utils';

let cityReader: ReaderModel;
let asnReader: ReaderModel;

interface DbReaders {
  cityReader: ReaderModel;
  asnReader: ReaderModel;
}

let dbLocation = '';
export const setDbLocation = async (dbFileLocation: string) => {
  dbLocation = dbFileLocation;
  await fse.ensureDir(dbFileLocation);
}

/**
 * Get the DB connection to use for a CRUD operation.
 * If it doesn't exist then create it.
 */
export const getDatabase = async (): Promise<DbReaders> => {
  if (!dbLocation) {
    throw new Error('Call setDbLocation() with a location for the DataBase first.');
  }
  if (!cityReader) {
    const options = {};
    const cityDbFilePath = await getCityDbFilePath(dbLocation);
    cityReader = await Reader.open(cityDbFilePath, options);
  }
  if (!asnReader) {
    const options = {};
    const asnDbFilePath = await getAsnDbFilePath(dbLocation);
    asnReader = await Reader.open(asnDbFilePath, options);
  }
  return {
    asnReader,
    cityReader,
  };
};

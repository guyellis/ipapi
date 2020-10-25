import { Reader } from '@maxmind/geoip2-node';
import ReaderModel from '@maxmind/geoip2-node/dist/src/readerModel';
import { getAsnDbFilePath, getCityDbFilePath } from '../../file-utils';

let cityReader: ReaderModel;
let asnReader: ReaderModel;

interface DbReaders {
  cityReader: ReaderModel;
  asnReader: ReaderModel;
}

/**
 * Get the DB connection to use for a CRUD operation.
 * If it doesn't exist then create it.
 */
export const getDatabase = async (): Promise<DbReaders> => {
  if (!cityReader) {
    const options = {};
    const cityDbFilePath = await getCityDbFilePath();
    cityReader = await Reader.open(cityDbFilePath, options);
  }
  if (!asnReader) {
    const options = {};
    const asnDbFilePath = await getAsnDbFilePath();
    asnReader = await Reader.open(asnDbFilePath, options);
  }
  return {
    asnReader,
    cityReader,
  };
};

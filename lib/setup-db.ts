import { createDbDir } from './file-utils';
import { downloadDB } from './csv-fetch-extract';
import { buildDb } from './build-db';

/**
 * Download CSV from Maxmind
 * Unpack CSV
 * Remove collections from MongoDB database
 * Parse CSV files
 * Load CSV files into collections in DB
 */
const setupDb = async (): Promise<void> => {
  createDbDir();
  await downloadDB();
  await buildDb();
  process.exit(0);
};

setupDb();

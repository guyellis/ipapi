import { Db, MongoClient } from 'mongodb';
import { logAction } from '../../log-utils';
import { createIndexCityBlocks } from './city-blocks-ip-v4';
// import { createIndexCityLocations } from './city-locations';

let client: MongoClient;
let db: Db;

/**
 * Get the DB connection to use for a CRUD operation.
 * If it doesn't exist then create it.
 */
export const getDatabase = async (): Promise<Db> => {
  if (!db) {
    const {
      IPAPI_DB_HOST: dbHost,
      IPAPI_DB_PORT: dbPort,
    } = process.env;
    if (!dbHost || !dbPort) {
      throw new Error(`Both IPAPI_DB_HOST (${dbHost}) and IPAPI_DB_PORT (${dbPort}) must be set as environment variables.`);
    }
    const connection = `mongodb://${dbHost}:${dbPort}/ip`;
    if (!connection) {
      throw new Error(`DB connection not set ${connection} - initDb() not called`);
    }
    client = await MongoClient.connect(connection, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    if (!client) {
      throw new Error(`client is not truthy ${client}`);
    }
    const parts = connection.split('/');
    db = client.db(parts.pop());
  }
  return db;
};

export const setupIndexes = async (): Promise<void> => {
  // await createIndexCityLocations();
  await createIndexCityBlocks();
}

export const resetDb = async (): Promise<void> => {
  const db = await getDatabase();
  const collections = await db.collections()
  for (const collection of collections) {
    const endAction = logAction('Drop collection');
    const stats = await collection.stats();
    await collection.drop();
    endAction(`Dropped ${stats.ns} with ${stats.count.toLocaleString()} records.`);
  }
}

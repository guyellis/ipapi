// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as http from "http";
import express from 'express';

import validator from 'validator';
import { createDbDir } from './file-utils';
import { downloadDB } from './db-fetch-extract';

let reader;
const app = express();

/* eslint-disable no-console */

app.get('/ip', (req, res) => {
  console.log('Invalid request:', req.path);
  return res.status(404).send({
    error: 'Missing IP address. Usage example: /ip/8.8.8.8',
  });
});

app.get('/ip/:v4', (req, res) => {
  const { v4 } = req.params;
  if (!validator.isIP(v4, 4)) {
    return res.status(404).send({
      error: `Not a valid v4 IP address: ${v4}`,
    });
  }
  console.log(Date(), '=>', v4);
  return res.send(reader.lookup(v4));
});

// 3. Create MMDB reader
// function createReader(callback) {
//   reader = new MMDBReader(dbFile);
//   console.log('DB reader created');
//   callback();
// }

export const main = async (): Promise<http.Server> => {
  createDbDir();
  await downloadDB();

  const p = process.env.IPAPI_PORT || '3334';
  const port = parseInt(p, 10);
  console.log(`Listening on ${port}`);
  return app.listen(port);
};

/* eslint-enable no-console */

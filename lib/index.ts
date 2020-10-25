import * as http from 'http';
import express, { Request, Response } from 'express';
import validator from 'validator';

import { ipFinderLegacy } from './build-db';
import { findCityByIp } from './db/maxmind/city';
import { findAsnByIp } from './db/maxmind/asn';
import { downloadDB } from './file-fetch-extract';
import { createDbDir } from './file-utils';

const app = express();

app.get('/ip', (req, res) => {
  console.log('Invalid request:', req.path);
  return res.status(404).send({
    error: 'Missing IP address. Usage example: /ip/8.8.8.8',
  });
});

const validateIp = (req: Request, res: Response): string | null => {
  const { ipAddress } = req.params;
  if (!validator.isIP(ipAddress)) {
    res.status(400).send({
      error: `Not a valid v4 or v6 IP address: ${ipAddress}`,
    });
    return null;
  }
  console.log(Date(), '=>', ipAddress);
  return ipAddress;
};

/**
 * Returns the original structure that the reader module provided.
 */
app.get('/ip/:ipAddress', async (req, res) => {
  const ipAddress = validateIp(req, res);
  if (ipAddress) {
    const cityLocation = await ipFinderLegacy(ipAddress);
    return res.send(cityLocation);
  }
});

/**
 * Returns all the City data from the MMDB
 */
app.get('/city/:ipAddress', async (req, res) => {
  const ipAddress = validateIp(req, res);
  if (ipAddress) {
    const city = await findCityByIp(ipAddress);
    return res.send(city);
  }
});

app.get('/asn/:ipAddress', async (req, res) => {
  const ipAddress = validateIp(req, res);
  if (ipAddress) {
    const asn = await findAsnByIp(ipAddress);
    return res.send(asn);
  }
});

export const main = async (): Promise<http.Server> => {
  createDbDir();
  await downloadDB();
  const p = process.env.IPAPI_PORT || '3334';
  const port = parseInt(p, 10);
  console.log(`Listening on ${port}`);
  return app.listen(port);
};

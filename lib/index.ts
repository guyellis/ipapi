import * as http from 'http';
import express from 'express';
import validator from 'validator';

import { ipFinder, ipFinderLegacy } from './build-db';

const app = express();

app.get('/ip', (req, res) => {
  console.log('Invalid request:', req.path);
  return res.status(404).send({
    error: 'Missing IP address. Usage example: /ip/8.8.8.8',
  });
});

/**
 * Returns the original structure that the reader module provided.
 */
app.get('/ip/:v4', async (req, res) => {
  const { v4 } = req.params;
  if (!validator.isIP(v4, 4)) {
    return res.status(404).send({
      error: `Not a valid v4 IP address: ${v4}`,
    });
  }
  console.log(Date(), '=>', v4);
  const cityLocation = await ipFinderLegacy(v4);
  return res.send(cityLocation);
});

/**
 * Returns all the data from both CityLocation and CityBlock
 */
app.get('/ip2/:v4', async (req, res) => {
  const { v4 } = req.params;
  if (!validator.isIP(v4, 4)) {
    return res.status(404).send({
      error: `Not a valid v4 IP address: ${v4}`,
    });
  }
  console.log(Date(), '=>', v4);
  const cityLocation = await ipFinder(v4);
  return res.send(cityLocation);
});

export const main = async (): Promise<http.Server> => {
  const p = process.env.IPAPI_PORT || '3334';
  const port = parseInt(p, 10);
  console.log(`Listening on ${port}`);
  return app.listen(port);
};

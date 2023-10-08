import https from 'https';
import fs from 'fs';
import express from 'express';
import path from 'path';

import asyncHandler from 'express-async-handler';

import {
  createPostHandler,
  listPostHandler,
} from './handlers/postHandlers';
import { initDb } from './datastore';
import { signInHandler, signUpHandler } from './handlers/authHandler';
import { loggerMiddleware } from './middlerware/loggerMiddleware';
import { errHandler } from './middlerware/errorMiddleware';

import dotenv from 'dotenv';
import { authMiddleware } from './middlerware/authMiddleware';

const app = express();

(async () => {
  await initDb();
  dotenv.config();

  app.use(express.json());

  app.use(loggerMiddleware);

  //public endpoints
  app.get('/healthz', (_, res) => res.send({ status: '✌ 🏻' }));
  app.post('/v1/signup', asyncHandler(signUpHandler));
  app.post('/v1/signin', asyncHandler(signInHandler));

  app.use(authMiddleware);

  //protected endpoints
  app.get('/v1/posts', asyncHandler(listPostHandler));
  app.post('/v1/posts', asyncHandler(createPostHandler));

  app.use(errHandler);

  const port = process.env.PORT;
  const env = process.env.ENV;

  const listener = () =>
    console.log(`Listening on port ${port} on ${env} envirnoment`);

  if (env === 'production') {
    const key = fs.readFileSync(
      '/home/ibnHamdan/certs/privkey1.pem',
      'utf-8'
    );

    // const key = fs.readFileSync(
    //   path.join(__dirname, '../../../certs/') + 'privkey.pem',
    //   'utf-8'
    // );

    const cert = fs.readFileSync(
      '/home/ibnHamdan/certs/cert1.pem',
      'utf-8'
    );

    https.createServer({ key, cert }, app).listen(port, listener);
  } else {
    app.listen(port, listener);
  }
})();

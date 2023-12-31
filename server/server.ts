import express from 'express';

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
  app.get('/healthz', (req, res) => res.send({ status: '✌🏻' }));
  app.post('/v1/signup', asyncHandler(signUpHandler));
  app.post('/v1/signin', asyncHandler(signInHandler));

  app.use(authMiddleware);

  //protected endpoints
  app.get('/v1/posts', asyncHandler(listPostHandler));
  app.post('/v1/posts', asyncHandler(createPostHandler));

  app.use(errHandler);

  app.listen(process.env.PORT || 3000);
})();

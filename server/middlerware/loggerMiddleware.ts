import { RequestHandler } from 'express';

export const loggerMiddleware: RequestHandler = (req, res, next) => {
  console.log(`New Request: ${req.path}, - body: ${req.body}`);
  next();
};

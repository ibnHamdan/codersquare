import { ErrorRequestHandler } from 'express';

export const errHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  console.log('Uncaught exception: ', err);
  return res.status(500).send('Oops, an unexpected error occurred, ');
};

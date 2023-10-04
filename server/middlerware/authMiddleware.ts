import { verifyJwt } from '../auth';
import { db } from '../datastore';
import { ExpressHandler } from '../types';

export const authMiddleware: ExpressHandler<any, any> = async (
  req,
  res,
  next
) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.sendStatus(401);
  }
  try {
    if (!token) {
      throw 'no token';
    }
    const payload = verifyJwt(token);
    const user = await db.getUserById(payload.userId);
    if (!user) {
      throw 'not found';
    }
    next();
  } catch {
    return res.status(401).send({ error: 'Bad token' });
  }
};

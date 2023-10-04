import {
  SignInRequest,
  SignInRespose,
  SignUpRequest,
  SignUpResponse,
} from '../api';
import { ExpressHandler, User } from '../types';
import { db } from '../datastore';
import crypto from 'crypto';
import { signJwt } from '../auth';

export const signUpHandler: ExpressHandler<
  SignUpRequest,
  SignUpResponse
> = async (req, res) => {
  const { email, firstName, lastName, password, username } = req.body;
  if (!email || !firstName || !lastName || !username || !password) {
    return res.sendStatus(400);
  }

  const existing =
    (await db.getUserByEmail(email)) ||
    (await db.getuserByUsername(username));
  console.log(await existing);
  if (existing) {
    return res.status(403).send({ error: 'User already exists' });
  }

  const user: User = {
    id: crypto.randomUUID(),
    email,
    firstName,
    lastName,
    username,
    password: hashPassword(password),
  };

  await db.createUser(user);
  const jwt = signJwt({ userId: user.id });
  return res.status(200).send({
    jwt,
  });
};

export const signInHandler: ExpressHandler<
  SignInRequest,
  SignInRespose
> = async (req, res) => {
  const { login, password } = req.body;
  console.log(login, password);

  if (!login || !password) {
    return res.status(400);
  }

  const existing =
    (await db.getUserByEmail(login)) ||
    (await db.getuserByUsername(login));

  if (!existing || existing.password !== hashPassword(password)) {
    return res.sendStatus(403);
  }
  console.log(
    'find',
    await db.getUserByEmail(login),
    await db.getuserByUsername(login),
    login,
    password
  );

  const jwt = signJwt({ userId: existing.id });

  return res.status(200).send({
    user: {
      email: existing.email,
      firstName: existing.firstName,
      lastName: existing.lastName,
      username: existing.lastName,
      id: existing.id,
    },
    jwt: jwt,
  });
};

function hashPassword(password: string): string {
  return crypto
    .pbkdf2Sync(
      password,
      process.env.PASSWORD_SALT!,
      42,
      64,
      'sha512'
    )
    .toString('hex');
}

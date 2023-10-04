import { JwtObject } from './types';
import jwt from 'jsonwebtoken';

export function signJwt(obj: JwtObject): string {
  return jwt.sign(obj, getJwtSecret(), {
    expiresIn: '15d',
  });
}

// throws on bad token
export function verifyJwt(token: string): JwtObject {
  return jwt.verify(token, getJwtSecret()) as JwtObject;
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.log('Missing JWT secret');
    process.exit(1);
  }
  return secret;
}

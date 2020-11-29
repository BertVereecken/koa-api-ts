import { verify, sign } from 'jsonwebtoken';
import { Payload, User } from '../types';

export const generateToken = ({ userId, role }: User): string => {
  if (!userId || !role) throw new Error('COULD_SIGN_TOKEN');

  const tokenSecret = process.env.TOKEN_SECRET_KEY;

  const tokenOptions = {
    expiresIn: '2 days', // 2 days
  };

  const token = sign({ userId, role }, tokenSecret as string, tokenOptions);

  if (!token) {
    throw new Error('Something went wrong generating the token');
  }

  return token;
};

/**
 * Decode JWT token
 * @param jwtToken
 */
export const decodeToken = (jwtToken: string): Payload => {
  const tokenSecret = process.env.TOKEN_SECRET_KEY;

  const payload = verify(jwtToken, tokenSecret as string);

  if (!payload) {
    throw new Error('Something went wrong decoding the token');
  }
  const { roles, userId } = payload as Payload;

  return { userId, roles };
};

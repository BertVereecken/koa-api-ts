import { AuthenticationError } from 'apollo-server-koa';
import { hash, compare } from 'bcryptjs';
import { winstonLogger } from '../logging';
const saltRounds = 12;

const logger = winstonLogger('generateHash');

export const generateHash = async (unhashedPassword: string): Promise<string> => {
  const hashedPassword = await hash(unhashedPassword, saltRounds);

  if (!hashedPassword) {
    throw new AuthenticationError('COULD_NOT_HASH_PASSWORD');
  }

  return hashedPassword;
};

export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  const isPasswordValid = await compare(password, hashedPassword);
  logger.info(`isPasswordValid: ${isPasswordValid}`);
  if (!isPasswordValid) {
    throw new AuthenticationError('Wrong credentials');
  }
  return isPasswordValid;
};

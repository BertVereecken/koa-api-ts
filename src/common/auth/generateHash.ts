import { AuthenticationError } from 'apollo-server-koa';
import { hash, compare } from 'bcryptjs';
const saltRounds = 12;

export const generateHash = async (unhashedPassword: string): Promise<string> => {
  const hashedPassword = await hash(unhashedPassword, saltRounds);

  // TODO: custom error handling
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

  // TODO: custom error handling
  if (!isPasswordValid) {
    throw new AuthenticationError('PASSWORD_IS_INVALID');
  }
  return isPasswordValid;
};

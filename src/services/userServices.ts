import { NotFoundError } from '../core';
import { User } from '../database';

export const getUserByEmail = async (email: string): Promise<User | undefined> => {
  return User.findOne({ email });
};

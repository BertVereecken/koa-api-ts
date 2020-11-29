import { User } from './user.model';

export const getUserByEmail = async (email: string): Promise<User | undefined> => {
  return User.findOne({ email });
};

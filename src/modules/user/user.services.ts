import { Role } from '../../common';
import { User } from './user.model';

export const getUserByEmail = async (email: string): Promise<User | undefined> => {
  return User.findOne({ email });
};

export const getUserById = async (id: string): Promise<User[] | undefined> => {
  return User.findByIds([id]);
};

export const getUserRole = async (id: string): Promise<Role | undefined> => {
  const user = await User.findOne(id, { select: ['role'] });
  return user?.role;
};

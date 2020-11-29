import { Role } from './enums';

export interface User {
  userId: string;
  role: Role;
}

export interface Payload {
  userId: string;
  roles: string[];
}

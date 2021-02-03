import { Mandatory } from 'common/types';

export enum UserRole {
  Admin = 'Admin',
  User = 'User'
}

export interface UserRequired {
  firstName: string;
  lastName: string;
  email: string;
  role?: UserRole;
  active?: boolean;
}

export interface UserItems extends Mandatory<UserRequired> {
  id: string;
}

import { Mandatory } from 'common/types';
import { CreationAttributes } from 'sequelize';
import { User } from './user';

export enum UserRole {
  Admin = 'Admin',
  User = 'User'
}

export interface UserRequired extends CreationAttributes<User> {
  firstName: string;
  lastName: string;
  email: string;
  role?: UserRole;
  active?: boolean;
}

export interface UserItems extends Mandatory<UserRequired> {
  id: string;
}

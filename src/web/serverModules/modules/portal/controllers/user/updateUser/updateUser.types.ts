import { UserRequired } from 'model/sequelize/user/user.types';

export type UserBody = Omit<Partial<UserRequired>, 'email'>;

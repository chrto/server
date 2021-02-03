import { UserRequired } from 'model/sequelize/model/user/user.types';

export type UserBody = Omit<Partial<UserRequired>, 'email'>;

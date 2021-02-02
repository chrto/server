import { Includeable } from 'sequelize/types';

export interface SequelizeIncludes {
  include: Includeable[];
}

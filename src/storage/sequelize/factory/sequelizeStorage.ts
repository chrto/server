import findAll from './findAll/findAll';
import findOne from './findOne/findOne';
import findAndCountAll from './findAndCountAll/findAndCountAll';
import findByPk from './findByPk/findByPk';
import updateByPk from './updateByPk/updateByPk';
import update from './update/update';
import create from './create/create';
import bulkCreate from './bulkCreate/bulkCreate';
import destroy from './destroy/destroy';
import { Model } from 'sequelize/types';
import { SequelizeStorage } from './sequelizeStorage.types';

export default <T extends Model> (model: { new(): T; } & typeof Model): SequelizeStorage<T> => ({
  findAll: findAll<T>(model),
  findOne: findOne<T>(model),
  findAndCountAll: findAndCountAll<T>(model),
  findByPk: findByPk<T>(model),
  updateByPk: updateByPk<T>(model),
  update: update<T>(model),
  create: create<T>(model),
  bulkCreate: bulkCreate<T>(model),
  destroy: destroy<T>(model)
});

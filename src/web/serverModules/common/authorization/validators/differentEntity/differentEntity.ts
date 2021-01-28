import { Entity } from 'model/sequelize/modelFactory/modelFactory.types';

export default <T>(entity1: Entity<T>, entity2: Entity<T>): boolean =>
  entity1.id !== entity2.id;

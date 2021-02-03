import { Model } from 'sequelize';

/** Turn a Sequelize entity into a plain JS object */
export const sanitizeEntity = <T> (entity: Model<T>): any => entity ? entity.get({ plain: true }) : null;

/** Turn an array of Sequelize entities into an array of plain JS objects */
export const sanitizeEntities = <T> (entities: Model<T>[]): any[] => entities.map(sanitizeEntity);

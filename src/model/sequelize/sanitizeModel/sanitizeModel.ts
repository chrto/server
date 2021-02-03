import { Model } from 'sequelize';

/** Turn a Sequelize entity into a plain JS object */
export default <T extends object> (entity: Model<T>): any => entity ? entity.get({ plain: true }) : null;

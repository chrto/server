import sanitizeModel from './sanitizeModel';
import { Model } from 'sequelize';

/** Turn an array of Sequelize entities into an array of plain JS objects */
export default <T> (entities: Model<T>[]): any[] => entities.map(sanitizeModel);

import { Sequelize } from 'sequelize';

type ModelInit = (sequelize: Sequelize) => void;
export interface InitModels {
  userModel: ModelInit;
}

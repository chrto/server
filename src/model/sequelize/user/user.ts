import { DataTypes, Model, Sequelize } from 'sequelize';
import { UserItems, UserRole } from './user.types';

export class User extends Model implements UserItems {
  public readonly id!: string;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public active!: boolean;
  public role!: UserRole;
  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // helper functions
  get fullName (): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get isAdmin (): boolean {
    return this.role === UserRole.Admin;
  }
}

export default (sequelize: Sequelize): void =>
  User.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID
      },
      firstName: {
        type: DataTypes.STRING(50),
        field: 'first_name',
        allowNull: false
      },
      lastName: {
        type: DataTypes.STRING(50),
        field: 'last_name',
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: 'uq_users_email',
        validate: {
          isEmail: true
        }
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      role: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: UserRole.User,
        validate: {
          isIn: [[UserRole.Admin, UserRole.User]]
        }
      }
    },
    {
      sequelize,
      tableName: 'users',
      modelName: 'user'
    }
  );

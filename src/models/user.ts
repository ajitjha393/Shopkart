import { DataTypes, Model, HasManyCreateAssociationMixin } from 'sequelize';

import { sequelize } from '../utils/database';
import { Cart } from './cart';

class User extends Model {
	public id!: number;
	public name!: string;
	public email!: string;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;

	public createCart!: HasManyCreateAssociationMixin<Cart>;
}

User.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true,
		},

		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},

		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{ sequelize, modelName: 'user' }
);

export { User };

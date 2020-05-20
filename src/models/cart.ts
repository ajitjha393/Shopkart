import { DataTypes, Model } from 'sequelize';

import { sequelize } from '../utils/database';

class Cart extends Model {
	public id!: number;
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

Cart.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true,
		},
	},
	{ sequelize, modelName: 'cart' }
);

export { Cart };

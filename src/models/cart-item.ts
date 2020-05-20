import { DataTypes, Model } from 'sequelize';

import { sequelize } from '../utils/database';

class CartItem extends Model {
	public id!: Number;
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

CartItem.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true,
		},

		quantity: {
			type: DataTypes.INTEGER,
			// allowNull: false,
		},
	},
	{ sequelize, modelName: 'cartItem' }
);

export { CartItem };

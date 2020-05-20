import { DataTypes, Model } from 'sequelize';

import { sequelize } from '../utils/database';

class OrderItem extends Model {
	public id!: Number;
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

OrderItem.init(
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
	{ sequelize, modelName: 'orderItem' }
);

export { OrderItem };

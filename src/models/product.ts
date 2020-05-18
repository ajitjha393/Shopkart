import { DataTypes, Model } from 'sequelize';

import { sequelize } from '../utils/database';

class Product extends Model {
	public id!: number;
	public title!: string;
	public price!: number;
	public imageUrl!: string;
	public description!: string;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

Product.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true,
		},

		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},

		price: {
			type: DataTypes.DOUBLE(undefined, 2),
			allowNull: false,
		},

		imageUrl: {
			type: DataTypes.STRING,
			allowNull: false,
		},

		description: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	},
	{ sequelize, modelName: 'product' }
);

export { Product };

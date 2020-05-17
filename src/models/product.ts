import { executeQuery } from '../utils/database';
import { getProducts } from '../controllers/admin';

export interface ProductInterface {
	id: string;
	title: string;
	imageUrl: string;
	description: string;
	price: number;
}
let products: Product[] = [];

export class Product implements ProductInterface {
	id: string;
	title: string;
	imageUrl: string;
	description: string;
	price: number;

	constructor(
		id: string,
		title: string,
		imageUrl: string,
		description: string,
		price: number
	) {
		this.id = id;
		this.title = title;
		this.imageUrl = imageUrl;
		this.description = description;
		this.price = price;
	}

	async save() {
		if (this.id === '') {
			return executeQuery({
				sql: `insert into Products(title,price,description,imageurl) values(?,?,?,?)`,
				values: [
					this.title,
					this.price,
					this.description,
					this.imageUrl,
				],
			});
		}

		return executeQuery({
			sql:
				'UPDATE Products SET title = ? , price = ? , description = ? , imageUrl = ? where id = ?',
			values: [
				this.title,
				this.price,
				this.description,
				this.imageUrl,
				+this.id,
			],
		});
	}

	static fetchAll() {
		return executeQuery({ sql: 'SELECT * FROM Products' });
	}

	static getProductById(id: string) {
		return executeQuery({
			sql: 'Select * from Products where id = ?',
			values: [id],
		});
	}

	static async deleteProduct(id: string) {
		return executeQuery({
			sql: 'Delete from Products where id = ?',
			values: [+id],
		});
	}
}

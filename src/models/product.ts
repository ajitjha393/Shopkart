import path from 'path';
import rootDir from '../utils/rootDir';
import uniqid from 'uniqid';

import { readFile, writeFile } from '../utils/fileUtility';
import { Cart } from './cart';

const p = path.join(rootDir, '..', 'data', 'products.json');

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
		products = await readFile<Product[]>(p, (err: any, data: Buffer) => {
			if (!err) {
				return JSON.parse(data.toString());
			}
			return [];
		});

		// If the product did not existed
		if (this.id === '') {
			this.id = uniqid();

			products.push(this);
		} else {
			const originalProductIndex = products.findIndex(
				prod => prod.id === this.id
			);

			products[originalProductIndex] = this;
		}
		writeFile<Product[]>(p, products);
		// fs.writeFile(p, JSON.stringify(products), err =>
		// 	err ? console.log(err) : null
		// );
	}

	static async fetchAll() {
		return await readFile<Product[]>(p, (err: any, data: Buffer) => {
			if (err) {
				return [];
			}
			return JSON.parse(data.toString());
		});
	}

	static async getProductById(id: string) {
		try {
			const products = await this.fetchAll();
			return products.find(prod => prod.id === id);
		} catch (err) {
			console.log(err);
		}
	}

	static async deleteProduct(id: string) {
		const products = await this.fetchAll();
		const productIndex = products.findIndex(prod => prod.id === id);
		Cart.deleteProductFromCart(id, +products[productIndex].price);
		products.splice(productIndex, 1);
		writeFile<Product[]>(p, products);
	}
}

// function readFile<T>(path: string, cb: Function) {
// 	return new Promise<T>((res, rej) => {
// 		fs.readFile(path, (err, data) => {
// 			res(cb(err, data));
// 		});
// 	});
// }

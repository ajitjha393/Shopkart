// import { ProductInterface } from './product';

import path from 'path';
import fs from 'fs';
import rootDir from '../utils/rootDir';
import { readFile } from '../utils/readFile';

const p = path.join(rootDir, '..', 'data', 'cart.json');

interface CartInterface {
	products: { id: string; qty: number }[];
	totalPrice: number;
}

export class Cart {
	static async addProduct(id: string, produtPrice: number) {
		// Fetch previous Cart if any
		const cart = await readFile<CartInterface>(
			p,
			(err: any, data: Buffer) => {
				if (!err) {
					return JSON.parse(data.toString());
				}
				return { products: [], totalPrice: 0 };
			}
		);
		// Analyze the cart and find the existing Product if any
		const productIndex = cart.products.findIndex(prod => prod.id === id);

		const existingProduct = cart.products[productIndex];

		let updatedProduct: typeof existingProduct;

		if (existingProduct) {
			updatedProduct = { ...existingProduct };
			updatedProduct.qty += 1;
			cart.products[productIndex] = updatedProduct;
		} else {
			updatedProduct = { id: id, qty: 1 };
			cart.products = [...cart.products, updatedProduct];
		}

		cart.totalPrice += +produtPrice;
		fs.writeFile(p, JSON.stringify(cart), err => {
			console.log(err);
		});
	}
}

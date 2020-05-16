// import { ProductInterface } from './product';

import path from 'path';
import fs from 'fs';
import rootDir from '../utils/rootDir';
import { readFile, writeFile } from '../utils/fileUtility';

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
		cart.totalPrice = +cart.totalPrice.toFixed(2);
		writeFile<CartInterface>(p, cart);
	}

	static async deleteProductFromCart(id: string, price: number) {
		const cart = await readFile<CartInterface>(
			p,
			(err: any, data: Buffer) => {
				if (!err) {
					return JSON.parse(data.toString());
				}
				return { products: [], totalPrice: 0 };
			}
		);

		// Find the product and reduce its quantity by 1 if only 1 qty just delete that obj
		const productIndex = cart.products.findIndex(prod => prod.id === id);

		const originalProduct = cart.products[productIndex];

		const deductedPrice = +price * originalProduct.qty;
		cart.totalPrice -= deductedPrice;
		cart.totalPrice = +cart.totalPrice.toFixed(2);

		cart.products.splice(productIndex, 1);
		writeFile<CartInterface>(p, cart);
	}

	static async retrieveCartProducts() {
		return await readFile<CartInterface>(p, (err: any, data: Buffer) => {
			if (!err) {
				return JSON.parse(data.toString());
			}
			return { products: [], totalPrice: 0 };
		});
	}
}

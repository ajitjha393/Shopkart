import path from 'path';
import fs, { read } from 'fs';
import rootDir from '../utils/rootDir';

const p = path.join(rootDir, '..', 'data', 'products.json');

interface ProductInterface {
	title: string;
	imageUrl: string;
	description: string;
	price: number;
}
let products: Product[] = [];

export class Product implements ProductInterface {
	title: string;
	imageUrl: string;
	description: string;
	price: number;

	constructor(
		title: string,
		imageUrl: string,
		description: string,
		price: number
	) {
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

		products.push(this);

		fs.writeFile(p, JSON.stringify(products), err =>
			err ? console.log(err) : null
		);
	}

	static async fetchAll() {
		return await readFile<Product[]>(p, (err: any, data: Buffer) => {
			if (err) {
				return [];
			}
			return JSON.parse(data.toString());
		});
	}
}

function readFile<T>(path: string, cb: Function) {
	return new Promise<T>((res, rej) => {
		fs.readFile(path, (err, data) => {
			res(cb(err, data));
		});
	});
}

import path from 'path';
import fs, { read } from 'fs';
import rootDir from '../utils/rootDir';
import { resolve } from 'dns';

const p = path.join(rootDir, '..', 'data', 'products.json');

interface ProductInterface {
	title: string;
}
let products: Product[] = [];

export class Product implements ProductInterface {
	title: string;
	constructor(title: string) {
		this.title = title;
	}

	public save() {
		fs.readFile(p, (err, data) => {
			products = [];
			if (!err) {
				products = JSON.parse(data.toString());
				console.log(products);
			}
			products.push(this);

			fs.writeFile(p, JSON.stringify(products), err => console.log(err));
		});
		// products.push(this);
	}

	static async fetchAll() {
		return await readFile(p);
	}
}

function readFile(path: string) {
	return new Promise<Product[]>((res, rej) => {
		fs.readFile(path, (err, data) => {
			if (err) {
				res([]);
			}

			res(JSON.parse(data.toString()));
		});
	});
}

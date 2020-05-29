import { Schema, model } from 'mongoose';

const productSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},

	description: {
		type: String,
		required: true,
	},
	imageUrl: {
		type: String,
		required: true,
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
});

export default model('Product', productSchema);

// import { getDb } from '../utils/database';
// import { ObjectId } from 'mongodb';

// export class Product {
// 	constructor(
// 		public title: string,
// 		public description: string,
// 		public price: number,
// 		public imageUrl: string,
// 		public userId: string
// 	) {}

// 	save() {
// 		const db = getDb();
// 		return db.collection('products').insertOne(this);
// 	}

// 	static fetchAll() {
// 		const db = getDb();
// 		return db.collection('products').find().toArray();
// 	}

// 	static findById(productId: string) {
// 		const db = getDb();
// 		return db
// 			.collection('products')
// 			.find({ _id: new ObjectId(productId) })
// 			.next();
// 	}
// 	static updateById(productId: string, updatedProduct: Product) {
// 		const db = getDb();
// 		return db
// 			.collection('products')
// 			.replaceOne({ _id: new ObjectId(productId) }, updatedProduct);
// 	}

// 	static deleteById(productId: string) {
// 		const db = getDb();
// 		return db
// 			.collection('products')
// 			.deleteOne({ _id: new ObjectId(productId) });
// 	}
// }

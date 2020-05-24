import { getDb } from '../utils/database';
import { ObjectId } from 'mongodb';
import { ProductType } from '../utils/productInterface';

// In user we will embedd cart no need for reference due to 1-1 mapping
export class User {
	// _id!: ObjectId;
	constructor(
		public name: string,
		public email: string,
		public cart: { items: ProductType[] }
	) {}

	save() {
		const db = getDb();
		return db.collection('users').insertOne(this);
	}

	addToCart(product: ProductType, userId: ObjectId) {
		// const cartProductIndex = this.cart.items.findIndex(
		// 	cp => cp._id === product._id
		// );

		const updatedCart = {
			items: [{ productId: new ObjectId(product._id), quantity: 1 }],
		};

		const db = getDb();
		return db.collection('users').updateOne(
			{ _id: userId },
			{
				$set: { cart: updatedCart },
			}
		);
	}

	static findById(userId: string) {
		const db = getDb();
		return db.collection('users').findOne({ _id: new ObjectId(userId) });
	}
}

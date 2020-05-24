import { getDb } from '../utils/database';
import { ObjectId } from 'mongodb';
import { ProductType } from '../utils/productInterface';

// In user we will embedd cart no need for reference due to 1-1 mapping
export class User {
	// _id!: ObjectId;
	constructor(
		public name: string,
		public email: string,
		public cart: { items: any[] }
	) {}

	save() {
		const db = getDb();
		return db.collection('users').insertOne(this);
	}

	async getCart() {
		const productIds = this.cart.items.map(item => item.productId);

		const db = getDb();
		const cartProducts = await db
			.collection('products')
			.find({ _id: { $in: productIds } })
			.toArray();
		return cartProducts.map(p => ({
			...p,
			quantity: this.cart.items.find(
				i => i.productId.toString() === p._id.toString()
			).quantity,
		}));

		// return this.cart;
	}

	deleteFromCart(productId: ObjectId, userId: ObjectId) {
		const updatedCartItems = this.cart.items.filter(
			item => item.productId.toString() !== productId.toString()
		);

		const db = getDb();
		return db.collection('users').updateOne(
			{ _id: userId },
			{
				$set: { cart: { items: updatedCartItems } },
			}
		);
	}

	addToCart(product: ProductType, userId: ObjectId) {
		const cartProductIndex = this.cart.items.findIndex(cp => {
			return cp.productId.toString() == product._id.toString();
		});

		let newQuantity = 1;

		const updatedCartItems = [...this.cart.items];

		if (cartProductIndex >= 0) {
			newQuantity = this.cart.items[cartProductIndex].quantity + 1;
			updatedCartItems[cartProductIndex].quantity = newQuantity;
		} else {
			updatedCartItems.push({
				productId: new ObjectId(product._id),
				quantity: newQuantity,
			});
		}

		const updatedCart = {
			items: updatedCartItems,
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

	async addOrder(userId: ObjectId) {
		const db = getDb();
		const cartProducts = await this.getCart();

		const order = {
			items: cartProducts,
			user: {
				_id: userId,
				name: this.name,
				email: this.email,
			},
		};

		await db.collection('orders').insertOne(order);
		this.cart = { items: [] };
		await db.collection('users').updateOne(
			{ _id: userId },
			{
				$set: { cart: { items: [] } },
			}
		);
	}

	getOrders(userId: ObjectId) {
		const db = getDb();
		return db.collection('orders').find({ 'user._id': userId }).toArray();
	}
}

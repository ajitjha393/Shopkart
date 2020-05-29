import { Schema, model } from 'mongoose';
import { ObjectId } from 'mongodb';

const userSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},

	cart: {
		items: [
			{
				productId: {
					type: Schema.Types.ObjectId,
					ref: 'Product',
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
				},
			},
		],
	},
});

userSchema.methods.addToCart = function (product: any) {
	const cartProductIndex = this.cart.items.findIndex((cp: any) => {
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
	this.cart = updatedCart;
	return this.save();
};

userSchema.methods.deleteFromCart = function (productId: String) {
	const updatedCartItems = this.cart.items.filter(
		(item: any) => item.productId.toString() !== productId.toString()
	);
	this.cart.items = updatedCartItems;
	return this.save();
};

userSchema.methods.clearCart = function () {
	this.cart = { items: [] };
	return this.save();
};

export default model('User', userSchema);

// 	async addOrder(userId: ObjectId) {
// 		const db = getDb();
// 		const cartProducts = await this.getCart();

// 		const order = {
// 			items: cartProducts,
// 			user: {
// 				_id: userId,
// 				name: this.name,
// 				email: this.email,
// 			},
// 		};

// 		await db.collection('orders').insertOne(order);
// 		this.cart = { items: [] };
// 		await db.collection('users').updateOne(
// 			{ _id: userId },
// 			{
// 				$set: { cart: { items: [] } },
// 			}
// 		);
// 	}

// 	getOrders(userId: ObjectId) {
// 		const db = getDb();
// 		return db.collection('orders').find({ 'user._id': userId }).toArray();
// 	}
// }

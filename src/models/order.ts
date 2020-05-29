import { Schema, model } from 'mongoose';

const orderSchema = new Schema({
	products: [
		{
			product: {
				type: Object,
				required: true,
			},
			quantity: {
				type: Number,
				required: true,
			},
		},
	],

	user: {
		name: {
			type: String,
		},
		userId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
	},
});

export default model('Order', orderSchema);

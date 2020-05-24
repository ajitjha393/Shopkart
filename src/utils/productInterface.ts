import { ObjectId } from 'mongodb';

export interface ProductType {
	_id: ObjectId;
	title: string;
	description: string;
	price: number;
	imageUrl: string;
	userId: string;
}

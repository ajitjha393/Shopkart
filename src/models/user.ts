import { getDb } from '../utils/database';
import { ObjectId } from 'mongodb';

export class User {
	constructor(public name: string, public email: string) {}

	save() {
		const db = getDb();
		return db.collection('users').insertOne(this);
	}

	static findById(userId: string) {
		const db = getDb();
		return db.collection('users').findOne({ _id: new ObjectId(userId) });
	}
}

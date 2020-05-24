import { MongoClient, Db } from 'mongodb';

let db: Db;
// rUIWtKvAXdswAZJm

export async function initializeDb() {
	try {
		const client = await MongoClient.connect(
			'mongodb+srv://Ajitjha393:MbZxFPiNFKdhGNnb@cluster0-myhv8.mongodb.net/shop?retryWrites=true&w=majority'
		);

		db = client.db();
	} catch (err) {
		console.log('Error --->', err);
	}
}

export const getDb = () => {
	if (db) {
		return db;
	}
	throw 'No Database Found ;(';
};

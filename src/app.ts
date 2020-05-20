import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import rootDir from './utils/rootDir';
import adminRoutes from './routes/admin';
import shopRoutes from './routes/shop';
import { get404Page } from './controllers/error';
import { sequelize } from './utils/database';
import { Product } from './models/product';
import { User } from './models/user';
import { Cart } from './models/cart';
import { CartItem } from './models/cart-item';
import { Order } from './models/order';
import { OrderItem } from './models/order-item';

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(
	bodyParser.urlencoded({
		extended: false,
	})
);

// Serving static files
app.use(express.static(path.join(rootDir, '..', 'public')));

app.use(async (req, _res, next) => {
	// (req as any).user = await User.findByPk(1);
	req.user = await User.findByPk(1);
	next();
});

// use is for all actions and acts as prefix
app.use('/admin', adminRoutes);
app.use(shopRoutes);

// 404 Error
app.use(get404Page);

(async () => {
	// Means user creates product
	// User-Product 1-N
	User.hasMany(Product, { constraints: true, onDelete: 'CASCADE' });
	Product.belongsTo(User);

	// User-Cart 1-1
	User.hasOne(Cart);
	Cart.belongsTo(User);

	// Product-cart M-M
	Cart.belongsToMany(Product, {
		through: CartItem,
	});
	Product.belongsToMany(Cart, {
		through: CartItem,
	});

	// User-Order 1-M , 1-1
	User.hasMany(Order);
	Order.belongsTo(User);

	// Product-Order 1-M , M-1 => M-M

	Product.belongsToMany(Order, {
		through: OrderItem,
	});
	Order.belongsToMany(Product, {
		through: OrderItem,
	});

	try {
		await sequelize.sync(/*{ force: true }*/);
		console.log('Models are mapped to Tables and synced....');

		let user = await User.findByPk(1);
		if (!user) {
			user = await User.create({ name: 'Bisu', email: 'test@gmail.com' });
			await user.createCart();
		}

		app.listen(3000);
	} catch (err) {
		console.log(err);
	}
})();

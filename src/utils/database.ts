import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('node-test', 'root', 'password', {
	dialect: 'mysql',
	host: 'localhost',
});

export { sequelize };

// import mysql from 'mysql2';
// import sequelize from 'sequelize'
// import { promisify } from 'util';

// const pool = mysql.createPool({
// 	host: 'localhost',
// 	user: 'root',
// 	password: 'password',
// 	database: 'node-test',
// });

// const executeQuery = promisify(pool.execute).bind(pool);

// // const promiseQuery = promisify(pool.query).bind(pool);
// // const promisePoolEnd = promisify(pool.end).bind(pool);

// export { executeQuery };

/* istanbul ignore file */

const isTest = process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development';

module.exports = {
	isTest,
	database: {
		connectionString: isTest
			? process.env.TEST_DATABASE_URL
			: process.env.DATABASE_URL,
	},
	server: {
		host: isTest ? process.env.HOST : '0.0.0.0',
		port: process.env.PORT,
	},
	token: {
		access: {
			key: process.env.ACCESS_TOKEN_KEY,
			age: process.env.ACCCESS_TOKEN_AGE,
		},
		refresh: {
			key: process.env.REFRESH_TOKEN_KEY,
		},
	},
};

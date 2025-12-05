const routes = (handler) => [
	{
		method: 'POST',
		path: '/threads',
		handler: handler.postThreadHandler,
		options: { auth: 'access_token' },
	},
];

module.exports = routes;

const routes = (handler) => [
	{
		method: 'POST',
		path: '/threads',
		handler: handler.postThreadHandler,
		options: { auth: 'access_token' },
	},
	{
		method: 'GET',
		path: '/threads/{threadId}',
		handler: handler.getThreadHandler,
	},
];

module.exports = routes;

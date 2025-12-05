const routes = (handler) => [
	{
		method: 'POST',
		path: '/threads/{threadId}/comments',
		handler: handler.postCommentHandler,
		options: { auth: 'access_token' },
	},
];

module.exports = routes;

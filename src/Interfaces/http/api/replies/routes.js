module.exports = (handler) => [
	{
		method: 'POST',
		path: '/threads/{threadId}/comments/{commentId}/replies',
		handler: handler.postReplyHandler,
		options: { auth: 'access_token' },
	},
];

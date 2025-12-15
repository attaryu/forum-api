const routes = (handler) => [
	{
		method: 'POST',
		path: '/threads/{threadId}/comments',
		handler: handler.postCommentHandler,
		options: { auth: 'access_token' },
	},
	{
		method: 'DELETE',
		path: '/threads/{threadId}/comments/{commentId}',
		handler: handler.deleteCommentHandler,
		options: { auth: 'access_token' },
	},
	{
		method: 'PUT',
		path: '/threads/{threadId}/comments/{commentId}/likes',
		handler: handler.putLikeCommentHandler,
		options: { auth: 'access_token' },
	}
];

module.exports = routes;

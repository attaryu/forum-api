const AddCommentUseCase = require('../../../../Applications/use_case/comments/AddCommentUseCase');

class CommentsHandler {
	constructor(container) {
		this._container = container;

		this.postCommentHandler = this.postCommentHandler.bind(this);
	}

	async postCommentHandler(request, h) {
		const addCommentUseCase = this._container.getInstance(
			AddCommentUseCase.name
		);

		const addedComment = await addCommentUseCase.execute(
			request.payload,
			request.params.threadId,
			request.auth.credentials.userId
		);

		return h
			.response({
				status: 'success',
				data: { addedComment },
			})
			.code(201);
	}
}

module.exports = CommentsHandler;

const AddCommentUseCase = require('../../../../Applications/use_case/comments/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/comments/DeleteCommentUseCase');

class CommentsHandler {
	constructor(container) {
		this._container = container;

		this.postCommentHandler = this.postCommentHandler.bind(this);
		this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
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

	async deleteCommentHandler(request, h) {
		const deleteCommentUseCase = this._container.getInstance(
			DeleteCommentUseCase.name
		);

		await deleteCommentUseCase.execute(
			request.params.threadId,
			request.params.commentId,
			request.auth.credentials.userId
		);

		return h.response({ status: 'success' }).code(200);
	}
}

module.exports = CommentsHandler;

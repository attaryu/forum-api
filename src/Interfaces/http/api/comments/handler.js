const AddCommentUseCase = require('../../../../Applications/use_case/comments/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/comments/DeleteCommentUseCase');
const LikeCommentUseCase = require('../../../../Applications/use_case/comments/LikeCommentUseCase');

class CommentsHandler {
	constructor(container) {
		this._container = container;

		this.postCommentHandler = this.postCommentHandler.bind(this);
		this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
		this.putLikeCommentHandler = this.putLikeCommentHandler.bind(this);
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

	async putLikeCommentHandler(request, h) {
		const putLikeCommentUseCase = this._container.getInstance(
			LikeCommentUseCase.name
		);

		await putLikeCommentUseCase.execute(
			request.params.threadId,
			request.params.commentId,
			request.auth.credentials.userId
		);

		return h.response({ status: 'success' }).code(200);
	}
}

module.exports = CommentsHandler;

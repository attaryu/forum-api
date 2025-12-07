const AddReplyUseCase = require('../../../../Applications/use_case/replies/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/replies/DeleteReplyUseCase');

class RepliesHandler {
	constructor(container) {
		this._container = container;

		this.postReplyHandler = this.postReplyHandler.bind(this);
		this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
	}

	async postReplyHandler(request, h) {
		const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
		const addedReply = await addReplyUseCase.execute(
			request.payload,
			request.params.threadId,
			request.params.commentId,
			request.auth.credentials.userId
		);

		return h
			.response({
				status: 'success',
				data: { addedReply },
			})
			.code(201);
	}

	async deleteReplyHandler(request, h) {
		const deleteReplyUseCase = this._container.getInstance(
			DeleteReplyUseCase.name
		);
		await deleteReplyUseCase.execute(
			request.params.threadId,
			request.params.commentId,
			request.params.replyId,
			request.auth.credentials.userId
		);

		return h.response({
			status: 'success',
		});
	}
}

module.exports = RepliesHandler;

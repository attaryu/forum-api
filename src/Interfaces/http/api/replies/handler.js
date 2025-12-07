const AddReplyUseCase = require('../../../../Applications/use_case/replies/AddReplyUseCase');

class RepliesHandler {
	constructor(container) {
		this._container = container;

		this.postReplyHandler = this.postReplyHandler.bind(this);
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
}

module.exports = RepliesHandler;

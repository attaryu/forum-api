class AddReplyUseCase {
	constructor({ threadRepository, commentRepository, replyRepository }) {
		this._threadRepository = threadRepository;
		this._commentRepository = commentRepository;
		this._replyRepository = replyRepository;
	}

	async execute(payload, threadId, commentId, userId) {
		this._verifyPayload(payload);

		await this._threadRepository.verifyThreadExist(threadId);
		await this._commentRepository.verifyCommentExist(threadId, commentId);

		return this._replyRepository.addReply(payload.content, commentId, userId);
	}

	_verifyPayload(payload) {
		const { content } = payload;

		if (!content) {
			throw new Error('ADD_REPLY_USE_CASE.NOT_CONTAIN_REPLY_CONTENT');
		}

		if (typeof content !== 'string') {
			throw new Error(
				'ADD_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'
			);
		}
	}
}

module.exports = AddReplyUseCase;

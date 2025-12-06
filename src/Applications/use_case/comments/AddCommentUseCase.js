class AddCommentUseCase {
	constructor({ threadRepository, commentRepository }) {
		this._threadRepository = threadRepository;
		this._commentRepository = commentRepository;
	}

	async execute(useCasePayload, threadId, userId) {
		const { content } = useCasePayload;

		this._verifyPayload(content);
		await this._threadRepository.verifyThreadExist(threadId);

		return this._commentRepository.addComment(content, threadId, userId);
	}

	_verifyPayload(content) {
		if (!content) {
			throw new Error('ADD_COMMENT_USE_CASE.NOT_CONTAIN_COMMENT_CONTENT');
		}

		if (typeof content !== 'string') {
			throw new Error('ADD_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
		}
	}
}

module.exports = AddCommentUseCase;

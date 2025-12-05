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
			throw new Error('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
		}

		if (typeof content !== 'string') {
			throw new Error('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
		}
	}
}

module.exports = AddCommentUseCase;

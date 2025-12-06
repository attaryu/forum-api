class DeleteCommentUseCase {
	constructor({ commentRepository, threadRepository }) {
		this._commentRepository = commentRepository;
		this._threadRepository = threadRepository;
	}

	async execute(threadId, commentId, userId) {
		await this._threadRepository.verifyThreadExist(threadId);
		await this._commentRepository.verifyComment(commentId, userId);

		await this._commentRepository.deleteComment(commentId);
	}
}

module.exports = DeleteCommentUseCase;

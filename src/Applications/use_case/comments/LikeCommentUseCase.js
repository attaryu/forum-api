class LikeCommentUseCase {
	constructor({ commentRepository, threadRepository }) {
		this._commentRepository = commentRepository;
		this._threadRepository = threadRepository;
	}

	async execute(threadId, commentId, userId) {
		await this._threadRepository.verifyThreadExist(threadId);
		await this._commentRepository.verifyCommentExist(threadId, commentId);

		try {
			await this._commentRepository.verifyLikeComment(commentId, userId);
			await this._commentRepository.unlikeComment(commentId, userId);
		} catch {
			await this._commentRepository.likeComment(commentId, userId);
		}
	}
}

module.exports = LikeCommentUseCase;

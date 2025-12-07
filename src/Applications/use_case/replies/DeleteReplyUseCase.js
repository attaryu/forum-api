class DeleteReplyUseCase {
	constructor({ replyRepository, commentRepository, threadRepository }) {
		this._replyRepository = replyRepository;
		this._commentRepository = commentRepository;
		this._threadRepository = threadRepository;
	}

	async execute(threadId, commentId, replyId, userId) {
		await this._threadRepository.verifyThreadExist(threadId);
		await this._commentRepository.verifyCommentExist(threadId, commentId);
		await this._replyRepository.verifyReplyExist(commentId, replyId);
		await this._replyRepository.verifyReplyOwner(replyId, userId);

		await this._replyRepository.deleteReply(commentId, replyId);
	}
}

module.exports = DeleteReplyUseCase;

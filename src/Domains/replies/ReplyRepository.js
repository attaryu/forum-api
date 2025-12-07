class ReplyRepository {
	async addReply(content, commentId, owner) {
		throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}

	async deleteReply(commentId, replyId) {
		throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}

	async verifyReplyExist(commentId, replyId) {
		throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}

	async verifyReplyOwner(replyId, userId) {
		throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}
}

module.exports = ReplyRepository;

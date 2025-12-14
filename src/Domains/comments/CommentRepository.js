class CommentRepository {
	async addComment(newComment, thread, owner) {
		newComment;
		thread;
		owner;

		throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}

	async deleteComment(threadId, commentId) {
		threadId;
		commentId;

		throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}

	async verifyCommentExist(threadId, commentId) {
		threadId;
		commentId;
		
		throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}
	
	async verifyCommentOwner(commentId, owner) {
		commentId;
		owner
		
		throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}
}

module.exports = CommentRepository;

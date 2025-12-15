const CommentRepository = require('../CommentRepository');

describe('CommentRepository interface', () => {
	it('should throw error when invoke abstract behavior', async () => {
		// arrange
		const commentRepository = new CommentRepository();

		// act & assert
		await expect(
			commentRepository.addComment('content', 'thread-123', 'user-123')
		).rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
		await expect(
			commentRepository.deleteComment('thread-123', 'comment-123')
		).rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
		await expect(
			commentRepository.verifyCommentExist('thread-123', 'comment-123')
		).rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
		await expect(
			commentRepository.verifyCommentOwner('comment-123', 'user-123')
		).rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
		await expect(
			commentRepository.verifyLikeComment('comment-123', 'user-123')
		).rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
		await expect(
			commentRepository.likeComment('comment-123', 'user-123')
		).rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
		await expect(
			commentRepository.unlikeComment('comment-123', 'user-123')
		).rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	});
});

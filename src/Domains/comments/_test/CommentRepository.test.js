const CommentRepository = require('../CommentRepository');

describe('CommentRepository interface', () => {
	it('should throw error when invoke abstract behavior', async () => {
		// Arrange
		const commentRepository = new CommentRepository();

		// Action & Assert
		await expect(
			commentRepository.addComment('content', 'thread-123', 'user-123')
		).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
		await expect(
			commentRepository.deleteComment('comment-123')
		).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
		await expect(
			commentRepository.verifyComment('thread-123', 'user-123')
		).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	});
});

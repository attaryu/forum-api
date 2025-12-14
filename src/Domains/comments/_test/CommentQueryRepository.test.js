const CommentQueryRepository = require('../CommentQueryRepository');

describe('CommentQueryRepository interface', () => {
	it('should throw error when invoke abstract behavior', async () => {
		// arrange
		const commentQueryRepository = new CommentQueryRepository();

		// act & assert
		await expect(
			commentQueryRepository.getCommentsByThreadId('thread-123')
		).rejects.toThrow('COMMENT_QUERY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	});
});

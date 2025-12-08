const ReplyQueryRepository = require('../ReplyQueryRepository');

describe('ReplyQueryRepository interface', () => {
	it('should throw error when invoke abstract behavior', async () => {
		// arrange
		const replyQueryRepository = new ReplyQueryRepository();

		// act & assert
		await expect(
			replyQueryRepository.getRepliesByThreadId('thread-123')
		).rejects.toThrowError('REPLY_QUERY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	});
});

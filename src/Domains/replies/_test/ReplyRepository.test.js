const ReplyRepository = require('../ReplyRepository');

describe('ReplyRepository interface', () => {
	it('should throw error when invoke abstract behavior', async () => {
		// arrange
		const replyRepository = new ReplyRepository();

		// act & assert
		await expect(
			replyRepository.addReply('content', 'comment-123', 'user-123')
		).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
		await expect(
			replyRepository.deleteReply('comment-123', 'reply-123')
		).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
		await expect(
			replyRepository.verifyReplyOwner('comment-123', 'user-123')
		).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
		await expect(
			replyRepository.verifyReplyExist('comment-123', 'reply-123')
		).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	});
});

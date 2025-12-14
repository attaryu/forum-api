const DeleteReplyUseCase = require('../DeleteReplyUseCase');
const ReplyRepository = require('../../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');

describe('DeleteReplyUseCase', () => {
	it('should orchestrating the delete reply action correctly', async () => {
		// arrange
		const threadId = 'thread-123';
		const commentId = 'comment-123';
		const replyId = 'reply-123';
		const userId = 'user-123';

		const mockReplyRepository = new ReplyRepository();
		const mockCommentRepository = new CommentRepository();
		const mockThreadRepository = new ThreadRepository();

		mockThreadRepository.verifyThreadExist = jest.fn(() => Promise.resolve());
		mockCommentRepository.verifyCommentExist = jest.fn(() => Promise.resolve());
		mockReplyRepository.verifyReplyExist = jest.fn(() => Promise.resolve());
		mockReplyRepository.verifyReplyOwner = jest.fn(() => Promise.resolve());
		mockReplyRepository.deleteReply = jest.fn(() => Promise.resolve());

		const deleteReplyUseCase = new DeleteReplyUseCase({
			replyRepository: mockReplyRepository,
			commentRepository: mockCommentRepository,
			threadRepository: mockThreadRepository,
		});

		// act
		await deleteReplyUseCase.execute(threadId, commentId, replyId, userId);

		// assert
		expect(mockThreadRepository.verifyThreadExist).toHaveBeenCalledWith(
			threadId
		);
		expect(mockCommentRepository.verifyCommentExist).toHaveBeenCalledWith(
			threadId,
			commentId
		);
		expect(mockReplyRepository.verifyReplyExist).toHaveBeenCalledWith(
			commentId,
			replyId
		);
		expect(mockReplyRepository.verifyReplyOwner).toHaveBeenCalledWith(
			replyId,
			userId
		);
		expect(mockReplyRepository.deleteReply).toHaveBeenCalledWith(
			commentId,
			replyId
		);
	});
});

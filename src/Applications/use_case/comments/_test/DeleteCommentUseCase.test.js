const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');

describe('DeleteCommentUseCase', () => {
	it('should orchestrating the delete comment act correctly', async () => {
		// arrange
		const commentId = 'comment-123';
		const userId = 'user-123';
		const threadId = 'thread-123';

		const mockCommentRepository = new CommentRepository();

		mockCommentRepository.verifyCommentExist = jest.fn(() => Promise.resolve());
		mockCommentRepository.verifyCommentOwner = jest.fn(() => Promise.resolve());
		mockCommentRepository.deleteComment = jest.fn(() => Promise.resolve());

		const mockThreadRepository = new ThreadRepository();

		mockThreadRepository.verifyThreadExist = jest.fn(() => Promise.resolve());

		const deleteCommentUseCase = new DeleteCommentUseCase({
			commentRepository: mockCommentRepository,
			threadRepository: mockThreadRepository,
		});

		// act
		await deleteCommentUseCase.execute(threadId, commentId, userId);

		// assert
		expect(mockThreadRepository.verifyThreadExist).toBeCalledWith(threadId);
		expect(mockCommentRepository.verifyCommentExist).toBeCalledWith(
			threadId,
			commentId
		);
		expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(
			commentId,
			userId
		);
		expect(mockCommentRepository.deleteComment).toBeCalledWith(
			threadId,
			commentId
		);
	});
});

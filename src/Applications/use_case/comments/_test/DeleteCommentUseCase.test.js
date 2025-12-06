const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');

describe('DeleteCommentUseCase', () => {
	it('should orchestrating the delete comment action correctly', async () => {
		// Arrange
		const commentId = 'comment-123';
		const userId = 'user-123';
		const threadId = 'thread-123';

		const mockCommentRepository = new CommentRepository();

		mockCommentRepository.verifyComment = jest
			.fn()
			.mockImplementation(() => Promise.resolve());
		mockCommentRepository.deleteComment = jest
			.fn()
			.mockImplementation(() => Promise.resolve());

		const mockThreadRepository = new ThreadRepository();

		mockThreadRepository.verifyThreadExist = jest
			.fn()
			.mockImplementation(() => Promise.resolve());

		const deleteCommentUseCase = new DeleteCommentUseCase({
			commentRepository: mockCommentRepository,
			threadRepository: mockThreadRepository,
		});

		// Action
		await deleteCommentUseCase.execute(threadId, commentId, userId);

		// Assert
		expect(mockThreadRepository.verifyThreadExist).toBeCalledWith(threadId);
		expect(mockCommentRepository.verifyComment).toBeCalledWith(
			commentId,
			userId
		);
		expect(mockCommentRepository.deleteComment).toBeCalledWith(commentId);
	});
});

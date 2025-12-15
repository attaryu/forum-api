const LikeCommentUseCase = require('../LikeCommentUseCase');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');

describe('LikeCommentUseCase', () => {
	const commentId = 'comment-123';
	const userId = 'user-123';
	const threadId = 'thread-123';

	const mockCommentRepository = new CommentRepository();

	mockCommentRepository.verifyCommentExist = jest.fn(() => Promise.resolve());
	mockCommentRepository.likeComment = jest.fn(() => Promise.resolve());
	mockCommentRepository.unlikeComment = jest.fn(() => Promise.resolve());

	const mockThreadRepository = new ThreadRepository();

	mockThreadRepository.verifyThreadExist = jest.fn(() => Promise.resolve());

	const likeCommentUseCase = new LikeCommentUseCase({
		commentRepository: mockCommentRepository,
		threadRepository: mockThreadRepository,
	});

	it('should orchestrating the like comment act correctly', async () => {
		// arrange
		mockCommentRepository.verifyLikeComment = jest.fn(() => Promise.reject());

		// act
		await likeCommentUseCase.execute(threadId, commentId, userId);

		// assert
		expect(mockThreadRepository.verifyThreadExist).toHaveBeenCalledWith(
			threadId
		);
		expect(mockCommentRepository.verifyCommentExist).toHaveBeenCalledWith(
			threadId,
			commentId
		);
		expect(mockCommentRepository.verifyLikeComment).toHaveBeenCalledWith(
			commentId,
			userId
		);
		expect(mockCommentRepository.likeComment).toHaveBeenCalledWith(
			commentId,
			userId
		);
	});

	it('should orchestrating the unlike comment act correctly', async () => {
		// arrange
		mockCommentRepository.verifyLikeComment = jest.fn(() => Promise.resolve());

		// act
		await likeCommentUseCase.execute(threadId, commentId, userId);

		// assert
		expect(mockThreadRepository.verifyThreadExist).toHaveBeenCalledWith(
			threadId
		);
		expect(mockCommentRepository.verifyCommentExist).toHaveBeenCalledWith(
			threadId,
			commentId
		);
		expect(mockCommentRepository.verifyLikeComment).toHaveBeenCalledWith(
			commentId,
			userId
		);
		expect(mockCommentRepository.unlikeComment).toHaveBeenCalledWith(
			commentId,
			userId
		);
	});
});

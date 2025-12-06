const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const AddedComment = require('../../../../Domains/comments/entities/AddedComment');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
	const userId = 'user-123';
	const threadId = 'thread-123';

	it('should throw error if use case payload not contain content', async () => {
		// arrange
		const payload = {
			foo: 'bar',
		};

		const addCommentUseCase = new AddCommentUseCase({});

		await expect(
			addCommentUseCase.execute(payload, threadId, userId)
		).rejects.toThrowError('ADD_COMMENT_USE_CASE.NOT_CONTAIN_COMMENT_CONTENT');
	});

	it('should throw error if content not string', async () => {
		// arrange
		const payload = {
			content: 12345,
		};

		const addCommentUseCase = new AddCommentUseCase({});

		// act & assert
		await expect(
			addCommentUseCase.execute(payload, threadId, userId)
		).rejects.toThrowError(
			'ADD_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'
		);
	});

	it('should orchestrating the add comment act correctly', async () => {
		// arrange
		const payload = { content: 'content' };

		const mockAddedComment = new AddedComment({
			id: 'comment-123',
			content: payload.content,
			owner: userId,
		});

		const mockedThreadRepository = new ThreadRepository();
		mockedThreadRepository.verifyThreadExist = jest
			.fn()
			.mockImplementation(() => Promise.resolve());

		const mockedCommentRepository = new CommentRepository();
		mockedCommentRepository.addComment = jest
			.fn()
			.mockImplementation(() => Promise.resolve(mockAddedComment));

		const addCommentUseCase = new AddCommentUseCase({
			threadRepository: mockedThreadRepository,
			commentRepository: mockedCommentRepository,
		});

		// act
		const addedComment = await addCommentUseCase.execute(
			payload,
			threadId,
			userId
		);

		// assert
		expect(mockedThreadRepository.verifyThreadExist).toBeCalledWith(threadId);
		expect(mockedCommentRepository.addComment).toBeCalledWith(
			payload.content,
			threadId,
			userId
		);
		expect(addedComment).toStrictEqual(mockAddedComment);
	});
});

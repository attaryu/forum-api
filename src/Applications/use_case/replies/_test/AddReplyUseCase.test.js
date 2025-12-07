const AddReplyUseCase = require('../AddReplyUseCase');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const ReplyRepository = require('../../../../Domains/replies/ReplyRepository');
const AddedReply = require('../../../../Domains/replies/entities/AddedReply');

describe('AddReplyUseCase', () => {
	const userId = 'user-123';
	const commentId = 'comment-123';
	const threadId = 'thread-123';

	it('should throw error if use case payload not contain content', async () => {
		// arrange
		const payload = {
			foo: 'bar',
		};

		const addReplyUseCase = new AddReplyUseCase({});

		await expect(
			addReplyUseCase.execute(payload, threadId, commentId, userId)
		).rejects.toThrowError('ADD_REPLY_USE_CASE.NOT_CONTAIN_REPLY_CONTENT');
	});

	it('should throw error if content not string', async () => {
		// arrange
		const payload = {
			content: 12345,
		};

		const addReplyUseCase = new AddReplyUseCase({});

		// act & assert
		await expect(
			addReplyUseCase.execute(payload, threadId, commentId, userId)
		).rejects.toThrowError(
			'ADD_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'
		);
	});

	it('should orchestrating the add reply act correctly', async () => {
		// arrange
		const payload = { content: 'content' };

		const mockedThreadRepository = new ThreadRepository();
		mockedThreadRepository.verifyThreadExist = jest.fn(() => Promise.resolve());

		const mockedCommentRepository = new CommentRepository();
		mockedCommentRepository.verifyCommentExist = jest.fn(() =>
			Promise.resolve()
		);

		const mockedReplyRepository = new ReplyRepository();
		mockedReplyRepository.addReply = jest.fn(() =>
			Promise.resolve(
				new AddedReply({
					id: 'reply-123',
					content: payload.content,
					owner: userId,
				})
			)
		);

		const addReplyUseCase = new AddReplyUseCase({
			threadRepository: mockedThreadRepository,
			commentRepository: mockedCommentRepository,
			replyRepository: mockedReplyRepository,
		});

		// act
		const addedReply = await addReplyUseCase.execute(
			payload,
			threadId,
			commentId,
			userId
		);

		// assert
		expect(mockedThreadRepository.verifyThreadExist).toBeCalledWith(threadId);
		expect(mockedCommentRepository.verifyCommentExist).toBeCalledWith(
			threadId,
			commentId
		);
		expect(mockedReplyRepository.addReply).toBeCalledWith(
			payload.content,
			commentId,
			userId
		);
		expect(addedReply).toStrictEqual(
			new AddedReply({
				id: 'reply-123',
				content: payload.content,
				owner: userId,
			})
		);
	});
});

const ThreadQueryRepository = require('../../../../Domains/threads/ThreadQueryRepository');
const CommentQueryRepository = require('../../../../Domains/comments/CommentQueryRepository');
const ReplyQueryRepository = require('../../../../Domains/replies/ReplyQueryRepository');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
	it('should orchestrating get thread act correctly', async () => {
		// arrange
		const threadId = 'thread-123';

		const mockedThreadQueryRepository = new ThreadQueryRepository();
		const mockedCommentQueryRepository = new CommentQueryRepository();
		const mockedReplyQueryRepository = new ReplyQueryRepository();

		mockedThreadQueryRepository.getThreadById = jest.fn(() =>
			Promise.resolve({
				id: threadId,
				title: 'title',
				body: 'body',
				date: '2000-01-01T00:00:00.000Z',
				username: 'user-123',
			})
		);

		mockedCommentQueryRepository.getCommentsByThreadId = jest.fn(() =>
			Promise.resolve([
				{
					id: 'comment-123',
					username: 'commenter-123',
					date: '2000-01-01T00:00:00.000Z',
					content: 'comment content',
				},
				{
					id: 'comment-456',
					username: 'commenter-456',
					date: '2000-01-01T00:00:00.000Z',
					content: '**komentar telah dihapus**',
				},
			])
		);

		mockedReplyQueryRepository.getRepliesByThreadId = jest.fn(() =>
			Promise.resolve([
				{
					id: 'reply-123',
					username: 'replier-123',
					date: '2000-01-01T00:00:00.000Z',
					content: 'reply content',
					commentId: 'comment-123',
				},
				{
					id: 'reply-456',
					username: 'replier-456',
					date: '2000-01-01T00:00:00.000Z',
					content: '**balasan telah dihapus**',
					commentId: 'comment-123',
				},
			])
		);

		const getThreadUseCase = new GetThreadUseCase({
			threadQueryRepository: mockedThreadQueryRepository,
			commentQueryRepository: mockedCommentQueryRepository,
			replyQueryRepository: mockedReplyQueryRepository,
		});

		// act
		const thread = await getThreadUseCase.execute(threadId);

		// assert
		expect(mockedThreadQueryRepository.getThreadById).toBeCalledWith(threadId);
		expect(mockedCommentQueryRepository.getCommentsByThreadId).toBeCalledWith(
			threadId
		);
		expect(mockedReplyQueryRepository.getRepliesByThreadId).toBeCalledWith(
			threadId
		);

		expect(thread).toEqual({
			id: threadId,
			title: 'title',
			body: 'body',
			date: '2000-01-01T00:00:00.000Z',
			username: 'user-123',
			comments: [
				{
					id: 'comment-123',
					username: 'commenter-123',
					date: '2000-01-01T00:00:00.000Z',
					content: 'comment content',
					replies: [
						{
							id: 'reply-123',
							username: 'replier-123',
							date: '2000-01-01T00:00:00.000Z',
							content: 'reply content',
						},
						{
							id: 'reply-456',
							username: 'replier-456',
							date: '2000-01-01T00:00:00.000Z',
							content: '**balasan telah dihapus**',
						},
					],
				},
				{
					id: 'comment-456',
					username: 'commenter-456',
					date: '2000-01-01T00:00:00.000Z',
					content: '**komentar telah dihapus**',
					replies: [],
				},
			],
		});
	});
});

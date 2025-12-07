const ThreadQueryRepository = require('../../../../Domains/threads/ThreadQueryRepository');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
	it('should orchestrating get thread act correctly', async () => {
		// arrange
		const threadId = 'thread-123';

		const mockedThreadQueryRepository = new ThreadQueryRepository();

		mockedThreadQueryRepository.getThreadById = jest.fn().mockResolvedValue({
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
					],
				},
			],
		});

		const getThreadUseCase = new GetThreadUseCase({
			threadQueryRepository: mockedThreadQueryRepository,
		});

		// act
		const thread = await getThreadUseCase.execute(threadId);

		// assert
		expect(mockedThreadQueryRepository.getThreadById).toBeCalledWith(threadId);
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
					],
				},
			],
		});
	});
});

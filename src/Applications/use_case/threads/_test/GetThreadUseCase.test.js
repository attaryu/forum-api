const ThreadQueryRepository = require('../../../../Domains/threads/ThreadQueryRepository');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
	it('should orchestrating get thread act correctly', async () => {
		// arrange
		const threadId = 'thread-123';
		const mockedThread = {
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
				},
			],
		};

		const mockedThreadQueryRepository = new ThreadQueryRepository();

		mockedThreadQueryRepository.getThreadById = jest
			.fn()
			.mockResolvedValue(mockedThread);

		const getThreadUseCase = new GetThreadUseCase({
			threadQueryRepository: mockedThreadQueryRepository,
		});

		// act
		const thread = await getThreadUseCase.execute(threadId);

		// assert
		expect(thread).toEqual(mockedThread);
		expect(mockedThreadQueryRepository.getThreadById).toBeCalledWith(threadId);
	});
});

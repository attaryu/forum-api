const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const NewThread = require('../../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../../Domains/threads/entities/AddedThread');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
	it('should orchestrating the add thread act correctly', async () => {
		// arrange
		const userId = 'user-123';
		const payload = {
			title: 'title',
			body: 'body',
		};
		const mockAddedThread = new AddedThread({
			id: 'thread-123',
			title: payload.title,
			owner: userId,
		});

		const mockedThreadRepository = new ThreadRepository();
		mockedThreadRepository.addThread = jest.fn(() => Promise.resolve(mockAddedThread));

		const addThreadUseCase = new AddThreadUseCase({
			threadRepository: mockedThreadRepository,
		});

		// act
		const addedThread = await addThreadUseCase.execute(payload, userId);

		// assert
		expect(mockedThreadRepository.addThread).toBeCalledWith(
			new NewThread(payload),
			userId
		);
		expect(addedThread).toStrictEqual(mockAddedThread);
	});
});

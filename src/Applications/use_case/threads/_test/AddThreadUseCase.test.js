const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const NewThread = require('../../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../../Domains/threads/entities/AddedThread');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
	it('should orchestrating the add thread action correctly', async () => {
		// Arrange
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
		mockedThreadRepository.addThread = jest
			.fn()
			.mockImplementation(() => Promise.resolve(mockAddedThread));

		const addThreadUseCase = new AddThreadUseCase({
			threadRepository: mockedThreadRepository,
		});

		// Act
		const addedThread = await addThreadUseCase.execute(payload, userId);

		// Assert
		expect(mockedThreadRepository.addThread).toHaveBeenCalledWith(
			new NewThread(payload),
			userId
		);
		expect(addedThread).toStrictEqual(mockAddedThread);
	});
});

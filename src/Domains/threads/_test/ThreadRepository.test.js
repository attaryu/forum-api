const ThreadRepository = require('../ThreadRepository');

describe('ThreadRepository interface', () => {
	it('should throw error when invoke unimplemented method', async () => {
		// Arrange
		const threadRepository = new ThreadRepository();
		const throwMessage = 'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED';

		// Action & Assert
		await expect(threadRepository.addThread({}, '')).rejects.toThrow(throwMessage);
	});
});

const ThreadRepository = require('../ThreadRepository');

describe('ThreadRepository interface', () => {
	it('should throw error when invoke unimplemented method', async () => {
		// arrange
		const threadRepository = new ThreadRepository();
		const throwMessage = 'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED';

		// act & assert
		await expect(threadRepository.addThread({}, '')).rejects.toThrow(
			throwMessage
		);
		await expect(threadRepository.verifyThreadExist('')).rejects.toThrow(
			throwMessage
		);
	});
});

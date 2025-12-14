const ThreadQueryRepository = require('../ThreadQueryRepository');

describe('ThreadQueryRepository interface', () => {
	it('should throw error when invoke unimplemented method', async () => {
		// arrange
		const threadQueryRepository = new ThreadQueryRepository();

		// act & assert
		await expect(threadQueryRepository.getThreadById('')).rejects.toThrow(
			'THREAD_QUERY_REPOSITORY.METHOD_NOT_IMPLEMENTED'
		);
	});
});

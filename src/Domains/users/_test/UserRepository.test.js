const UserRepository = require('../UserRepository');

describe('UserRepository interface', () => {
	it('should throw error when invoke abstract behavior', async () => {
		// arrange
		const userRepository = new UserRepository();

		// act and assert
		await expect(userRepository.addUser({})).rejects.toThrowError(
			'USER_REPOSITORY.METHOD_NOT_IMPLEMENTED'
		);
		await expect(
			userRepository.verifyAvailableUsername('')
		).rejects.toThrowError('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
		await expect(userRepository.getPasswordByUsername('')).rejects.toThrowError(
			'USER_REPOSITORY.METHOD_NOT_IMPLEMENTED'
		);
		await expect(userRepository.getIdByUsername('')).rejects.toThrowError(
			'USER_REPOSITORY.METHOD_NOT_IMPLEMENTED'
		);
	});
});

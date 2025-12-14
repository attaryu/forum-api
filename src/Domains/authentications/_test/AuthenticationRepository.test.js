const AuthenticationRepository = require('../AuthenticationRepository');

describe('AuthenticationRepository interface', () => {
	it('should throw error when invoke unimplemented method', async () => {
		// arrange
		const authenticationRepository = new AuthenticationRepository();

		// act & assert
		await expect(authenticationRepository.addToken('')).rejects.toThrow(
			'AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED'
		);
		await expect(
			authenticationRepository.checkAvailabilityToken('')
		).rejects.toThrow('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
		await expect(authenticationRepository.deleteToken('')).rejects.toThrow(
			'AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED'
		);
	});
});

const AuthenticationTokenManager = require('../AuthenticationTokenManager');

describe('AuthenticationTokenManager interface', () => {
	it('should throw error when invoke unimplemented method', async () => {
		// arrange
		const tokenManager = new AuthenticationTokenManager();

		// act & assert
		await expect(tokenManager.createAccessToken('')).rejects.toThrow(
			'AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED'
		);
		await expect(tokenManager.createRefreshToken('')).rejects.toThrow(
			'AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED'
		);
		await expect(tokenManager.verifyRefreshToken('')).rejects.toThrow(
			'AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED'
		);
		await expect(tokenManager.decodePayload('')).rejects.toThrow(
			'AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED'
		);
	});
});

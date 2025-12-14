const AuthenticationRepository = require('../../../../Domains/authentications/AuthenticationRepository');
const AuthenticationTokenManager = require('../../../security/AuthenticationTokenManager');
const RefreshAuthenticationUseCase = require('../RefreshAuthenticationUseCase');

describe('RefreshAuthenticationUseCase', () => {
	it('should throw error if use case payload not contain refresh token', async () => {
		// arrange
		const useCasePayload = {};
		const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({});

		// act & assert
		await expect(
			refreshAuthenticationUseCase.execute(useCasePayload)
		).rejects.toThrow(
			'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN'
		);
	});

	it('should throw error if refresh token not string', async () => {
		// arrange
		const useCasePayload = {
			refreshToken: 1,
		};
		const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({});

		// act & assert
		await expect(
			refreshAuthenticationUseCase.execute(useCasePayload)
		).rejects.toThrow(
			'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'
		);
	});

	it('should orchestrating the refresh authentication act correctly', async () => {
		// arrange
		const useCasePayload = {
			refreshToken: 'some_refresh_token',
		};
		const mockAuthenticationRepository = new AuthenticationRepository();
		const mockAuthenticationTokenManager = new AuthenticationTokenManager();
		// Mocking
		mockAuthenticationRepository.checkAvailabilityToken = jest.fn(() => Promise.resolve());
		mockAuthenticationTokenManager.verifyRefreshToken = jest.fn(() => Promise.resolve());
		mockAuthenticationTokenManager.decodePayload = jest.fn(() =>
			Promise.resolve({ username: 'dicoding', id: 'user-123' })
		);
		mockAuthenticationTokenManager.createAccessToken = jest.fn(() => Promise.resolve('some_new_access_token'));
		// Create the use case instace
		const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({
			authenticationRepository: mockAuthenticationRepository,
			authenticationTokenManager: mockAuthenticationTokenManager,
		});

		// act
		const accessToken = await refreshAuthenticationUseCase.execute(
			useCasePayload
		);

		// assert
		expect(mockAuthenticationTokenManager.verifyRefreshToken).toHaveBeenCalledWith(
			useCasePayload.refreshToken
		);
		expect(mockAuthenticationRepository.checkAvailabilityToken).toHaveBeenCalledWith(
			useCasePayload.refreshToken
		);
		expect(mockAuthenticationTokenManager.decodePayload).toHaveBeenCalledWith(
			useCasePayload.refreshToken
		);
		expect(mockAuthenticationTokenManager.createAccessToken).toHaveBeenCalledWith({
			username: 'dicoding',
			id: 'user-123',
		});
		expect(accessToken).toEqual('some_new_access_token');
	});
});

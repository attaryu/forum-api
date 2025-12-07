const AuthenticationRepository = require('../../../../Domains/authentications/AuthenticationRepository');
const LogoutUserUseCase = require('../LogoutUserUseCase');

describe('LogoutUserUseCase', () => {
	it('should throw error if use case payload not contain refresh token', async () => {
		// arrange
		const useCasePayload = {};
		const logoutUserUseCase = new LogoutUserUseCase({});

		// act & assert
		await expect(
			logoutUserUseCase.execute(useCasePayload)
		).rejects.toThrowError(
			'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN'
		);
	});

	it('should throw error if refresh token not string', async () => {
		// arrange
		const useCasePayload = {
			refreshToken: 123,
		};
		const logoutUserUseCase = new LogoutUserUseCase({});

		// act & assert
		await expect(
			logoutUserUseCase.execute(useCasePayload)
		).rejects.toThrowError(
			'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'
		);
	});

	it('should orchestrating the delete authentication act correctly', async () => {
		// arrange
		const useCasePayload = {
			refreshToken: 'refreshToken',
		};
		const mockAuthenticationRepository = new AuthenticationRepository();
		mockAuthenticationRepository.checkAvailabilityToken = jest.fn(() => Promise.resolve());
		mockAuthenticationRepository.deleteToken = jest.fn(() => Promise.resolve());

		const logoutUserUseCase = new LogoutUserUseCase({
			authenticationRepository: mockAuthenticationRepository,
		});

		// act
		await logoutUserUseCase.execute(useCasePayload);

		// assert
		expect(mockAuthenticationRepository.checkAvailabilityToken).toBeCalledWith(
			useCasePayload.refreshToken
		);
		expect(mockAuthenticationRepository.deleteToken).toBeCalledWith(
			useCasePayload.refreshToken
		);
	});
});

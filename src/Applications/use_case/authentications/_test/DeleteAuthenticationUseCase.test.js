const AuthenticationRepository = require('../../../../Domains/authentications/AuthenticationRepository');
const DeleteAuthenticationUseCase = require('../DeleteAuthenticationUseCase');

describe('DeleteAuthenticationUseCase', () => {
	it('should throw error if use case payload not contain refresh token', async () => {
		// arrange
		const useCasePayload = {};
		const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({});

		// act & assert
		await expect(
			deleteAuthenticationUseCase.execute(useCasePayload)
		).rejects.toThrow(
			'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN'
		);
	});

	it('should throw error if refresh token not string', async () => {
		// arrange
		const useCasePayload = {
			refreshToken: 123,
		};
		const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({});

		// act & assert
		await expect(
			deleteAuthenticationUseCase.execute(useCasePayload)
		).rejects.toThrow(
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

		const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({
			authenticationRepository: mockAuthenticationRepository,
		});

		// act
		await deleteAuthenticationUseCase.execute(useCasePayload);

		// assert
		expect(mockAuthenticationRepository.checkAvailabilityToken).toHaveBeenCalledWith(
			useCasePayload.refreshToken
		);
		expect(mockAuthenticationRepository.deleteToken).toHaveBeenCalledWith(
			useCasePayload.refreshToken
		);
	});
});

const Jwt = require('@hapi/jwt');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const JwtTokenManager = require('../JwtTokenManager');

describe('JwtTokenManager', () => {
	describe('createAccessToken function', () => {
		it('should create accessToken correctly', async () => {
			// arrange
			const payload = {
				username: 'dicoding',
			};
			const mockJwtToken = {
				generate: jest.fn().mockImplementation(() => 'mock_token'),
			};
			const jwtTokenManager = new JwtTokenManager(mockJwtToken);

			// act
			const accessToken = await jwtTokenManager.createAccessToken(payload);

			// assert
			expect(mockJwtToken.generate).toBeCalledWith(
				payload,
				process.env.ACCESS_TOKEN_KEY
			);
			expect(accessToken).toEqual('mock_token');
		});
	});

	describe('createRefreshToken function', () => {
		it('should create refreshToken correctly', async () => {
			// arrange
			const payload = {
				username: 'dicoding',
			};
			const mockJwtToken = {
				generate: jest.fn().mockImplementation(() => 'mock_token'),
			};
			const jwtTokenManager = new JwtTokenManager(mockJwtToken);

			// act
			const refreshToken = await jwtTokenManager.createRefreshToken(payload);

			// assert
			expect(mockJwtToken.generate).toBeCalledWith(
				payload,
				process.env.REFRESH_TOKEN_KEY
			);
			expect(refreshToken).toEqual('mock_token');
		});
	});

	describe('verifyRefreshToken function', () => {
		it('should throw InvariantError when verification failed', async () => {
			// arrange
			const jwtTokenManager = new JwtTokenManager(Jwt.token);
			const accessToken = await jwtTokenManager.createAccessToken({
				username: 'dicoding',
			});

			// act & assert
			await expect(
				jwtTokenManager.verifyRefreshToken(accessToken)
			).rejects.toThrowError(InvariantError);
		});

		it('should not throw InvariantError when refresh token verified', async () => {
			// arrange
			const jwtTokenManager = new JwtTokenManager(Jwt.token);
			const refreshToken = await jwtTokenManager.createRefreshToken({
				username: 'dicoding',
			});

			// act & assert
			await expect(
				jwtTokenManager.verifyRefreshToken(refreshToken)
			).resolves.not.toThrowError(InvariantError);
		});
	});

	describe('decodePayload function', () => {
		it('should decode payload correctly', async () => {
			// arrange
			const jwtTokenManager = new JwtTokenManager(Jwt.token);
			const accessToken = await jwtTokenManager.createAccessToken({
				username: 'dicoding',
			});

			// act
			const { username: expectedUsername } =
				await jwtTokenManager.decodePayload(accessToken);

			// act & assert
			expect(expectedUsername).toEqual('dicoding');
		});
	});
});

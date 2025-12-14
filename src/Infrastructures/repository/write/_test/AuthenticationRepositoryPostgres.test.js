const InvariantError = require('../../../../Commons/exceptions/InvariantError');
const AuthenticationsTableTestHelper = require('../../../../../tests/AuthenticationsTableTestHelper');
const pool = require('../../../database/postgres/pool');
const AuthenticationRepositoryPostgres = require('../AuthenticationRepositoryPostgres');

describe('AuthenticationRepository postgres', () => {
	afterEach(async () => {
		await AuthenticationsTableTestHelper.cleanTable();
	});

	afterAll(async () => {
		await pool.end();
	});

	describe('addToken function', () => {
		it('should add token to database', async () => {
			// arrange
			const authenticationRepository = new AuthenticationRepositoryPostgres(
				pool
			);
			const token = 'token';

			// act
			await authenticationRepository.addToken(token);

			// assert
			const tokens = await AuthenticationsTableTestHelper.findToken(token);
			expect(tokens).toHaveLength(1);
			expect(tokens[0].token).toBe(token);
		});
	});

	describe('checkAvailabilityToken function', () => {
		it('should throw InvariantError if token not available', async () => {
			// arrange
			const authenticationRepository = new AuthenticationRepositoryPostgres(
				pool
			);
			const token = 'token';

			// act & assert
			await expect(
				authenticationRepository.checkAvailabilityToken(token)
			).rejects.toThrow(InvariantError);
		});

		it('should not throw InvariantError if token available', async () => {
			// arrange
			const authenticationRepository = new AuthenticationRepositoryPostgres(
				pool
			);
			const token = 'token';
			await AuthenticationsTableTestHelper.addToken(token);

			// act & assert
			await expect(
				authenticationRepository.checkAvailabilityToken(token)
			).resolves.not.toThrow(InvariantError);
		});
	});

	describe('deleteToken', () => {
		it('should delete token from database', async () => {
			// arrange
			const authenticationRepository = new AuthenticationRepositoryPostgres(
				pool
			);
			const token = 'token';
			await AuthenticationsTableTestHelper.addToken(token);

			// act
			await authenticationRepository.deleteToken(token);

			// assert
			const tokens = await AuthenticationsTableTestHelper.findToken(token);
			expect(tokens).toHaveLength(0);
		});
	});
});

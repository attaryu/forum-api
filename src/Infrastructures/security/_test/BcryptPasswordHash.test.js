const bcrypt = require('bcrypt');
const AuthenticationError = require('../../../Commons/exceptions/AuthenticationError');
const BcryptEncryptionHelper = require('../BcryptPasswordHash');

describe('BcryptEncryptionHelper', () => {
	describe('hash function', () => {
		it('should encrypt password correctly', async () => {
			// arrange
			const spyHash = jest.spyOn(bcrypt, 'hash');
			const bcryptEncryptionHelper = new BcryptEncryptionHelper(bcrypt);

			// act
			const encryptedPassword = await bcryptEncryptionHelper.hash(
				'plain_password'
			);

			// assert
			expect(typeof encryptedPassword).toEqual('string');
			expect(encryptedPassword).not.toEqual('plain_password');
			expect(spyHash).toHaveBeenCalledWith('plain_password', 10); // 10 adalah nilai saltRound default untuk BcryptEncryptionHelper
		});
	});

	describe('comparePassword function', () => {
		it('should throw AuthenticationError if password not match', async () => {
			// arrange
			const bcryptEncryptionHelper = new BcryptEncryptionHelper(bcrypt);

			// act & assert
			await expect(
				bcryptEncryptionHelper.comparePassword(
					'plain_password',
					'encrypted_password'
				)
			).rejects.toThrow(AuthenticationError);
		});

		it('should not return AuthenticationError if password match', async () => {
			// arrange
			const bcryptEncryptionHelper = new BcryptEncryptionHelper(bcrypt);
			const plainPassword = 'secret';
			const encryptedPassword = await bcryptEncryptionHelper.hash(
				plainPassword
			);

			// act & assert
			await expect(
				bcryptEncryptionHelper.comparePassword(plainPassword, encryptedPassword)
			).resolves.not.toThrow(AuthenticationError);
		});
	});
});

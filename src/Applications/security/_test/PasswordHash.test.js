const EncryptionHelper = require('../PasswordHash');

describe('EncryptionHelper interface', () => {
	it('should throw error when invoke abstract behavior', async () => {
		// arrange
		const encryptionHelper = new EncryptionHelper();

		// act & assert
		await expect(encryptionHelper.hash('dummy_password')).rejects.toThrow(
			'PASSWORD_HASH.METHOD_NOT_IMPLEMENTED'
		);
		await expect(
			encryptionHelper.comparePassword('plain', 'encrypted')
		).rejects.toThrow('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
	});
});

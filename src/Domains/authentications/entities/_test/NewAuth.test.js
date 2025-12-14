const NewAuth = require('../NewAuth');

describe('NewAuth entities', () => {
	it('should throw error when payload not contain needed property', () => {
		// arrange
		const payload = {
			accessToken: 'accessToken',
		};

		// act & assert
		expect(() => new NewAuth(payload)).toThrow(
			'NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY'
		);
	});

	it('should throw error when payload not meet data type specification', () => {
		// arrange
		const payload = {
			accessToken: 'accessToken',
			refreshToken: 1234,
		};

		// act & assert
		expect(() => new NewAuth(payload)).toThrow(
			'NEW_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION'
		);
	});

	it('should create NewAuth entities correctly', () => {
		// arrange
		const payload = {
			accessToken: 'accessToken',
			refreshToken: 'refreshToken',
		};

		// act
		const newAuth = new NewAuth(payload);

		// assert
		expect(newAuth).toBeInstanceOf(NewAuth);
		expect(newAuth.accessToken).toEqual(payload.accessToken);
		expect(newAuth.refreshToken).toEqual(payload.refreshToken);
	});
});

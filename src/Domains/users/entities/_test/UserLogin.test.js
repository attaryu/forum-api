const UserLogin = require('../UserLogin');

describe('UserLogin entities', () => {
	it('should throw error when payload does not contain needed property', () => {
		// arrange
		const payload = {
			username: 'dicoding',
		};

		// act & assert
		expect(() => new UserLogin(payload)).toThrow(
			'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY'
		);
	});

	it('should throw error when payload not meet data type specification', () => {
		// arrange
		const payload = {
			username: 'dicoding',
			password: 12345,
		};

		// act & assert
		expect(() => new UserLogin(payload)).toThrow(
			'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION'
		);
	});

	it('should create UserLogin entities correctly', () => {
		// arrange
		const payload = {
			username: 'dicoding',
			password: '12345',
		};

		// act
		const userLogin = new UserLogin(payload);

		// assert
		expect(userLogin).toBeInstanceOf(UserLogin);
		expect(userLogin.username).toEqual(payload.username);
		expect(userLogin.password).toEqual(payload.password);
	});
});

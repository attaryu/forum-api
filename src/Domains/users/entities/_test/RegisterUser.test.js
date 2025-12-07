const RegisterUser = require('../RegisterUser');

describe('a RegisterUser entities', () => {
	it('should throw error when payload did not contain needed property', () => {
		// arrange
		const payload = {
			username: 'abc',
			password: 'abc',
		};

		// act and assert
		expect(() => new RegisterUser(payload)).toThrowError(
			'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY'
		);
	});

	it('should throw error when payload did not meet data type specification', () => {
		// arrange
		const payload = {
			username: 123,
			fullname: true,
			password: 'abc',
		};

		// act and assert
		expect(() => new RegisterUser(payload)).toThrowError(
			'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION'
		);
	});

	it('should throw error when username contains more than 50 character', () => {
		// arrange
		const payload = {
			username: 'dicodingindonesiadicodingindonesiadicodingindonesiadicoding',
			fullname: 'Dicoding Indonesia',
			password: 'abc',
		};

		// act and assert
		expect(() => new RegisterUser(payload)).toThrowError(
			'REGISTER_USER.USERNAME_LIMIT_CHAR'
		);
	});

	it('should throw error when username contains restricted character', () => {
		// arrange
		const payload = {
			username: 'dico ding',
			fullname: 'dicoding',
			password: 'abc',
		};

		// act and assert
		expect(() => new RegisterUser(payload)).toThrowError(
			'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER'
		);
	});

	it('should create registerUser object correctly', () => {
		// arrange
		const payload = {
			username: 'dicoding',
			fullname: 'Dicoding Indonesia',
			password: 'abc',
		};

		// act
		const { username, fullname, password } = new RegisterUser(payload);

		// assert
		expect(username).toEqual(payload.username);
		expect(fullname).toEqual(payload.fullname);
		expect(password).toEqual(payload.password);
	});
});

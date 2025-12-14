const NewThread = require('../NewThread');

describe('NewThread entities', () => {
	it('should throw error when payload not contain needed property', () => {
		// arrange
		const payload = {
			title: 'title',
		};

		// act & assert
		expect(() => new NewThread(payload)).toThrow(
			'NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
		);
	});

	it('should throw error when payload not meet data type specification', () => {
		// arrange
		const payload = {
			title: 'title',
			body: 1234,
		};

		// act & assert
		expect(() => new NewThread(payload)).toThrow(
			'NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
		);
	});

	it('should throw error when title is more than 50 characters', () => {
		// arrange
		const payload = {
			title: 'a'.repeat(51),
			body: 'body',
		};

		// act & assert
		expect(() => new NewThread(payload)).toThrow(
			'NEW_THREAD.TITLE_LIMIT_CHAR'
		);
	});

	it('should create NewThread entities correctly', () => {
		// arrange
		const payload = {
			title: 'title',
			body: 'body',
		};

		// act
		const newThread = new NewThread(payload);

		// assert
		expect(newThread).toBeInstanceOf(NewThread);
		expect(newThread.title).toEqual(payload.title);
		expect(newThread.body).toEqual(payload.body);
	});
});

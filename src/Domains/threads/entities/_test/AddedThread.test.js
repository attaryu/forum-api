const AddedThread = require('../AddedThread');

describe('AddedThread entities', () => {
	it('should throw error when payload not contain needed property', () => {
		// arrange
		const payload = {
			title: 'title',
		};

		// act & assert
		expect(() => new AddedThread(payload)).toThrowError(
			'ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
		);
	});

	it('should throw error when payload not meet data type specification', () => {
		// arrange
		const payload = {
			id: 1234,
			title: 'title',
			owner: true,
		};

		// act & assert
		expect(() => new AddedThread(payload)).toThrowError(
			'ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
		);
	});

	it('should create AddedThread entities correctly', () => {
		// arrange
		const payload = {
			id: 'thread-123',
			title: 'title',
			owner: 'user-123',
		};

		// act
		const newThread = new AddedThread(payload);

		// assert
		expect(newThread).toBeInstanceOf(AddedThread);
		expect(newThread.id).toEqual(payload.id);
		expect(newThread.title).toEqual(payload.title);
		expect(newThread.owner).toEqual(payload.owner);
	});
});

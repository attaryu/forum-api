const AddedThread = require('../AddedThread');

describe('AddedThread entities', () => {
	it('should throw error when payload not contain needed property', () => {
		// Arrange
		const payload = {
			title: 'title',
		};

		// Action & Assert
		expect(() => new AddedThread(payload)).toThrow(
			'ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
		);
	});

	it('should throw error when payload not meet data type specification', () => {
		// Arrange
		const payload = {
			id: 1234,
			title: 'title',
			owner: true,
		};

		// Action & Assert
		expect(() => new AddedThread(payload)).toThrow(
			'ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
		);
	});

	it('should create AddedThread entities correctly', () => {
		// Arrange
		const payload = {
			id: 'thread-123',
			title: 'title',
			owner: 'user-123',
		};

		// Action
		const newThread = new AddedThread(payload);

		// Assert
		expect(newThread).toBeInstanceOf(AddedThread);
		expect(newThread.id).toEqual(payload.id);
		expect(newThread.title).toEqual(payload.title);
		expect(newThread.owner).toEqual(payload.owner);
	});
});

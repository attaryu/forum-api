const AddedReply = require('../AddedReply');

describe('AddedReply entity', () => {
	it('should throw error when payload not contain needed property', () => {
		// arrange
		const payload = {
			foo: 'bar',
		};

		// act & assert
		expect(() => new AddedReply(payload)).toThrowError(
			'ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY'
		);
	});

	it('should throw error when payload not meet data type specification', () => {
		// arrange
		const payload = {
			id: 123,
			content: true,
			owner: {},
		};

		// act & assert
		expect(() => new AddedReply(payload)).toThrowError(
			'ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'
		);
	});

	it('should create AddedReply entity correctly', () => {
		// arrange
		const payload = {
			id: 'reply-123',
			content: 'a reply',
			owner: 'user-123',
		};

		// act
		const addedReply = new AddedReply(payload);
		// assert
		expect(addedReply).toBeInstanceOf(AddedReply);
		expect(addedReply.id).toEqual(payload.id);
		expect(addedReply.content).toEqual(payload.content);
		expect(addedReply.owner).toEqual(payload.owner);
	});
});

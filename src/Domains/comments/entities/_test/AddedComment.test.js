const AddedComment = require('../AddedComment');

describe('AddedComment entity', () => {
	it('should throw error when payload not contain needed property', () => {
		// arrange
		const payload = {
			foo: 'bar',
		};

		// act & assert
		expect(() => new AddedComment(payload)).toThrowError(
			'NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
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
		expect(() => new AddedComment(payload)).toThrowError(
			'NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
		);
	});

	it('should create AddedComment entity correctly', () => {
		// arrange
		const payload = {
			id: 'comment-123',
			content: 'a comment',
			owner: 'user-123',
		};

		// act
		const addedComment = new AddedComment(payload);
		// assert
		expect(addedComment).toBeInstanceOf(AddedComment);
		expect(addedComment.id).toEqual(payload.id);
		expect(addedComment.content).toEqual(payload.content);
		expect(addedComment.owner).toEqual(payload.owner);
	});
});

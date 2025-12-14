const CommentDetail = require('../CommentDetail');

describe('CommentDetail', () => {
	it('should throw error when payload did not contain needed property', () => {
		// arrange
		const payload = {
			id: 'comment-123',
			username: 'user',
			date: '2021-08-08T07:19:09.775Z',
		};

		// act & assert
		expect(() => new CommentDetail(payload)).toThrow(
			'COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY'
		);
	});

	it('should throw error when payload did not meet data type specification', () => {
		// arrange
		const payload = {
			id: 'comment-123',
			username: 'user',
			date: 123,
			content: 'content',
			isDeleted: false,
		};

		// act & assert
		expect(() => new CommentDetail(payload)).toThrow(
			'COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION'
		);
	});

	it('should create commentDetail object correctly when not deleted', () => {
		// arrange
		const payload = {
			id: 'comment-123',
			username: 'dicoding',
			date: '2021-08-08T07:19:09.775Z',
			content: 'sebuah comment',
			isDeleted: false,
		};

		// act
		const commentDetail = new CommentDetail(payload);

		// assert
		expect(commentDetail.id).toEqual(payload.id);
		expect(commentDetail.username).toEqual(payload.username);
		expect(commentDetail.date).toEqual(payload.date);
		expect(commentDetail.content).toEqual('sebuah comment');
	});

	it('should create commentDetail object correctly when deleted', () => {
		// arrange
		const payload = {
			id: 'comment-123',
			username: 'dicoding',
			date: '2021-08-08T07:19:09.775Z',
			content: 'sebuah comment',
			isDeleted: true,
		};

		// act
		const commentDetail = new CommentDetail(payload);

		// assert
		expect(commentDetail.id).toEqual(payload.id);
		expect(commentDetail.username).toEqual(payload.username);
		expect(commentDetail.date).toEqual(payload.date);
		expect(commentDetail.content).toEqual('**komentar telah dihapus**');
	});
});

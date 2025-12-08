const ReplyDetail = require('../ReplyDetail');

describe('ReplyDetail', () => {
	it('should throw error when payload did not contain needed property', () => {
		// arrange
		const payload = {
			id: 'reply-123',
			username: 'user',
			date: '2021-08-08T07:19:09.775Z',
		};

		// act & assert
		expect(() => new ReplyDetail(payload)).toThrowError(
			'REPLY_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY'
		);
	});

	it('should throw error when payload did not meet data type specification', () => {
		// arrange
		const payload = {
			id: 'reply-123',
			username: 'user',
			date: 123,
			content: 'content',
			isDeleted: false,
			commentId: 'comment-123',
		};

		// act & assert
		expect(() => new ReplyDetail(payload)).toThrowError(
			'REPLY_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION'
		);
	});

	it('should create replyDetail object correctly when not deleted', () => {
		// arrange
		const payload = {
			id: 'reply-123',
			username: 'dicoding',
			date: '2021-08-08T07:19:09.775Z',
			content: 'sebuah balasan',
			isDeleted: false,
			commentId: 'comment-123',
		};

		// act
		const replyDetail = new ReplyDetail(payload);

		// assert
		expect(replyDetail.id).toEqual(payload.id);
		expect(replyDetail.username).toEqual(payload.username);
		expect(replyDetail.date).toEqual(payload.date);
		expect(replyDetail.content).toEqual('sebuah balasan');
		expect(replyDetail.commentId).toEqual('comment-123');
	});

	it('should create replyDetail object correctly when deleted', () => {
		// arrange
		const payload = {
			id: 'reply-123',
			username: 'dicoding',
			date: '2021-08-08T07:19:09.775Z',
			content: 'sebuah balasan',
			isDeleted: true,
			commentId: 'comment-123',
		};

		// act
		const replyDetail = new ReplyDetail(payload);

		// assert
		expect(replyDetail.id).toEqual(payload.id);
		expect(replyDetail.username).toEqual(payload.username);
		expect(replyDetail.date).toEqual(payload.date);
		expect(replyDetail.content).toEqual('**balasan telah dihapus**');
		expect(replyDetail.commentId).toEqual('comment-123');
	});
});

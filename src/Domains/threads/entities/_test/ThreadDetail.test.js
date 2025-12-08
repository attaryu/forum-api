const ThreadDetail = require('../ThreadDetail');

describe('ThreadDetail', () => {
	it('should throw error when payload did not contain needed property', () => {
		// arrange
		const payload = {
			id: 'thread-123',
			title: 'title',
			body: 'body',
		};

		// act & assert
		expect(() => new ThreadDetail(payload)).toThrowError(
			'THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY'
		);
	});

	it('should throw error when payload did not meet data type specification', () => {
		// arrange
		const payload = {
			id: 'thread-123',
			title: 'title',
			body: 'body',
			date: 123,
			username: 'user',
		};

		// act & assert
		expect(() => new ThreadDetail(payload)).toThrowError(
			'THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION'
		);
	});

	it('should create threadDetail object correctly', () => {
		// arrange
		const payload = {
			id: 'thread-123',
			title: 'title',
			body: 'body',
			date: '2021-08-08T07:19:09.775Z',
			username: 'dicoding',
		};

		// act
		const threadDetail = new ThreadDetail(payload);

		// assert
		expect(threadDetail.id).toEqual(payload.id);
		expect(threadDetail.title).toEqual(payload.title);
		expect(threadDetail.body).toEqual(payload.body);
		expect(threadDetail.date).toEqual(payload.date);
		expect(threadDetail.username).toEqual(payload.username);
	});
});

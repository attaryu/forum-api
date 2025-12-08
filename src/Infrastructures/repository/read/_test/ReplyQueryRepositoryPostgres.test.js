const RepliesTableTestHelper = require('../../../../../tests/RepliesTableTestHelper');
const CommentsTableTestHelper = require('../../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../../tests/UsersTableTestHelper');
const pool = require('../../../database/postgres/pool');
const ReplyQueryRepositoryPostgres = require('../ReplyQueryRepositoryPostgres');

describe('ReplyQueryRepositoryPostgres', () => {
	afterEach(async () => {
		await RepliesTableTestHelper.cleanTable();
		await CommentsTableTestHelper.cleanTable();
		await ThreadsTableTestHelper.cleanTable();
		await UsersTableTestHelper.cleanTable();
	});

	afterAll(async () => {
		await pool.end();
	});

	describe('getRepliesByThreadId function', () => {
		it('should return replies correctly', async () => {
			// arrange
			const threadId = 'thread-123';
			const commentId = 'comment-123';
			const userId = 'user-123';

			await UsersTableTestHelper.addUser({ id: userId, username: 'dicoding' });
			await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
			await CommentsTableTestHelper.addComment({
				id: commentId,
				threadId,
				owner: userId,
			});
			await RepliesTableTestHelper.addReply({
				id: 'reply-123',
				commentId,
				owner: userId,
				content: 'first reply',
			});
			await RepliesTableTestHelper.addReply({
				id: 'reply-456',
				commentId,
				owner: userId,
				content: 'second reply',
			});

			const replyQueryRepository = new ReplyQueryRepositoryPostgres(pool);

			// act
			const replies = await replyQueryRepository.getRepliesByThreadId(threadId);

			// assert
			expect(replies).toHaveLength(2);
			expect(replies[0].id).toEqual('reply-123');
			expect(replies[0].username).toEqual('dicoding');
			expect(replies[0].content).toEqual('first reply');
			expect(replies[0].commentId).toEqual(commentId);
			expect(replies[0].date).toBeDefined();
			expect(replies[1].id).toEqual('reply-456');
			expect(replies[1].username).toEqual('dicoding');
			expect(replies[1].content).toEqual('second reply');
		});

		it('should return empty array when no replies', async () => {
			// arrange
			const threadId = 'thread-123';
			const commentId = 'comment-123';
			const userId = 'user-123';

			await UsersTableTestHelper.addUser({ id: userId });
			await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
			await CommentsTableTestHelper.addComment({
				id: commentId,
				threadId,
				owner: userId,
			});

			const replyQueryRepository = new ReplyQueryRepositoryPostgres(pool);

			// act
			const replies = await replyQueryRepository.getRepliesByThreadId(threadId);

			// assert
			expect(replies).toHaveLength(0);
		});
	});
});

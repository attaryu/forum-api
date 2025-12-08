const CommentsTableTestHelper = require('../../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../../tests/UsersTableTestHelper');
const CommentDetail = require('../../../../Domains/comments/entities/CommentDetail');
const pool = require('../../../database/postgres/pool');
const CommentQueryRepositoryPostgres = require('../CommentQueryRepositoryPostgres');

describe('CommentQueryRepositoryPostgres', () => {
	afterEach(async () => {
		await CommentsTableTestHelper.cleanTable();
		await ThreadsTableTestHelper.cleanTable();
		await UsersTableTestHelper.cleanTable();
	});

	afterAll(async () => {
		await pool.end();
	});

	describe('getCommentsByThreadId function', () => {
		it('should return comments correctly', async () => {
			// arrange
			const threadId = 'thread-123';
			const userId = 'user-123';

			await UsersTableTestHelper.addUser({ id: userId, username: 'username' });
			await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
			await CommentsTableTestHelper.addComment({
				id: 'comment-123',
				threadId,
				owner: userId,
				content: 'first comment',
			});
			await CommentsTableTestHelper.addComment({
				id: 'comment-456',
				threadId,
				owner: userId,
				content: 'second comment',
			});

			const commentQueryRepository = new CommentQueryRepositoryPostgres(pool);

			// act
			const comments = await commentQueryRepository.getCommentsByThreadId(
				threadId
			);

			// assert
			expect(comments).toHaveLength(2);

			const [comment1, comment2] = comments;

			expect(comment1.id).toEqual('comment-123');
			expect(comment1.username).toEqual('username');
			expect(comment1.content).toEqual('first comment');
			expect(comment1.date).toBeDefined();
			expect(comment2.id).toEqual('comment-456');
			expect(comment2.username).toEqual('username');
			expect(comment2.content).toEqual('second comment');
		});

		it('should return empty array when no comments', async () => {
			// arrange
			const threadId = 'thread-123';
			const userId = 'user-123';

			await UsersTableTestHelper.addUser({ id: userId });
			await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });

			const commentQueryRepository = new CommentQueryRepositoryPostgres(pool);

			// act
			const comments = await commentQueryRepository.getCommentsByThreadId(
				threadId
			);

			// assert
			expect(comments).toHaveLength(0);
		});
	});
});

const CommentsTableTestHelper = require('../../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../../tests/UsersTableTestHelper');
const pool = require('../../../database/postgres/pool');
const CommentQueryRepositoryPostgres = require('../CommentQueryRepositoryPostgres');

describe('CommentQueryRepositoryPostgres', () => {
	const userId = 'user-123';
	const threadId = 'thread-123';

	const commentQueryRepository = new CommentQueryRepositoryPostgres(pool);

	beforeAll(async () => {
		await UsersTableTestHelper.addUser({ id: userId, username: 'username' });
		await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
	});

	afterEach(async () => {
		await CommentsTableTestHelper.cleanTable();
	});

	afterAll(async () => {
		await ThreadsTableTestHelper.cleanTable();
		await UsersTableTestHelper.cleanTable();

		await pool.end();
	});

	describe('getCommentsByThreadId function', () => {
		it('should return comments correctly', async () => {
			// arrange
			const commentId = 'comment-123';
			await CommentsTableTestHelper.addComment({
				id: commentId,
				threadId,
				owner: userId,
				content: 'first comment',
			});
			await CommentsTableTestHelper.likeComment({ commentId, userId });

			await CommentsTableTestHelper.addComment({
				id: 'comment-456',
				threadId,
				owner: userId,
				content: 'second comment',
			});

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
			expect(comment1.likeCount).toEqual(1);

			expect(comment2.id).toEqual('comment-456');
			expect(comment2.username).toEqual('username');
			expect(comment2.content).toEqual('second comment');
			expect(comment2.date).toBeDefined();
			expect(comment2.likeCount).toEqual(0);
		});

		it('should return empty array when no comments', async () => {
			// act
			const comments = await commentQueryRepository.getCommentsByThreadId(
				threadId
			);

			// assert
			expect(comments).toHaveLength(0);
		});
	});
});

const ThreadQueryRepositoryPostgres = require('../ThreadQueryRepositoryPostgres');
const ThreadsTableTestHelper = require('../../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../../tests/RepliesTableTestHelper');
const pool = require('../../../database/postgres/pool');
const NotFoundError = require('../../../../Commons/exceptions/NotFoundError');

describe('ThreadQueryRepository postgres', () => {
	const threadId = 'thread-123';
	const commentId = 'comment-456';
	const deletedCommentId = 'comment-123';
	const deletedReplyId = 'reply-123';

	const threadQueryRepositoryPostgres = new ThreadQueryRepositoryPostgres(pool);

	beforeAll(async () => {
		const userId = 'user-123';

		await UsersTableTestHelper.addUser({ id: userId });
		await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });

		await CommentsTableTestHelper.addComment({
			id: commentId,
			threadId,
			owner: userId,
		});
		await CommentsTableTestHelper.addComment({
			id: deletedCommentId,
			threadId,
			owner: userId,
			isDeleted: true,
		});

		await RepliesTableTestHelper.addReply({
			commentId,
			owner: userId,
		});
		await RepliesTableTestHelper.addReply({
			id: deletedReplyId,
			commentId,
			isDeleted: true,
			owner: userId,
		});
	});

	afterAll(async () => {
		await CommentsTableTestHelper.cleanTable();
		await ThreadsTableTestHelper.cleanTable();
		await UsersTableTestHelper.cleanTable();
		await RepliesTableTestHelper.cleanTable();

		await pool.end();
	});

	describe('getThreadById function', () => {
		it('should return thread correctly', async () => {
			// act
			const thread = await threadQueryRepositoryPostgres.getThreadById(
				threadId
			);

			// assert
			expect(thread).toBeDefined();
			expect(thread.id).toEqual(threadId);
			expect(thread.title).toBeDefined();
			expect(thread.body).toBeDefined();
			expect(thread.date).toBeDefined();
			expect(thread.username).toBeDefined();

			expect(thread.comments).toHaveLength(2);
			expect(
				thread.comments.find(({ id }) => id === deletedCommentId).content
			).toEqual('**komentar telah dihapus**');

			const comment = thread.comments.find(({ id }) => id === commentId);

			expect(comment.replies).toHaveLength(2);
			expect(
				comment.replies.find(({ id }) => id === deletedReplyId).content
			).toEqual('**balasan telah dihapus**');
		});

		it('should throw NotFoundError when thread not found', async () => {
			// act & assert
			await expect(
				threadQueryRepositoryPostgres.getThreadById('thread-999')
			).rejects.toThrowError(NotFoundError);
		});
	});
});

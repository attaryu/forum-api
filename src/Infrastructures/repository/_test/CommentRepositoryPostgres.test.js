const pool = require('../../database/postgres/pool');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepository postgres', () => {
	// arrange
	const content = 'content';
	const threadId = 'thread-123';
	const userCreatorId = 'user-123';
	const userCommenterId = 'user-456';

	const commentRepositoryPostgres = new CommentRepositoryPostgres(
		pool,
		() => '123'
	);

	beforeAll(async () => {
		await UsersTableTestHelper.addUser({
			id: userCreatorId,
			username: 'creator',
			fullname: 'User Creator',
			password: 'password',
		});

		await ThreadsTableTestHelper.addThread({
			id: threadId,
			title: 'sebuah thread',
			body: 'sebuah body thread',
			owner: userCreatorId,
		});

		await UsersTableTestHelper.addUser({
			id: userCommenterId,
			username: 'commenter',
			fullname: 'User Commenter',
			password: 'password',
		});
	});

	afterEach(async () => {
		await CommentsTableTestHelper.cleanTable();
	});

	afterAll(async () => {
		await ThreadsTableTestHelper.cleanTable();
		await UsersTableTestHelper.cleanTable();

		await pool.end();
	});

	describe('addComment function', () => {
		it('should persist added comment and return added comment correctly', async () => {
			// Action
			await commentRepositoryPostgres.addComment(
				content,
				threadId,
				userCommenterId
			);

			// Assert
			const comments = await CommentsTableTestHelper.findCommentsById(
				'comment-123'
			);
			expect(comments).toHaveLength(1);
		});

		it('should return added comment correctly', async () => {
			const addedComment = await commentRepositoryPostgres.addComment(
				content,
				threadId,
				userCommenterId
			);

			expect(addedComment).toStrictEqual(
				new AddedComment({
					id: 'comment-123',
					content,
					owner: userCommenterId,
				})
			);
		});
	});
});

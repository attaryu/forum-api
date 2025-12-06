const pool = require('../../database/postgres/pool');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepository postgres', () => {
	// arrange
	const content = 'content';
	const commentId = 'comment-123';
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
			// act
			await commentRepositoryPostgres.addComment(
				content,
				threadId,
				userCommenterId
			);

			// assert
			const comments = await CommentsTableTestHelper.findCommentsById(
				commentId
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
					id: commentId,
					content,
					owner: userCommenterId,
				})
			);
		});
	});

	describe('deleteComment function', () => {
		it('should soft delete comment correctly', async () => {
			// arrange
			await CommentsTableTestHelper.addComment({
				id: commentId,
				content,
				threadId,
				owner: userCommenterId,
			});

			// act
			await commentRepositoryPostgres.deleteComment(commentId);

			// assert
			const [afterDeleteComment] =
				await CommentsTableTestHelper.findCommentsById(commentId);

			expect(afterDeleteComment.is_deleted).toBe(true);
		});
	});

	describe('verifyComment function', () => {
		it('should throw NotFoundError when comment not found', async () => {
			// act & assert
			await expect(
				commentRepositoryPostgres.verifyComment('comment-xyz', userCommenterId)
			).rejects.toThrowError(NotFoundError);
		});

		it('should throw AuthorizationError when the owner is different', async () => {
			// arrange
			await CommentsTableTestHelper.addComment({
				id: commentId,
				content,
				threadId,
				owner: userCommenterId,
			});

			// act & assert
			await expect(
				commentRepositoryPostgres.verifyComment(commentId, 'user-xyz')
			).rejects.toThrowError(AuthorizationError);
		});

		it('should not throw NotFoundError and AuthorizationError when the owner is the same and the comment is exist', async () => {
			// arrange
			await CommentsTableTestHelper.addComment({
				id: commentId,
				content,
				threadId,
				owner: userCommenterId,
			});

			// act & assert
			await expect(
				commentRepositoryPostgres.verifyComment(commentId, userCommenterId)
			).resolves.not.toThrowError(AuthorizationError);
			await expect(
				commentRepositoryPostgres.verifyComment(commentId, userCommenterId)
			).resolves.not.toThrowError(NotFoundError);
		});
	});
});

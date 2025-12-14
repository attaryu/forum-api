const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const UsersTableTestHelper = require('../../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../../tests/RepliesTableTestHelper');
const pool = require('../../../database/postgres/pool');
const AddedReply = require('../../../../Domains/replies/entities/AddedReply');
const NotFoundError = require('../../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../../Commons/exceptions/AuthorizationError');

describe('ReplyRepository postgres', () => {
	const threadCreator = 'user-123';
	const threadId = 'thread-123';

	const commentCreator = 'user-456';
	const commentId = 'comment-123';

	const replyCreator = 'user-789';
	const expectedReplyId = 'reply-123';

	const replyRepositoryPostgres = new ReplyRepositoryPostgres(
		pool,
		() => '123'
	);

	beforeAll(async () => {
		await UsersTableTestHelper.addUser({ id: threadCreator });
		await ThreadsTableTestHelper.addThread({
			id: threadId,
			owner: threadCreator,
		});

		await UsersTableTestHelper.addUser({ id: commentCreator });
		await CommentsTableTestHelper.addComment({
			id: commentId,
			threadId: threadId,
			owner: commentCreator,
		});

		await UsersTableTestHelper.addUser({ id: replyCreator });
	});

	afterEach(async () => {
		await RepliesTableTestHelper.cleanTable();
	});

	afterAll(async () => {
		await CommentsTableTestHelper.cleanTable();
		await ThreadsTableTestHelper.cleanTable();
		await UsersTableTestHelper.cleanTable();

		await pool.end();
	});

	describe('addReply function', () => {
		it('should return added reply correctly', async () => {
			// act
			const addedReply = await replyRepositoryPostgres.addReply(
				'reply',
				commentId,
				replyCreator
			);

			// assert
			expect(addedReply).toStrictEqual(
				new AddedReply({
					id: expectedReplyId,
					content: 'reply',
					owner: replyCreator,
				})
			);
		});

		it('should persist add reply', async () => {
			// act
			await replyRepositoryPostgres.addReply('reply', commentId, replyCreator);

			// assert
			const reply = await RepliesTableTestHelper.findReplyById(expectedReplyId);
			expect(reply).toBeDefined();
		});
	});

	describe('deleteReply function', () => {
		it('should soft delete reply correctly', async () => {
			// arrange
			await RepliesTableTestHelper.addReply({
				id: expectedReplyId,
				commentId,
				owner: replyCreator,
			});

			// act
			await replyRepositoryPostgres.deleteReply(commentId, expectedReplyId);

			// assert
			const reply = await RepliesTableTestHelper.findReplyById(expectedReplyId);
			expect(reply.is_deleted).toBe(true);
		});
	});

	describe('verifyReplyExist function', () => {
		it('should throw NotFoundError when reply not found', async () => {
			// act & assert
			await expect(
				replyRepositoryPostgres.verifyReplyExist(commentId, 'reply-999')
			).rejects.toThrow(NotFoundError);
		});

		it('should not throw NotFoundError when reply found', async () => {
			// arrange
			await RepliesTableTestHelper.addReply({
				id: expectedReplyId,
				commentId,
				owner: replyCreator,
			});

			// act & assert
			await expect(
				replyRepositoryPostgres.verifyReplyExist(commentId, expectedReplyId)
			).resolves.not.toThrow(NotFoundError);
		});
	});

	describe('verifyReplyOwner function', () => {
		it('should throw AuthorizationError when user is not the owner', async () => {
			// arrange
			await RepliesTableTestHelper.addReply({
				id: expectedReplyId,
				commentId,
				owner: replyCreator,
			});

			// act & assert
			await expect(
				replyRepositoryPostgres.verifyReplyOwner(expectedReplyId, 'user-000')
			).rejects.toThrow(AuthorizationError);
		});

		it('should not throw AuthorizationError when user is the owner', async () => {
			// arrange
			await RepliesTableTestHelper.addReply({
				id: expectedReplyId,
				commentId,
				owner: replyCreator,
			});

			// act & assert
			await expect(
				replyRepositoryPostgres.verifyReplyOwner(expectedReplyId, replyCreator)
			).resolves.not.toThrow(AuthorizationError);
		});
	});
});

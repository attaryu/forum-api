const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const UsersTableTestHelper = require('../../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../../tests/RepliesTableTestHelper');
const pool = require('../../../database/postgres/pool');
const AddedReply = require('../../../../Domains/replies/entities/AddedReply');

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
});

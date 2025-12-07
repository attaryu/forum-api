const createServer = require('../createServer');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const pool = require('../../database/postgres/pool');
const helper = require('./helper');
const container = require('../../container');

describe('/threads/{threadId}/comments/{commentId}/replies endpoint', () => {
	const payload = { content: 'content' };

	const threadId = 'thread-123';
	const commentId = 'comment-123';

	let replyCreatorId;
	let headers;

	let server;

	beforeAll(async () => {
		server = await createServer(container);

		const threadCreatorId = 'user-123';
		await UsersTableTestHelper.addUser({ id: threadCreatorId });
		await ThreadsTableTestHelper.addThread({
			id: threadId,
			owner: threadCreatorId,
		});

		const commentCreatorId = 'user-456';
		await UsersTableTestHelper.addUser({ id: commentCreatorId });
		await CommentsTableTestHelper.addComment({
			id: commentId,
			threadId,
			owner: commentCreatorId,
		});

		const replyCreator = await helper.createUserAndLogin(server);
		replyCreatorId = replyCreator.user.id;
		headers = {
			Authorization: `Bearer ${replyCreator.accessToken}`,
		};
	});

	afterEach(async () => {
		await RepliesTableTestHelper.cleanTable();
	});

	afterAll(async () => {
		await CommentsTableTestHelper.cleanTable();
		await ThreadsTableTestHelper.cleanTable();
		await UsersTableTestHelper.cleanTable();
		await RepliesTableTestHelper.cleanTable();

		await pool.end();
	});

	describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
		it('should response 201, persist reply, and correct ownership', async () => {
			// act
			const response = await server.inject({
				method: 'POST',
				url: `/threads/${threadId}/comments/${commentId}/replies`,
				payload,
				headers,
			});

			// assert
			const responseJson = JSON.parse(response.payload);

			expect(response.statusCode).toEqual(201);
			expect(responseJson.status).toEqual('success');

			const { addedReply } = responseJson.data;

			expect(addedReply).toBeDefined();
			expect(addedReply.owner).toEqual(replyCreatorId);
			expect(addedReply.content).toEqual(payload.content);

			const reply = await RepliesTableTestHelper.findReplyById(addedReply.id);
			expect(reply).toBeDefined();
		});

		it('should response 401 when missing authentication', async () => {
			// act
			const respone = await server.inject({
				method: 'POST',
				url: `/threads/${threadId}/comments/${commentId}/replies`,
				payload,
			});

			// assert
			const responseJson = JSON.parse(respone.payload);

			expect(respone.statusCode).toEqual(401);
			expect(responseJson.message).toEqual('Missing authentication');
		});

		it('should response 404 when threadId not found', async () => {
			// act
			const response = await server.inject({
				method: 'POST',
				url: `/threads/thread-xyz/comments/${commentId}/replies`,
				payload,
				headers,
			});

			// assert
			const responseJson = JSON.parse(response.payload);

			expect(response.statusCode).toEqual(404);
			expect(responseJson.status).toEqual('fail');
			expect(responseJson.message).toEqual('thread tidak ditemukan');
		});

		it('should response 404 when commendId not found', async () => {
			// act
			const response = await server.inject({
				method: 'POST',
				url: `/threads/${threadId}/comments/comment-xyz/replies`,
				payload,
				headers,
			});

			// assert
			const responseJson = JSON.parse(response.payload);

			expect(response.statusCode).toEqual(404);
			expect(responseJson.status).toEqual('fail');
			expect(responseJson.message).toEqual('komentar tidak ditemukan');
		});

		it('should response 400 when request payload not contain needed property', async () => {
			// act
			const response = await server.inject({
				method: 'POST',
				url: `/threads/${threadId}/comments/${commentId}/replies`,
				payload: {},
				headers,
			});

			// assert
			const responseJson = JSON.parse(response.payload);

			expect(response.statusCode).toEqual(400);
			expect(responseJson.status).toEqual('fail');
			expect(responseJson.message).toEqual(
				'tidak dapat membuat balasan baru karena properti yang dibutuhkan tidak ada'
			);
		});

		it('should response 400 when request payload not meet data type specification', async () => {
			// act
			const response = await server.inject({
				method: 'POST',
				url: `/threads/${threadId}/comments/${commentId}/replies`,
				payload: { content: 123 },
				headers,
			});

			// assert
			const responseJson = JSON.parse(response.payload);

			expect(response.statusCode).toEqual(400);
			expect(responseJson.status).toEqual('fail');
			expect(responseJson.message).toEqual(
				'tidak dapat membuat balasan baru karena tipe data tidak sesuai'
			);
		});
	});

	describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
		it('should response 200 and delete reply', async () => {
			// arrange
			const replyId = 'reply-123';
			await RepliesTableTestHelper.addReply({
				id: replyId,
				commentId,
				owner: replyCreatorId,
			});

			// act
			const response = await server.inject({
				method: 'DELETE',
				url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
				headers,
			});

			// assert
			const responseJson = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(200);
			expect(responseJson.status).toEqual('success');

			const reply = await RepliesTableTestHelper.findReplyById(replyId);
			expect(reply.is_deleted).toEqual(true);
		});

		it('should response 401 when missing authentication', async () => {
			// arrange
			const replyId = 'reply-456';
			await RepliesTableTestHelper.addReply({
				id: replyId,
				commentId,
				owner: replyCreatorId,
			});

			// act
			const response = await server.inject({
				method: 'DELETE',
				url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
			});

			// assert
			const responseJson = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(401);
			expect(responseJson.message).toEqual('Missing authentication');
		});

		it('should response 404 when threadId not found', async () => {
			// arrange
			const replyId = 'reply-789';
			await RepliesTableTestHelper.addReply({
				id: replyId,
				commentId,
				owner: replyCreatorId,
			});

			// act
			const response = await server.inject({
				method: 'DELETE',
				url: `/threads/thread-999/comments/${commentId}/replies/${replyId}`,
				headers,
			});

			// assert
			const responseJson = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(404);
			expect(responseJson.status).toEqual('fail');
			expect(responseJson.message).toEqual('thread tidak ditemukan');
		});

		it('should response 404 when commentId not found', async () => {
			// arrange
			const replyId = 'reply-abc';
			await RepliesTableTestHelper.addReply({
				id: replyId,
				commentId,
				owner: replyCreatorId,
			});

			// act
			const response = await server.inject({
				method: 'DELETE',
				url: `/threads/${threadId}/comments/comment-999/replies/${replyId}`,
				headers,
			});

			// assert
			const responseJson = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(404);
			expect(responseJson.status).toEqual('fail');
			expect(responseJson.message).toEqual('komentar tidak ditemukan');
		});

		it('should response 404 when replyId not found', async () => {
			// act
			const response = await server.inject({
				method: 'DELETE',
				url: `/threads/${threadId}/comments/${commentId}/replies/reply-999`,
				headers,
			});

			// assert
			const responseJson = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(404);
			expect(responseJson.status).toEqual('fail');
			expect(responseJson.message).toEqual('balasan tidak ditemukan');
		});

		it('should response 403 when user is not the owner of the reply', async () => {
			// arrange
			const replyId = 'reply-def';
			await RepliesTableTestHelper.addReply({
				id: replyId,
				commentId,
				owner: replyCreatorId,
			});

			const anotherUser = await helper.createUserAndLogin(server, {
				username: 'anotherUser',
				password: 'secret',
				fullname: 'another user fullname',
			});

			const anotherUserHeaders = {
				Authorization: `Bearer ${anotherUser.accessToken}`,
			};

			// act
			const response = await server.inject({
				method: 'DELETE',
				url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
				headers: anotherUserHeaders,
			});

			// assert
			const responseJson = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(403);
			expect(responseJson.status).toEqual('fail');
		});
	});
});

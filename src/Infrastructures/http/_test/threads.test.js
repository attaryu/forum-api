const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const helper = require('./helper');

describe('/threads endpoint', () => {
	const threadPayload = {
		title: 'title',
		body: 'body',
	};

	let server;
	let userId;
	let headers;

	beforeAll(async () => {
		server = await createServer(container);

		const creator = await helper.createUserAndLogin(server, {
			username: 'username',
			password: 'secret',
			fullname: 'fullname',
		});

		userId = creator.user.id;

		headers = {
			Authorization: `Bearer ${creator.accessToken}`,
		};
	});

	afterEach(async () => {
		await CommentsTableTestHelper.cleanTable();
		await ThreadsTableTestHelper.cleanTable();
		await RepliesTableTestHelper.cleanTable();
	});

	afterAll(async () => {
		await UsersTableTestHelper.cleanTable();
		await AuthenticationsTableTestHelper.cleanTable();

		await pool.end();
	});

	describe('when POST /threads', () => {
		it('should response 201, persisted thread, and correct ownership', async () => {
			// act
			const response = await server.inject({
				method: 'POST',
				url: '/threads',
				payload: threadPayload,
				headers,
			});

			// assert
			const responseJson = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(201);
			expect(responseJson.status).toEqual('success');

			const { addedThread } = responseJson.data;

			expect(addedThread).toBeDefined();
			expect(addedThread.owner).toEqual(userId);
			expect(addedThread.title).toEqual(threadPayload.title);

			// verify persisted thread
			const threads = await ThreadsTableTestHelper.findThreadById(
				addedThread.id
			);
			expect(threads).toHaveLength(1);
		});

		it('should response 401 when missing authentication', async () => {
			// act
			const response = await server.inject({
				method: 'POST',
				url: '/threads',
				payload: threadPayload,
			});

			// assert
			const responseJson = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(401);
			expect(responseJson.message).toEqual('Missing authentication');
		});

		it('should response 400 when request payload not contain needed property', async () => {
			// arrange
			const invalidThreadPayload = {
				title: 'title',
			};

			// act
			const response = await server.inject({
				method: 'POST',
				url: '/threads',
				payload: invalidThreadPayload,
				headers,
			});

			// assert
			const responseJson = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(400);
			expect(responseJson.status).toEqual('fail');
			expect(responseJson.message).toEqual(
				'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada'
			);
		});

		it('should response 400 when request payload not meet data type specification', async () => {
			// arrange
			const invalidThreadPayload = {
				title: 'title',
				body: 123,
			};

			// act
			const response = await server.inject({
				method: 'POST',
				url: '/threads',
				payload: invalidThreadPayload,
				headers,
			});

			// assert
			const responseJson = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(400);
			expect(responseJson.status).toEqual('fail');
			expect(responseJson.message).toEqual(
				'tidak dapat membuat thread baru karena tipe data tidak sesuai'
			);
		});

		it('should response 400 when request payload title is more than 50 characters', async () => {
			// arrange
			const invalidThreadPayload = {
				title: 'a'.repeat(51),
				body: 'body',
			};

			// act
			const response = await server.inject({
				method: 'POST',
				url: '/threads',
				payload: invalidThreadPayload,
				headers,
			});

			// assert
			const responseJson = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(400);
			expect(responseJson.status).toEqual('fail');
			expect(responseJson.message).toEqual(
				'tidak dapat membuat thread baru karena karakter judul melebihi batas'
			);
		});
	});

	describe('when GET /threads/{threadId}', () => {
		it('should response 200 and return the thread', async () => {
			// arrange
			const threadId = 'thread-123';
			await ThreadsTableTestHelper.addThread({
				id: threadId,
				title: threadPayload.title,
				body: threadPayload.body,
				owner: userId,
			});

			const commentId = 'comment-123';
			await CommentsTableTestHelper.addComment({
				id: commentId,
				threadId,
				owner: userId,
				isDeleted: true,
			});

			const replyId = 'reply-123';
			await RepliesTableTestHelper.addReply({
				id: replyId,
				commentId,
				owner: userId,
				isDeleted: true,
			});

			// act
			const response = await server.inject({
				method: 'GET',
				url: `/threads/${threadId}`,
			});

			// assert
			const responseJson = JSON.parse(response.payload);

			expect(response.statusCode).toEqual(200);
			expect(responseJson.status).toEqual('success');

			const { thread } = responseJson.data;

			expect(thread).toBeDefined();
			expect(thread.id).toEqual(threadId);
			expect(thread.title).toEqual(threadPayload.title);
			expect(thread.body).toEqual(threadPayload.body);
			expect(thread.username).toBeDefined();
			expect(thread.date).toBeDefined();
			expect(thread.comments).toHaveLength(1);

			const {
				comments: [comment],
			} = thread;

			expect(comment.id).toEqual(commentId);
			expect(comment.username).toBeDefined();
			expect(comment.content).toEqual('**komentar telah dihapus**');
			expect(comment.date).toBeDefined();
			expect(comment.replies).toHaveLength(1);

			const {
				replies: [reply],
			} = comment;

			expect(reply.id).toEqual(replyId);
			expect(reply.username).toBeDefined();
			expect(reply.content).toEqual('**balasan telah dihapus**');
			expect(reply.date).toBeDefined();
		});

		it('should response 404 when thread not found', async () => {
			// act
			const response = await server.inject({
				method: 'GET',
				url: '/threads/thread-999',
			});

			// assert
			const responseJson = JSON.parse(response.payload);

			expect(response.statusCode).toEqual(404);
			expect(responseJson.status).toEqual('fail');
			expect(responseJson.message).toEqual('thread tidak ditemukan');
		});
	});
});

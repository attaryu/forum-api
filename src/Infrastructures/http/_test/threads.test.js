const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const helper = require('./helper');

describe('/threads endpoint', () => {
	const threadPayload = {
		title: 'title',
		body: 'body',
	};

	let server;
	let user;
	let headers;

	beforeAll(async () => {
		server = await createServer(container);

		const creator = await helper.createUserAndLogin(server, {
			username: 'username',
			password: 'secret',
			fullname: 'fullname',
		});

		user = creator.user;

		headers = {
			Authorization: `Bearer ${creator.accessToken}`,
		};
	});

	afterEach(async () => {
		await CommentsTableTestHelper.cleanTable();
		await ThreadsTableTestHelper.cleanTable();
	});

	afterAll(async () => {
		await UsersTableTestHelper.cleanTable();
		await AuthenticationsTableTestHelper.cleanTable();

		await pool.end();
	});

	describe('when POST /threads', () => {
		it('should response 201, persisted thread, and correct ownership', async () => {
			// Action
			const response = await server.inject({
				method: 'POST',
				url: '/threads',
				payload: threadPayload,
				headers,
			});

			// Assert
			const responseJson = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(201);
			expect(responseJson.status).toEqual('success');
			expect(responseJson.data.addedThread).toBeDefined();
			expect(responseJson.data.addedThread.owner).toEqual(user.id);
		});

		it('should response 401 when missing authentication', async () => {
			// Action
			const response = await server.inject({
				method: 'POST',
				url: '/threads',
				payload: threadPayload,
			});

			// Assert
			const responseJson = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(401);
			expect(responseJson.message).toEqual('Missing authentication');
		});

		it('should response 400 when request payload not contain needed property', async () => {
			// Arrange
			const invalidThreadPayload = {
				title: 'title',
			};

			// Action
			const response = await server.inject({
				method: 'POST',
				url: '/threads',
				payload: invalidThreadPayload,
				headers,
			});

			// Assert
			const responseJson = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(400);
			expect(responseJson.status).toEqual('fail');
			expect(responseJson.message).toEqual(
				'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada'
			);
		});

		it('should response 400 when request payload not meet data type specification', async () => {
			// Arrange
			const invalidThreadPayload = {
				title: 'title',
				body: 123,
			};

			// Action
			const response = await server.inject({
				method: 'POST',
				url: '/threads',
				payload: invalidThreadPayload,
				headers,
			});

			// Assert
			const responseJson = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(400);
			expect(responseJson.status).toEqual('fail');
			expect(responseJson.message).toEqual(
				'tidak dapat membuat thread baru karena tipe data tidak sesuai'
			);
		});

		it('should response 400 when request payload title is more than 50 characters', async () => {
			// Arrange
			const invalidThreadPayload = {
				title: 'a'.repeat(51),
				body: 'body',
			};

			// Action
			const response = await server.inject({
				method: 'POST',
				url: '/threads',
				payload: invalidThreadPayload,
				headers,
			});

			// Assert
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
			// Arrange
			const threadResponse = await server.inject({
				method: 'POST',
				url: '/threads',
				payload: threadPayload,
				headers,
			});

			const createdThread = JSON.parse(threadResponse.payload).data.addedThread;

			const commentResponse = await server.inject({
				method: 'POST',
				url: `/threads/${createdThread.id}/comments`,
				payload: { content: 'content' },
				headers,
			});

			const createdComment = JSON.parse(commentResponse.payload).data
				.addedComment;

			await server.inject({
				method: 'DELETE',
				url: `/threads/${createdThread.id}/comments/${createdComment.id}`,
				headers,
			});

			// Action
			const response = await server.inject({
				method: 'GET',
				url: `/threads/${createdThread.id}`,
			});

			// Assert
			const responseJson = JSON.parse(response.payload);

			expect(response.statusCode).toEqual(200);
			expect(responseJson.status).toEqual('success');

			const { thread } = responseJson.data;

			expect(thread).toBeDefined();
			expect(thread.id).toEqual(createdThread.id);
			expect(thread.title).toEqual(threadPayload.title);
			expect(thread.body).toEqual(threadPayload.body);
			expect(thread.date).toBeDefined();
			expect(thread.username).toEqual(user.username);
			expect(thread.comments).toHaveLength(1);

			const {
				comments: [comment],
			} = thread;

			expect(comment.id).toEqual(createdComment.id);
			expect(comment.username).toEqual(user.username);
			expect(comment.date).toBeDefined();
			expect(comment.content).toEqual('**komentar telah dihapus**');
		});

		it('should response 404 when thread not found', async () => {
			// Action
			const response = await server.inject({
				method: 'GET',
				url: '/threads/thread-999',
			});

			// Assert
			const responseJson = JSON.parse(response.payload);

			expect(response.statusCode).toEqual(404);
			expect(responseJson.status).toEqual('fail');
			expect(responseJson.message).toEqual('thread tidak ditemukan');
		});
	});
});

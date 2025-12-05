const pool = require('../../database/postgres/pool');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const helper = require('./helper');

describe('/threads/{threadId}/comments endpoint', () => {
	const commentPayload = {
		content: 'content',
	};

	let server;
	let user;
	let thread;
	let headers;

	beforeAll(async () => {
		server = await createServer(container);

		// Create thread creator and thread
		const creator = await helper.createUserAndLogin(server, {
			username: 'creator',
			password: 'secret',
			fullname: 'creator fullname',
		});

		const threadResponse = await server.inject({
			method: 'POST',
			url: '/threads',
			payload: {
				title: 'thread title',
				body: 'thread body',
			},
			headers: {
				Authorization: `Bearer ${creator.accessToken}`,
			},
		});

		thread = JSON.parse(threadResponse.payload).data.addedThread;

		// Create commenter
		const commenter = await helper.createUserAndLogin(server, {
			username: 'commenter',
			password: 'secret',
			fullname: 'commenter fullname',
		});

		user = commenter.user;

		headers = {
			Authorization: `Bearer ${commenter.accessToken}`,
		};
	});

	afterEach(async () => {
		await CommentsTableTestHelper.cleanTable();
	});

	afterAll(async () => {
		await UsersTableTestHelper.cleanTable();
		await AuthenticationsTableTestHelper.cleanTable();
		await ThreadsTableTestHelper.cleanTable();

		await pool.end();
	});

	describe('when POST /threads/{threadId}/comments', () => {
		it('should response 201, persist comment, and correct ownership', async () => {
			// Action
			const response = await server.inject({
				method: 'POST',
				url: `/threads/${thread.id}/comments`,
				payload: commentPayload,
				headers,
			});

			// Assert
			const responseJson = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(201);
			expect(responseJson.status).toEqual('success');
			expect(responseJson.data.addedComment).toBeDefined();
			expect(responseJson.data.addedComment.owner).toEqual(user.id);
		});

		it('should response 401 when missing authentication', async () => {
			// Action
			const response = await server.inject({
				method: 'POST',
				url: `/threads/${thread.id}/comments`,
				payload: commentPayload,
			});

			// Assert
			const responseJson = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(401);
			expect(responseJson.message).toEqual('Missing authentication');
		});

		it('should response 404 when threadId not found', async () => {
			// Act
			const response = await server.inject({
				method: 'POST',
				url: '/threads/thread-999/comments',
				payload: commentPayload,
				headers,
			});

			// Assert
			const responseJson = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(404);
			expect(responseJson.status).toEqual('fail');
			expect(responseJson.message).toEqual('thread tidak ditemukan');
		});

		it('should response 400 when request payload not contain needed property', async () => {
			// Act
			const response = await server.inject({
				method: 'POST',
				url: `/threads/${thread.id}/comments`,
				payload: {},
				headers,
			});

			// Assert
			const responseJson = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(400);
			expect(responseJson.status).toEqual('fail');
			expect(responseJson.message).toEqual(
				'tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada'
			);
		});

		it('should response 400 when request payload not meet data type specification', async () => {
			// Act
			const response = await server.inject({
				method: 'POST',
				url: `/threads/${thread.id}/comments`,
				payload: { content: 1234 },
				headers,
			});

			// Assert
			const responseJson = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(400);
			expect(responseJson.status).toEqual('fail');
			expect(responseJson.message).toEqual(
				'tidak dapat membuat komentar baru karena tipe data tidak sesuai'
			);
		});
	});
});

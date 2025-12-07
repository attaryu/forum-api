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
	let userId;
	let threadId;
	let accessToken;
	let headers;

	beforeAll(async () => {
		server = await createServer(container);

		// Create thread creator and thread
		const creatorId = 'user-123';
		await UsersTableTestHelper.addUser({ id: creatorId });
		await ThreadsTableTestHelper.addThread({
			id: 'thread-123',
			owner: creatorId,
		});
		threadId = 'thread-123';

		// Create commenter
		const commenter = await helper.createUserAndLogin(server, {
			username: 'commenter',
			password: 'secret',
			fullname: 'commenter fullname',
		});

		userId = commenter.user.id;
		accessToken = commenter.accessToken;

		headers = {
			Authorization: `Bearer ${accessToken}`,
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
			// act
			const response = await server.inject({
				method: 'POST',
				url: `/threads/${threadId}/comments`,
				payload: commentPayload,
				headers,
			});

			// assert
			const responseJson = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(201);
			expect(responseJson.status).toEqual('success');

			const { addedComment } = responseJson.data;

			expect(addedComment).toBeDefined();
			expect(addedComment.owner).toEqual(userId);
			expect(addedComment.content).toEqual(commentPayload.content);

			// verify persisted comment
			const comments = await CommentsTableTestHelper.findCommentsById(
				addedComment.id
			);
			expect(comments).toHaveLength(1);
		});

		it('should response 401 when missing authentication', async () => {
			// act
			const response = await server.inject({
				method: 'POST',
				url: `/threads/${threadId}/comments`,
				payload: commentPayload,
			});

			// assert
			const responseJson = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(401);
			expect(responseJson.message).toEqual('Missing authentication');
		});

		it('should response 404 when threadId not found', async () => {
			// act
			const response = await server.inject({
				method: 'POST',
				url: '/threads/thread-999/comments',
				payload: commentPayload,
				headers,
			});

			// assert
			const responseJson = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(404);
			expect(responseJson.status).toEqual('fail');
			expect(responseJson.message).toEqual('thread tidak ditemukan');
		});

		it('should response 400 when request payload not contain needed property', async () => {
			// act
			const response = await server.inject({
				method: 'POST',
				url: `/threads/${threadId}/comments`,
				payload: {},
				headers,
			});

			// assert
			const responseJson = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(400);
			expect(responseJson.status).toEqual('fail');
			expect(responseJson.message).toEqual(
				'tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada'
			);
		});

		it('should response 400 when request payload not meet data type specification', async () => {
			// act
			const response = await server.inject({
				method: 'POST',
				url: `/threads/${threadId}/comments`,
				payload: { content: 1234 },
				headers,
			});

			// assert
			const responseJson = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(400);
			expect(responseJson.status).toEqual('fail');
			expect(responseJson.message).toEqual(
				'tidak dapat membuat komentar baru karena tipe data tidak sesuai'
			);
		});
	});

	describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
		it('should response 200 and delete comment', async () => {
			// arrange
			const commentId = 'comment-123';
			await CommentsTableTestHelper.addComment({
				id: commentId,
				threadId,
				owner: userId,
			});

			// act
			const response = await server.inject({
				method: 'DELETE',
				url: `/threads/${threadId}/comments/${commentId}`,
				headers,
			});

			// assert
			const responseJson = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(200);
			expect(responseJson.status).toEqual('success');

			// verify soft delete
			const comments = await CommentsTableTestHelper.findCommentsById(
				commentId
			);
			expect(comments).toHaveLength(1);
			expect(comments[0].is_deleted).toBe(true);
		});

		it('should response 401 when missing authentication', async () => {
			// arrange
			const commentId = 'comment-456';
			await CommentsTableTestHelper.addComment({
				id: commentId,
				threadId,
				owner: userId,
			});

			// act
			const response = await server.inject({
				method: 'DELETE',
				url: `/threads/${threadId}/comments/${commentId}`,
			});

			// assert
			const responseJson = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(401);
			expect(responseJson.message).toEqual('Missing authentication');
		});

		it('should response 404 when threadId not found', async () => {
			// arrange
			const commentId = 'comment-789';
			await CommentsTableTestHelper.addComment({
				id: commentId,
				threadId,
				owner: userId,
			});

			// act
			const response = await server.inject({
				method: 'DELETE',
				url: `/threads/thread-999/comments/${commentId}`,
				headers,
			});

			// assert
			const responseJson = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(404);
			expect(responseJson.status).toEqual('fail');
			expect(responseJson.message).toEqual('thread tidak ditemukan');
		});

		it('should response 403 when user is not the owner of the comment', async () => {
			// arrange
			const commentId = 'comment-abc';
			await CommentsTableTestHelper.addComment({
				id: commentId,
				threadId,
				owner: userId,
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
				url: `/threads/${threadId}/comments/${commentId}`,
				headers: anotherUserHeaders,
			});

			// assert
			const responseJson = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(403);
			expect(responseJson.status).toEqual('fail');
		});

		it('should response 404 when commentId not found', async () => {
			// act
			const response = await server.inject({
				method: 'DELETE',
				url: `/threads/${threadId}/comments/comment-999`,
				headers,
			});

			// assert
			const responseJson = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(404);
			expect(responseJson.status).toEqual('fail');
			expect(responseJson.message).toEqual('komentar tidak ditemukan');
		});
	});
});

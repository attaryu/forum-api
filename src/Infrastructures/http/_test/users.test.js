const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/users endpoint', () => {
	afterAll(async () => {
		await pool.end();
	});

	afterEach(async () => {
		await UsersTableTestHelper.cleanTable();
	});

	describe('when POST /users', () => {
		it('should response 201 and persisted user', async () => {
			// arrange
			const requestPayload = {
				username: 'dicoding',
				password: 'secret',
				fullname: 'Dicoding Indonesia',
			};
			// eslint-disable-next-line no-undef
			const server = await createServer(container);

			// act
			const response = await server.inject({
				method: 'POST',
				url: '/users',
				payload: requestPayload,
			});

			// assert
			const responseJson = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(201);
			expect(responseJson.status).toEqual('success');

			const { addedUser } = responseJson.data;

			expect(addedUser).toBeDefined();
			expect(addedUser.username).toEqual(requestPayload.username);

			// verify persisted user
			const user = await UsersTableTestHelper.findUsersById(addedUser.id);
			expect(user).toBeDefined();
		});

		it('should response 400 when request payload not contain needed property', async () => {
			// arrange
			const requestPayload = {
				fullname: 'Dicoding Indonesia',
				password: 'secret',
			};
			const server = await createServer(container);

			// act
			const response = await server.inject({
				method: 'POST',
				url: '/users',
				payload: requestPayload,
			});

			// assert
			const responseJson = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(400);
			expect(responseJson.status).toEqual('fail');
			expect(responseJson.message).toEqual(
				'tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'
			);
		});

		it('should response 400 when request payload not meet data type specification', async () => {
			// arrange
			const requestPayload = {
				username: 'dicoding',
				password: 'secret',
				fullname: ['Dicoding Indonesia'],
			};
			const server = await createServer(container);

			// act
			const response = await server.inject({
				method: 'POST',
				url: '/users',
				payload: requestPayload,
			});

			// assert
			const responseJson = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(400);
			expect(responseJson.status).toEqual('fail');
			expect(responseJson.message).toEqual(
				'tidak dapat membuat user baru karena tipe data tidak sesuai'
			);
		});

		it('should response 400 when username more than 50 character', async () => {
			// arrange
			const requestPayload = {
				username: 'dicodingindonesiadicodingindonesiadicodingindonesiadicoding',
				password: 'secret',
				fullname: 'Dicoding Indonesia',
			};
			const server = await createServer(container);

			// act
			const response = await server.inject({
				method: 'POST',
				url: '/users',
				payload: requestPayload,
			});

			// assert
			const responseJson = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(400);
			expect(responseJson.status).toEqual('fail');
			expect(responseJson.message).toEqual(
				'tidak dapat membuat user baru karena karakter username melebihi batas limit'
			);
		});

		it('should response 400 when username contain restricted character', async () => {
			// arrange
			const requestPayload = {
				username: 'dicoding indonesia',
				password: 'secret',
				fullname: 'Dicoding Indonesia',
			};
			const server = await createServer(container);

			// act
			const response = await server.inject({
				method: 'POST',
				url: '/users',
				payload: requestPayload,
			});

			// assert
			const responseJson = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(400);
			expect(responseJson.status).toEqual('fail');
			expect(responseJson.message).toEqual(
				'tidak dapat membuat user baru karena username mengandung karakter terlarang'
			);
		});

		it('should response 400 when username unavailable', async () => {
			// arrange
			await UsersTableTestHelper.addUser({ username: 'dicoding' });
			const requestPayload = {
				username: 'dicoding',
				fullname: 'Dicoding Indonesia',
				password: 'super_secret',
			};
			const server = await createServer(container);

			// act
			const response = await server.inject({
				method: 'POST',
				url: '/users',
				payload: requestPayload,
			});

			// assert
			const responseJson = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(400);
			expect(responseJson.status).toEqual('fail');
			expect(responseJson.message).toEqual('username tidak tersedia');
		});
	});
});

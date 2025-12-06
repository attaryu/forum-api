const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepository postgres', () => {
	// arrange
	const userId = 'user-123';

	const threadPayload = new NewThread({
		title: 'sebuah thread',
		body: 'sebuah body thread',
	});

	const fakeIdGenerator = () => '123';
	const threadRepositoryPostgres = new ThreadRepositoryPostgres(
		pool,
		fakeIdGenerator
	);

	beforeAll(async () => {
		await UsersTableTestHelper.addUser({
			id: userId,
			fullname: 'fullname',
			username: 'username',
			password: 'password',
		});
	});

	afterEach(async () => {
		await ThreadsTableTestHelper.cleanTable();
	});

	afterAll(async () => {
		await UsersTableTestHelper.cleanTable();
		await pool.end();
	});

	describe('addThread function', () => {
		it('should persist added thread and return added thread correctly', async () => {
			// act
			await threadRepositoryPostgres.addThread(threadPayload, userId);

			// assert
			const thread = await ThreadsTableTestHelper.findThreadById('thread-123');
			expect(thread).toHaveLength(1);
		});

		it('should return added thread correctly', async () => {
			// act
			const addedThread = await threadRepositoryPostgres.addThread(
				threadPayload,
				userId
			);

			// assert
			expect(addedThread).toStrictEqual(
				new AddedThread({
					id: 'thread-123',
					title: threadPayload.title,
					owner: userId,
				})
			);
		});
	});

	describe('verifyThreadExist function', () => {
		it('should throw NotFoundError when thread not found', async () => {
			// act & assert
			await expect(
				threadRepositoryPostgres.verifyThreadExist('thread-123')
			).rejects.toThrowError(NotFoundError);
		});

		it('should not throw NotFoundError when thread is found', async () => {
			// arrange
			const id = 'thread-123';

			await ThreadsTableTestHelper.addThread({
				...threadPayload,
				id,
				owner: userId,
			});

			// act & assert
			await expect(
				threadRepositoryPostgres.verifyThreadExist(id)
			).resolves.not.toThrowError(NotFoundError);
		});
	});
});

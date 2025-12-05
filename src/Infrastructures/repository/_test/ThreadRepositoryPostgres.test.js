const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');

describe('ThreadRepository postgres', () => {
	// arrange
	let userId = 'users-123';

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

		userId = await UsersTableTestHelper.findUsersById(userId).then(
			(rows) => rows[0].id
		);
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
			// Action
			await threadRepositoryPostgres.addThread(threadPayload, userId);

			// Assert
			const thread = await ThreadsTableTestHelper.findThreadById('thread-123');
			expect(thread).toHaveLength(1);
		});

		it('should return added thread correctly', async () => {
			// Action
			const addedThread = await threadRepositoryPostgres.addThread(
				threadPayload,
				userId
			);

			// Assert
			expect(addedThread).toStrictEqual(
				new AddedThread({
					id: 'thread-123',
					title: threadPayload.title,
					owner: userId,
				})
			);
		});
	});
});

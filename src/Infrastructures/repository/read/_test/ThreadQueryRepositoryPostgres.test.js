const ThreadQueryRepositoryPostgres = require('../ThreadQueryRepositoryPostgres');
const ThreadsTableTestHelper = require('../../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../../tests/UsersTableTestHelper');
const pool = require('../../../database/postgres/pool');
const NotFoundError = require('../../../../Commons/exceptions/NotFoundError');

describe('ThreadQueryRepository postgres', () => {
	const threadId = 'thread-123';
	const threadQueryRepositoryPostgres = new ThreadQueryRepositoryPostgres(pool);

	beforeAll(async () => {
		const userId = 'user-123';

		await UsersTableTestHelper.addUser({ id: userId });
		await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
	});

	afterAll(async () => {
		await ThreadsTableTestHelper.cleanTable();
		await UsersTableTestHelper.cleanTable();

		await pool.end();
	});

	describe('getThreadById function', () => {
		it('should return thread correctly', async () => {
			// act
			const thread = await threadQueryRepositoryPostgres.getThreadById(
				threadId
			);

			// assert
			expect(thread).toBeDefined();
			expect(thread.id).toEqual(threadId);
			expect(thread.title).toBeDefined();
			expect(thread.body).toBeDefined();
			expect(thread.date).toBeDefined();
			expect(thread.username).toBeDefined();
		});

		it('should throw NotFoundError when thread not found', async () => {
			// act & assert
			await expect(
				threadQueryRepositoryPostgres.getThreadById('thread-999')
			).rejects.toThrowError(NotFoundError);
		});
	});
});

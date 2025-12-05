const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const AddedThread = require('../../Domains/threads/entities/AddedThread');

class ThreadRepositoryPostgres extends ThreadRepository {
	constructor(pool, idGenerator) {
		super();

		this._pool = pool;
		this._idGenerator = idGenerator;
	}

	async addThread(newThread, ownerId) {
		const { title, body } = newThread;
		const id = `thread-${this._idGenerator()}`;

		const result = await this._pool.query({
			text: 'INSERT INTO threads (id, title, body, date, owner) VALUES ($1, $2, $3, $4, $5) RETURNING id, title, owner',
			values: [id, title, body, new Date().toISOString(), ownerId],
		});

		return new AddedThread({ ...result.rows[0] });
	}
}

module.exports = ThreadRepositoryPostgres;

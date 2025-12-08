const ThreadQueryRepository = require('../../../Domains/threads/ThreadQueryRepository');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');

class ThreadQueryRepositoryPostgres extends ThreadQueryRepository {
	constructor(pool) {
		super();

		this._pool = pool;
	}

	async getThreadById(threadId) {
		const result = await this._pool.query({
			text: `
        SELECT t.id, t.title, t.body, t.date, u.username
				FROM threads t
					INNER JOIN users u ON t.owner = u.id
				WHERE t.id = $1
      `,
			values: [threadId],
		});

		if (!result.rowCount) {
			throw new NotFoundError('thread tidak ditemukan');
		}

		return new ThreadDetail({ ...result.rows[0] });
	}
}

module.exports = ThreadQueryRepositoryPostgres;

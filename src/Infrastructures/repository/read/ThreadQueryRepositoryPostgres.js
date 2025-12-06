const ThreadQueryRepository = require('../../../Domains/threads/ThreadQueryRepository');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

class ThreadQueryRepositoryPostgres extends ThreadQueryRepository {
	constructor(pool) {
		super();

		this._pool = pool;
	}

	async getThreadById(threadId) {
		// get thread, comment, creator, and commenter
		const result = await this._pool.query({
			text: `
        SELECT
          threads.id AS thread_id,
          threads.title AS thread_title,
          threads.body AS thread_body,
          threads.date AS thread_date,
          owner.username AS thread_owner_username,
          thread_comments.id AS comment_id,
          thread_comments.content AS comment_content,
          thread_comments.date AS comment_date,
          thread_comments.is_delete AS comment_is_deleted,
          commenter.username AS comment_owner_username
        FROM threads
          LEFT JOIN users AS owner ON threads.owner = owner.id
          LEFT JOIN thread_comments ON thread_comments.thread_id = threads.id
          LEFT JOIN users AS commenter ON thread_comments.owner = commenter.id
        WHERE threads.id = $1
        ORDER BY thread_comments.date ASC
      `,
			values: [threadId],
		});

		if (!result.rowCount) {
			throw new NotFoundError('THREAD.NOT_FOUND');
		}

		const thread = result.rows[0];

		const threadData = {
			id: thread.thread_id,
			title: thread.thread_title,
			body: thread.thread_body,
			date: thread.thread_date,
			username: thread.thread_owner_username,
			comments: result.rows
				.map((row) => ({
					id: row.comment_id,
					content: row.comment_is_deleted
						? '**komentar telah dihapus**'
						: row.comment_content,
					date: row.comment_date,
					username: row.comment_owner_username,
				}))
				.filter((comment) => comment.id !== null),
		};

		return threadData;
	}
}

module.exports = ThreadQueryRepositoryPostgres;

const ThreadQueryRepository = require('../../../Domains/threads/ThreadQueryRepository');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

class ThreadQueryRepositoryPostgres extends ThreadQueryRepository {
	constructor(pool) {
		super();

		this._pool = pool;
	}

	async getThreadById(threadId) {
		const threadResult = await this._pool.query({
			text: `
        SELECT t.id, t.title, t.body, t.date, u.username
				FROM threads t
					INNER JOIN users u ON t.owner = u.id
				WHERE t.id = $1
      `,
			values: [threadId],
		});

		if (!threadResult.rowCount) {
			throw new NotFoundError('THREAD.NOT_FOUND');
		}

		const [thread] = threadResult.rows;

		const commentsResult = await this._pool.query({
			text: `
				SELECT tc.id, tc.content, tc.date, tc.is_deleted, u.username
				FROM thread_comments tc
					INNER JOIN users u ON tc.owner = u.id
				WHERE tc.thread_id = $1
				ORDER BY tc.date ASC
			`,
			values: [threadId],
		});

		const repliesResult = await this._pool.query({
			text: `
				SELECT r.id, r.content, r.date, r.is_deleted, r.comment_id, u.username
				FROM comment_replies r
					INNER JOIN users u ON r.owner = u.id
					INNER JOIN thread_comments tc ON r.comment_id = tc.id
				WHERE tc.thread_id = $1
				ORDER BY r.date ASC
			`,
			values: [threadId],
		});

		const comments = commentsResult.rows.map((comment) => ({
			id: comment.id,
			content: comment.is_deleted
				? '**komentar telah dihapus**'
				: comment.content,
			date: comment.date,
			username: comment.username,
			replies: repliesResult.rows
				.filter((reply) => reply.comment_id === comment.id)
				.map((reply) => ({
					id: reply.id,
					content: reply.is_deleted
						? '**balasan telah dihapus**'
						: reply.content,
					date: reply.date,
					username: reply.username,
				})),
		}));

		return {
			id: thread.id,
			title: thread.title,
			body: thread.body,
			date: thread.date,
			username: thread.username,
			comments,
		};
	}
}

module.exports = ThreadQueryRepositoryPostgres;

const ReplyDetail = require('../../../Domains/replies/entities/ReplyDetail');
const ReplyQueryRepository = require('../../../Domains/replies/ReplyQueryRepository');

class ReplyQueryRepositoryPostgres extends ReplyQueryRepository {
	constructor(pool) {
		super();

		this._pool = pool;
	}

	async getRepliesByThreadId(threadId) {
		const result = await this._pool.query({
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

		return result.rows.map(
			(row) =>
				new ReplyDetail({
					id: row.id,
					username: row.username,
					date: row.date,
					content: row.content,
					isDeleted: row.is_deleted,
					commentId: row.comment_id,
				})
		);
	}
}

module.exports = ReplyQueryRepositoryPostgres;

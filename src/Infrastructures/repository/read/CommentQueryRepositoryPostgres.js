const CommentQueryRepository = require('../../../Domains/comments/CommentQueryRepository');
const CommentDetail = require('../../../Domains/comments/entities/CommentDetail');

class CommentQueryRepositoryPostgres extends CommentQueryRepository {
	constructor(pool) {
		super();

		this._pool = pool;
	}

	async getCommentsByThreadId(threadId) {
		const result = await this._pool.query({
			text: `
				SELECT tc.id, tc.content, tc.date, tc.is_deleted, u.username
				FROM thread_comments tc
					INNER JOIN users u ON tc.owner = u.id
				WHERE tc.thread_id = $1
				ORDER BY tc.date ASC
			`,
			values: [threadId],
		});

		return result.rows.map(
			(comment) =>
				new CommentDetail({
					id: comment.id,
					content: comment.content,
					date: comment.date,
					isDeleted: comment.is_deleted,
					username: comment.username,
				})
		);
	}
}

module.exports = CommentQueryRepositoryPostgres;

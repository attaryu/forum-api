const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');

class CommentRepositoryPostgres extends CommentRepository {
	constructor(pool, idGenerator) {
		super();

		this._pool = pool;
		this._idGenerator = idGenerator;
	}

	async addComment(content, threadId, ownerId) {
		const result = await this._pool.query({
			text: 'INSERT INTO thread_comments (id, content, thread_id, date, owner) VALUES ($1, $2, $3, $4, $5) RETURNING id, content, owner',
			values: [
				`comment-${this._idGenerator()}`,
				content,
				threadId,
				new Date().toISOString(),
				ownerId,
			],
		});

		return new AddedComment({ ...result.rows[0] });
	}
}

module.exports = CommentRepositoryPostgres;

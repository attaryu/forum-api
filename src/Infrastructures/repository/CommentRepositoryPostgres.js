const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

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

	async deleteComment(commentId) {
		await this._pool.query({
			text: "UPDATE thread_comments SET is_delete = true, content = '**komentar telah dihapus**' WHERE id = $1",
			values: [commentId],
		});
	}

	async verifyComment(commentId, ownerId) {
		const result = await this._pool.query({
			text: 'SELECT owner FROM thread_comments WHERE id = $1',
			values: [commentId],
		});

		if (!result.rowCount) {
			throw new NotFoundError('COMMENT.NOT_FOUND');
		}

		const comment = result.rows[0];

		if (comment.owner !== ownerId) {
			throw new AuthorizationError('COMMENT.AUTHORIZATION_ERROR');
		}
	}
}

module.exports = CommentRepositoryPostgres;

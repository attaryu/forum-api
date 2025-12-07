const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

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

	async deleteComment(threadId, commentId) {
		await this._pool.query({
			text: 'UPDATE thread_comments SET is_deleted = true WHERE id = $1 AND thread_id = $2',
			values: [commentId, threadId],
		});
	}

	async verifyCommentExist(threadId, commentId) {
		const result = await this._pool.query({
			text: 'SELECT id FROM thread_comments WHERE id = $1 AND thread_id = $2',
			values: [commentId, threadId],
		});

		if (!result.rowCount) {
			throw new NotFoundError('COMMENT.NOT_FOUND');
		}
	}

	async verifyCommentOwner(commentId, ownerId) {
		const result = await this._pool.query({
			text: 'SELECT owner FROM thread_comments WHERE id = $1',
			values: [commentId],
		});

		const [comment] = result.rows;

		if (comment.owner !== ownerId) {
			throw new AuthorizationError('COMMENT.AUTHORIZATION_ERROR');
		}
	}
}

module.exports = CommentRepositoryPostgres;

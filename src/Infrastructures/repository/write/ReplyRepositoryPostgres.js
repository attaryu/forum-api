const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

class ReplyRepositoryPostgres extends ReplyRepository {
	constructor(pool, idGenerator) {
		super();

		this._pool = pool;
		this._idGenerator = idGenerator;
	}

	async addReply(content, commentId, owner) {
		const result = await this._pool.query({
			text: 'INSERT INTO comment_replies (id, content, comment_id, date, owner) VALUES ($1, $2, $3, $4, $5) RETURNING id, content, owner',
			values: [
				`reply-${this._idGenerator()}`,
				content,
				commentId,
				new Date().toISOString(),
				owner,
			],
		});

		return new AddedReply({ ...result.rows[0] });
	}

	async deleteReply(commentId, replyId) {
		await this._pool.query({
			text: 'UPDATE comment_replies SET is_deleted = true WHERE comment_id = $1 AND id = $2',
			values: [commentId, replyId],
		});
	}

	async verifyReplyExist(commentId, replyId) {
		const result = await this._pool.query({
			text: 'SELECT id FROM comment_replies WHERE comment_id = $1 AND id = $2',
			values: [commentId, replyId],
		});

		if (!result.rowCount) {
			throw new NotFoundError('REPLY.NOT_FOUND');
		}
	}

	async verifyReplyOwner(replyId, userId) {
		const result = await this._pool.query({
			text: 'SELECT owner FROM comment_replies WHERE id = $1',
			values: [replyId],
		});

		const reply = result.rows[0];

		if (reply.owner !== userId) {
			throw new AuthorizationError('REPLY.NOT_OWNER');
		}
	}
}

module.exports = ReplyRepositoryPostgres;

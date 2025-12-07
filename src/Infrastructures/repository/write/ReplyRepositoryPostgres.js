const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');

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
}

module.exports = ReplyRepositoryPostgres;

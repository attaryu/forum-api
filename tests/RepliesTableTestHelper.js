/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
	async addReply({
		id = `reply-${Date.now()}`,
		content = 'content',
		isDeleted = false,
		commentId,
		owner,
	}) {
		await pool.query({
			text: 'INSERT INTO comment_replies (id, content, comment_id, date, is_deleted, owner) VALUES ($1, $2, $3, $4, $5, $6)',
			values: [
				id,
				content,
				commentId,
				new Date().toISOString(),
				isDeleted,
				owner,
			],
		});
	},

	async findReplyById(id) {
		const result = await pool.query({
			text: 'SELECT * FROM comment_replies WHERE id = $1',
			values: [id],
		});

		return result.rows[0];
	},

	async cleanTable() {
		await pool.query('DELETE FROM comment_replies WHERE 1=1');
	},
};

module.exports = RepliesTableTestHelper;

const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
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

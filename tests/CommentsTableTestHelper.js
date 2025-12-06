/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
	async addComment({
		id = `comment-${Date.now()}`,
		content = 'content',
		isDelete = false,
		threadId,
		owner,
	}) {
		await pool.query({
			text: 'INSERT INTO thread_comments (id, content, thread_id, date, is_deleted, owner) VALUES ($1, $2, $3, $4, $5, $6)',
			values: [
				id,
				content,
				threadId,
				new Date().toISOString(),
				isDelete,
				owner,
			],
		});
	},

	async findCommentsById(id) {
		const result = await pool.query({
			text: 'SELECT * FROM thread_comments WHERE id = $1',
			values: [id],
		});

		return result.rows;
	},

	async cleanTable() {
		await pool.query('DELETE FROM thread_comments WHERE 1=1');
	},
};

module.exports = CommentsTableTestHelper;

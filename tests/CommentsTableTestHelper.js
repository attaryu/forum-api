/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
	async addComment({
		id = `comment-${Date.now()}`,
		content = 'content',
		isDeleted = false,
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
				isDeleted,
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

	async likeComment({ commentId, userId }) {
		await pool.query({
			text: 'INSERT INTO like_comments (id, comment_id, user_id) VALUES ($1, $2, $3)',
			values: [Date.now(), commentId, userId],
		});
	},

	async unlikeComment({ commentId, userId }) {
		await pool.query({
			text: 'DELETE FROM like_comments WHERE comment_id = $1 AND user_id = $2',
			values: [commentId, userId],
		});
	},

	async findLikeComment(commentId, userId) {
		const result = await pool.query({
			text: 'SELECT * FROM like_comments WHERE comment_id = $1 AND user_id = $2',
			values: [commentId, userId],
		});

		return result.rows;
	},

	async cleanTable() {
		await pool.query('DELETE FROM thread_comments WHERE 1=1');
		await pool.query('DELETE FROM like_comments WHERE 1=1');
	},
};

module.exports = CommentsTableTestHelper;

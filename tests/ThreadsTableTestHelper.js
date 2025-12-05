/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
	async findThreadById(id) {
		const result = await pool.query({
			text: 'SELECT * FROM threads WHERE id = $1',
			values: [id],
		});

		return result.rows;
	},

	async cleanTable() {
		await pool.query('DELETE FROM threads WHERE 1=1');
	},
};

module.exports = ThreadsTableTestHelper;

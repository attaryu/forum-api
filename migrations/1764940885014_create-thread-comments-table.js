/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
	pgm.createTable('thread_comments', {
		id: {
			type: 'VARCHAR(50)',
			primaryKey: true,
		},
		thread_id: {
			type: 'VARCHAR(50)',
			notNull: true,
		},
		date: {
			type: 'TIMESTAMP',
			notNull: true,
		},
		owner: {
			type: 'VARCHAR(50)',
			notNull: true,
		},
		content: {
			type: 'TEXT',
			notNull: true,
		},
	});

	pgm.addConstraint(
		'thread_comments',
		'fk_thread_comments.thread_id_threads.id',
		{
			foreignKeys: {
				columns: 'thread_id',
				references: 'threads(id)',
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			},
		}
	);

	pgm.addConstraint('thread_comments', 'fk_thread_comments.owner_users.id', {
		foreignKeys: {
			columns: 'owner',
			references: 'users(id)',
			onDelete: 'CASCADE',
			onUpdate: 'CASCADE',
		},
	});
};

exports.down = (pgm) => {
	pgm.dropTable('thread_comments');
};

exports.up = (pgm) => {
	pgm.createTable('comment_replies', {
		id: {
			type: 'VARCHAR(50)',
			primaryKey: true,
		},
		comment_id: {
			type: 'VARCHAR(50)',
			notNull: true,
		},
		content: {
			type: 'TEXT',
			notNull: true,
		},
		owner: {
			type: 'VARCHAR(50)',
			notNull: true,
		},
		date: {
			type: 'TIMESTAMP',
			notNull: true,
		},
		is_deleted: {
			type: 'BOOLEAN',
			notNull: true,
			default: false,
		},
	});

	pgm.addConstraint(
		'comment_replies',
		'fk_comment_replies.comment_id_thread_comments.id',
		{
			foreignKeys: {
				columns: 'comment_id',
				references: 'thread_comments(id)',
				onDelete: 'CASCADE',
			},
		}
	);

	pgm.addConstraint('comment_replies', 'fk_comment_replies.owner_users.id', {
		foreignKeys: {
			columns: 'owner',
			references: 'users(id)',
			onDelete: 'CASCADE',
		},
	});
};

exports.down = (pgm) => {
	pgm.dropTable('comment_replies');
};

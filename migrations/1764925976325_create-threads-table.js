exports.up = (pgm) => {
	pgm.createTable('threads', {
		id: {
			type: 'VARCHAR(50)',
			primaryKey: true,
		},
		title: {
			type: 'VARCHAR(255)',
			notNull: true,
		},
		body: {
			type: 'TEXT',
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
	});

	pgm.addConstraint('threads', 'fk_threads.owner_users.id', {
		foreignKeys: {
			columns: 'owner',
			references: 'users(id)',
			onDelete: 'CASCADE',
			onUpdate: 'CASCADE',
		},
	});
};

exports.down = (pgm) => {
	pgm.dropTable('threads');
};

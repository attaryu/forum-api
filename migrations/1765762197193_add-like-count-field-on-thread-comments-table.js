exports.up = (pgm) => {
	pgm.addColumn('thread_comments', {
		like_count: {
			type: 'INTEGER',
			notNull: true,
			default: 0,
		},
	});
};

exports.down = (pgm) => {
	pgm.dropColumn('thread_comments', 'like_count');
};

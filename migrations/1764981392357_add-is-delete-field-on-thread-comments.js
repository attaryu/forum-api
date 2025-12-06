/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
	pgm.addColumn('thread_comments', {
		is_deleted: {
			type: 'BOOLEAN',
			notNull: true,
			default: false,
		},
	});
};

exports.down = (pgm) => {
	pgm.dropColumn('thread_comments', 'is_deleted');
};

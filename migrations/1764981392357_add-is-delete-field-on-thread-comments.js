/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
	pgm.addColumn('thread_comments', {
		is_delete: {
			type: 'BOOLEAN',
			notNull: true,
			default: false,
		},
	});
};

exports.down = (pgm) => {
	pgm.dropColumn('thread_comments', 'is_delete');
};

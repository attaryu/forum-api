/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
	pgm.createTable('like_comments', {
		id: {
			type: 'VARCHAR(50)',
			primaryKey: true,
		},
		comment_id: {
			type: 'VARCHAR(50)',
			notNull: true,
		},
		user_id: {
			type: 'VARCHAR(50)',
			notNull: true,
		},
	});

	pgm.addConstraint(
		'like_comments',
		'unique_user_like_per_comment',
		'UNIQUE(comment_id, user_id)'
	);

	pgm.addConstraint(
		'like_comments',
		'fk_like_comments.comment_id_comments.id',
		{
			foreignKeys: {
				columns: 'comment_id',
				references: 'thread_comments(id)',
				onDelete: 'CASCADE',
			},
		}
	);

	pgm.addConstraint('like_comments', 'fk_like_comments.user_id_users.id', {
		foreignKeys: {
			columns: 'user_id',
			references: 'users(id)',
			onDelete: 'CASCADE',
		},
	});

	pgm.createFunction(
		'after_insert_like_comment',
		[],
		{ returns: 'TRIGGER', language: 'plpgsql' },
		`BEGIN
			UPDATE thread_comments SET like_count = like_count + 1 WHERE id = NEW.comment_id;
			RETURN NEW;
		END;`
	);

	pgm.createTrigger('like_comments', 'after_insert_like_comment', {
		when: 'AFTER',
		operation: 'INSERT',
		function: 'after_insert_like_comment',
		level: 'ROW',
	});

	pgm.createFunction(
		'after_delete_like_comment',
		[],
		{ returns: 'TRIGGER', language: 'plpgsql' },
		`DECLARE
			lineCount INTEGER;
		BEGIN
			SELECT like_count INTO lineCount FROM thread_comments WHERE id = OLD.comment_id;
		
			IF lineCount > 0 THEN
				UPDATE thread_comments SET like_count = like_count - 1 WHERE id = OLD.comment_id;
			END IF;
			
			RETURN OLD;
		END;`
	);

	pgm.createTrigger('like_comments', 'after_delete_like_comment', {
		when: 'AFTER',
		operation: 'DELETE',
		function: 'after_delete_like_comment',
		level: 'ROW',
	});
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
	pgm.dropTrigger('like_comments', 'after_delete_like_comment');
	pgm.dropFunction('after_delete_like_comment');

	pgm.dropTrigger('like_comments', 'after_insert_like_comment');
	pgm.dropFunction('after_insert_like_comment');

	pgm.dropTable('like_comments');
};

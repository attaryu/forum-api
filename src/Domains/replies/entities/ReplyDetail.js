class ReplyDetail {
	constructor(payload) {
		this._verifyPayload(payload);

		const { id, username, date, content, isDeleted, commentId } = payload;

		this.id = id;
		this.username = username;
		this.date = date;
		this.content = isDeleted ? '**balasan telah dihapus**' : content;
		this.commentId = commentId;
	}

	_verifyPayload({ id, username, date, content, isDeleted, commentId }) {
		if (!id || !username || !date || !content || isDeleted === undefined || !commentId) {
			throw new Error('REPLY_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
		}

		if (
			typeof id !== 'string' ||
			typeof username !== 'string' ||
			(typeof date !== 'string' && !(date instanceof Date)) ||
			typeof content !== 'string' ||
			typeof isDeleted !== 'boolean' ||
			typeof commentId !== 'string'
		) {
			throw new Error('REPLY_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
		}
	}
}

module.exports = ReplyDetail;

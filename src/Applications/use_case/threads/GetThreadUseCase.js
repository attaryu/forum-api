class GetThreadUseCase {
	constructor({
		threadQueryRepository,
		commentQueryRepository,
		replyQueryRepository,
	}) {
		this._threadQueryRepository = threadQueryRepository;
		this._commentQueryRepository = commentQueryRepository;
		this._replyQueryRepository = replyQueryRepository;
	}

	async execute(threadId) {
		const thread = await this._threadQueryRepository.getThreadById(threadId);
		const comments = await this._commentQueryRepository.getCommentsByThreadId(
			threadId
		);
		const replies = await this._replyQueryRepository.getRepliesByThreadId(
			threadId
		);

		const commentsWithReplies = comments.map((comment) => {
			const commentReplies = replies
				.filter((reply) => reply.commentId === comment.id)
				.map(({ commentId, ...reply }) => reply);

			return {
				...comment,
				replies: commentReplies,
			};
		});

		return {
			...thread,
			comments: commentsWithReplies,
		};
	}
}

module.exports = GetThreadUseCase;

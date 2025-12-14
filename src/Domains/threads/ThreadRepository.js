class ThreadRepository {
	async addThread(newThread, ownerId) {
		newThread;
		ownerId;

		throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}

	async verifyThreadExist(threadId) {
		threadId;
		throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}
}

module.exports = ThreadRepository;

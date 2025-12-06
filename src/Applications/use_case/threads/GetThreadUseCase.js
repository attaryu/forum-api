class GetThreadUseCase {
	constructor({ threadQueryRepository }) {
		this._threadQueryRepository = threadQueryRepository;
	}

	async execute(threadId) {
		return this._threadQueryRepository.getThreadById(threadId);
	}
}

module.exports = GetThreadUseCase;

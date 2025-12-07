const NewThread = require('../../../Domains/threads/entities/NewThread');

class AddThreadUseCase {
	constructor({ threadRepository }) {
		this._threadRepository = threadRepository;
	}

	async execute(useCasePayload, userId) {
		return this._threadRepository.addThread(
			new NewThread(useCasePayload),
			userId
		);
	}
}

module.exports = AddThreadUseCase;

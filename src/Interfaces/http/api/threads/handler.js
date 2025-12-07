const AddThreadUseCase = require('../../../../Applications/use_case/threads/AddThreadUseCase');
const GetThreadUseCase = require('../../../../Applications/use_case/threads/GetThreadUseCase');

class ThreadsHandler {
	constructor(container) {
		this._container = container;

		this.postThreadHandler = this.postThreadHandler.bind(this);
		this.getThreadHandler = this.getThreadHandler.bind(this);
	}

	async postThreadHandler(request, h) {
		const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);

		const addedThread = await addThreadUseCase.execute(
			request.payload,
			request.auth.credentials.userId
		);

		return h
			.response({
				status: 'success',
				data: { addedThread },
			})
			.code(201);
	}

	async getThreadHandler(request, h) {
		const getThreadUseCase = this._container.getInstance(GetThreadUseCase.name);

		const thread = await getThreadUseCase.execute(request.params.threadId);

		return h
			.response({
				status: 'success',
				data: { thread },
			})
			.code(200);
	}
}

module.exports = ThreadsHandler;

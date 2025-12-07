/* istanbul ignore file */

module.exports = {
	async createUserAndLogin(
		server,
		{ username, password, fullname } = {
			username: `username_${Date.now()}`,
			password: 'secret',
			fullname: 'fullname',
		}
	) {
		const userResponse = await server.inject({
			method: 'POST',
			url: '/users',
			payload: { username, password, fullname },
		});

		const {
			data: { addedUser: user },
		} = JSON.parse(userResponse.payload);

		const loginResponse = await server.inject({
			method: 'POST',
			url: '/authentications',
			payload: { username, password },
		});

		const {
			data: { accessToken },
		} = JSON.parse(loginResponse.payload);

		return {
			accessToken,
			user,
		};
	},
};

/* istanbul ignore file */

module.exports = {
	async createUserAndLogin(server, { username, password, fullname }) {
		const userResponse = await server.inject({
			method: 'POST',
			url: '/users',
			payload: { username, password, fullname },
		});

		const loginResponse = await server.inject({
			method: 'POST',
			url: '/authentications',
			payload: { username, password },
		});

		const { data } = JSON.parse(loginResponse.payload);
		const { data: userData } = JSON.parse(userResponse.payload);

		return {
			accessToken: data.accessToken,
			user: userData.addedUser,
		};
	},
};

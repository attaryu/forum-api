class UserRepository {
  async addUser(registerUser) {
    registerUser;
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
  
  async verifyAvailableUsername(username) {
    username;
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
  
  async getPasswordByUsername(username) {
    username;
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
  
  async getIdByUsername(username) {
    username;
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = UserRepository;

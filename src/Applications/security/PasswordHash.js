class PasswordHash {
  async hash(password) {
    password;
    throw new Error('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
  }
  
  async comparePassword(plain, encrypted) {
    plain;
    encrypted;
    throw new Error('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = PasswordHash;

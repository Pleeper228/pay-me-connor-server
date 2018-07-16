const connection = require('./connection');

module.exports = {
  getUserById(id) {
    return connection('users').where('id', id).first()
  },
  findUserByEmail(email) {
    return connection('users').where('email', email).first();
  },
  createUser(user) {
    return connection('users').insert(user, '*');
  },
  updateUser(id, user) {
    return connection('users').where('id', id).update(user, '*');
  },
  deleteUser(id) {
    return connection('users').where('id', id).del()
  }
}

const connection = require('./connection');

module.exports = {
  getHouseById(id) {
    return connection('houses').where('id', id).first()
  },
  findHouseByUserId(user_id) {
    return connection.select('houses.*').from('houses').innerJoin('users', 'houses.id', 'users.house_id').where('users.id', user_id)
  },
  createHouse(house) {
    return connection('houses').insert(house, '*');
  },
  updateHouse(id, house) {
    return connection('houses').where('id', id).update(house, '*');
  },
  deleteHouse(id) {
    return connection('houses').where('id', id).del()
  }
}

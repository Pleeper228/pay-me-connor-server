const connection = require('./connection');

module.exports = {
  getRoommateById(id) {
    return connection('roommates').where('id', id).first()
  },
  findRoommatesByHouseId(house_id) {
    return connection.select('roommates.*').from('roommates').innerJoin('houses', 'roommates.house_id', 'houses.id').where('houses.id', house_id)
  },
  createRoommate(roommate) {
    return connection('roommates').insert(roommate, '*');
  },
  updateRoommate(id, roommate) {
    return connection('roommates').where('id', id).update(roommate, '*');
  },
  deleteRoommate(id) {
    return connection('roommates').where('id', id).del()
  }
}

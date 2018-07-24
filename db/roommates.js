const connection = require('./connection');
const paymentsDB = require('./payments')

function addPaymentsToRoommates(roommates) {
  let roommate_ids = roommates.map(roommate => {
    return roommate.id
  })
  return paymentsDB.findAllRoommatePayments(roommate_ids).then(payments => {
    return roommates.map(roommate => {
      roommate.payments = []
      roommate.amount_paid = 0
      payments.forEach(payment => {
        if (payment.roommate_id === roommate.id) {
          roommate.payments.push(payment)
          roommate.amount_paid += payment.amount
        }
      })
      return roommate
    })
  })
}

module.exports = {
  getRoommateById(id) {
    return connection('roommates').where('id', id).first()
  },
  findRoommatesByHouseId(house_id) {
    return connection.select('roommates.*').from('roommates').where('roommates.house_id', house_id).then(roommates => addPaymentsToRoommates(roommates))
  },
  createRoommate(roommate) {
    return connection('roommates').insert(roommate, '*').then(roommate => roommate[0]);
  },
  addRoommateToHouse(roommateName, house_id) {
    let roommate = {
      name: roommateName,
      house_id: house_id
    }
    return this.createRoommate(roommate)
  },
  updateRoommate(id, roommate) {
    return connection('roommates').where('id', id).update(roommate, '*');
  },
  deleteRoommate(id) {
    return connection('roommates').where('id', id).del()
  }
}

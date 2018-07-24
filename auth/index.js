const roommatesDB = require('../db/roommates')
const billsDB = require('../db/bills')

module.exports = {
  isRoommateInHouse(roommate_id, house_id) {
    return roommatesDB.getRoommateById(roommate_id)
      .then(roommate => {
        if (roommate ? roommate.house_id === house_id : false) {
          return true
        } else {
          throw new Error('Forbidden')
        }
      })
  },
  isBillInHouse(bill_id, house_id) {
    return billsDB.getBillById(bill_id)
      .then(bill => {
        if (bill ? bill.house_id === house_id : false) {
          return true
        } else {
          throw new Error('Forbidden')
        }
      })
  },
}

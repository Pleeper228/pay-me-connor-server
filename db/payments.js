const connection = require('./connection');

module.exports = {
  getPaymentById(id) {
    return connection('payments').where('id', id).first()
  },
  findPaymentsByRoommatesIdAndBillsId(roommate_id, bill_id) {
    return connection.select('payments.*', 'roommates.name AS roommates_name', 'bills.name AS bills_name').from('payments').innerJoin('roommates', 'roommates.id', 'payments.roommate_id').innerJoin('bills', 'bills.id', 'payments.bill_id').where('roommates.id', roommate_id).where('bills.id', bill_id)
  },
  createPayment(payment) {
    return connection('payments').insert(payment, '*').then(payment => payment[0]);
  },
  updatePayment(id, payment) {
    return connection('payments').where('id', id).update(payment, '*');
  },
  deletePayment(id) {
    return connection('payments').where('id', id).del()
  },
  findAllBillPayments(bill_ids) {
    return connection.select('payments.*', 'roommates.name AS roommate_name').from('payments').innerJoin('roommates', 'roommates.id', 'payments.roommate_id').whereIn('payments.bill_id', bill_ids)
  },
  findAllRoommatePayments(roommate_ids) {
    return connection.select('payments.*').from('payments').innerJoin('roommates', 'roommates.id', 'payments.roommate_id').whereIn('payments.roommate_id', roommate_ids)
  }
}

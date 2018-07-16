const connection = require('./connection');

module.exports = {
  getBillById(id) {
    return connection('bills').where('id', id).first()
  },
  findBillsByHouseId(house_id) {
    return connection.select('bills.*').from('bills').innerJoin('houses', 'bills.house_id', 'houses.id').where('houses.id', house_id)
  },
  createBill(bill) {
    return connection('bills').insert(bill, '*');
  },
  updateBill(id, bill) {
    return connection('bills').where('id', id).update(bill, '*');
  },
  deleteBill(id) {
    return connection('bills').where('id', id).del()
  }
}

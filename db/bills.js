const connection = require('./connection');
const paymentsDB = require('./payments')

function addPaymentsToBills(bills) {
  let bill_ids = bills.map(bill => {
    return bill.id
  })
  return paymentsDB.findAllBillPayments(bill_ids).then(payments => {
    return bills.map(bill => {
      bill.payments = []
      bill.amountPaid = 0
      payments.forEach(payment => {
        if (payment.bill_id === bill.id) {
          bill.payments.push(payment)
          bill.amountPaid += payment.amount
        }
      })
      return bill
    })
  })
}

module.exports = {
  getBillById(id) {
    return connection('bills').where('id', id).first()
  },
  findBillsByHouseId(house_id) {
    return connection.select('bills.*').from('bills').innerJoin('houses', 'bills.house_id', 'houses.id').where('houses.id', house_id).then(bills => addPaymentsToBills(bills))
  },
  createBill(bill) {
    return connection('bills').insert(bill, '*')
      .then(bill => bill[0])
      .then(bill => {
        bill.payments = []
        return bill
      });
  },
  addBillToHouse(billName, billAmount, house_id) {
    let bill = {
      name: billName,
      amount: billAmount,
      house_id: house_id
    }
    return this.createBill(bill)
  },
  updateBill(id, bill) {
    return connection('bills').where('id', id).update(bill, '*');
  },
  deleteBill(id) {
    return connection('bills').where('id', id).del()
  },
  findBillInHouseById(house_id, roommate_id) {
    return connection('bills').where('house_id', house_id).where('id', bill_id)
  },
  getBillAmountRemaining(bill_id) {
    return connection.select('bills.*').from('bills').leftJoin('payments', 'bills.id', 'payments.bill_id').sum('payments.amount AS amount_paid').where('bills.id', bill_id).groupBy('bills.id').first().then(bill => bill.amount - bill.amount_paid)
  }
}

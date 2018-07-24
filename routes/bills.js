const express = require('express')
const router = express.Router()
const bills = require('../db/bills')

function isValidId(req, res, next) {
  if (!isNaN(req.params.id)) {
    return next()
  } else {
    next(new Error('Invalid Id'))
  }
}

function isValidBill(bill) {
  const hasName = typeof bill.name == 'string' && bill.name.trim() != ''
  const hasAmount = typeof bill.amount == 'number'
  return hasName && hasAmount
}

router.get('/:id', isValidId, (req, res, next) => {
  bills.getBillById(req.params.id)
    .then(bill => {
      if (bill) {
        res.json(bill)
      } else {
        next()
      }
    })
})

router.post('/', (req, res, next) => {
  if (isValidBill(req.body)) {
    bills.createBill(req.body)
      .then(bills => {
        res.json(bills[0])
      })
  } else {
    next(new Error('Invalid Bill'))
  }
})

router.put('/:id', isValidId, (req, res, next) => {
  if (isValidBill(req.body)) {
    bills.updateBill(req.params.id, req.body).then(bills => {
      res.json(bills[0])
    })
  } else {
    next(new Error('Invalid Bill'))
  }
})

router.delete('/:id', isValidId, (req, res) => {
  bills.deleteBill(req.params.id).then(() => {
    res.json({
      message: 'Deleted'
    })
  })
})

module.exports = router

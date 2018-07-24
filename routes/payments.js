const express = require('express')
const router = express.Router()
const payments = require('../db/payments')

function isValidId(req, res, next) {
  if (!isNaN(req.params.id)) {
    return next()
  } else {
    next(new Error('Invalid Id'))
  }
}

function isValidPayment(payment) {
  const hasAmount = typeof payment.amount == 'number'
  return hasAmount
}

router.get('/:id', isValidId, (req, res, next) => {
  payments.getPaymentById(req.params.id)
    .then(payment => {
      if (payment) {
        res.json(payment)
      } else {
        next()
      }
    })
})

router.post('/', (req, res, next) => {
  if (isValidPayment(req.body)) {
    payments.createPayment(req.body)
      .then(payments => {
        res.json(payments[0])
      })
  } else {
    next(new Error('Invalid Payment'))
  }
})

router.put('/:id', isValidId, (req, res, next) => {
  if (isValidPayment(req.body)) {
    payments.updatePayment(req.params.id, req.body).then(payments => {
      res.json(payments[0])
    })
  } else {
    next(new Error('Invalid Payment'))
  }
})

router.delete('/:id', isValidId, (req, res) => {
  payments.deletePayment(req.params.id).then(() => {
    res.json({message: 'Deleted'})
  })
})

module.exports = router

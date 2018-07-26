const express = require('express')
const router = express.Router()
const houses = require('../db/houses')
const roommates = require('../db/roommates')
const bills = require('../db/bills')
const payments = require('../db/payments')
const auth = require('../auth')


function isValidId(req, res, next) {
  if (!isNaN(req.params.id)) {
    return next()
  } else {
    next(new Error('Invalid Id'))
  }
}

function isValidHouse(house) {
  const hasName = typeof house.name == 'string' && house.name.trim() != ''
  return hasName
}

function isValidRoommate(roommate) {
  const hasName = typeof roommate.name == 'string' && roommate.name.trim() != ''
  return hasName
}

function isValidBill(bill) {
  const hasName = typeof bill.name === 'string' && bill.name.trim() != ''
  const hasAmount = typeof bill.amount === 'number'
  return hasName && hasAmount
}

function isValidPayment(payment) {
  const hasBillId = typeof payment.bill_id === 'number'
  const hasRoommateId = typeof payment.roommate_id === 'number'
  const hasAmount = typeof payment.amount === 'number'
  return hasBillId && hasRoommateId && hasAmount
}

function requireAuth(req, res, next) {
  if (req.auth.isAuthenticated) {
    return next()
  } else {
    next(new Error('Unauthorized'))
  }
}

function getCurrentHouse(req, res, next) {
  houses.findHouseByUserId(req.auth.user.id)
    .then(house => {
      if (house) {
        req.currentHouse = house
        next()
      } else {
        next(new Error('Not Found'))
      }
    })
}

router.get('/current', requireAuth, getCurrentHouse, (req, res, next) => {
  res.json(req.currentHouse)
})

router.get('/current/roommates', requireAuth, getCurrentHouse, (req, res, next) => {
  roommates.findRoommatesByHouseId(req.currentHouse.id).then(roommates => {
    res.json(roommates)
  })
})

router.get('/current/bills', requireAuth, getCurrentHouse, (req, res, next) => {
  bills.findBillsByHouseId(req.currentHouse.id).then(bills => {
    res.json(bills)
  })
})

router.post('/current/roommates', requireAuth, getCurrentHouse, (req, res, next) => {
  if (isValidRoommate(req.body)) {
    roommates.addRoommateToHouse(req.body.name, req.currentHouse.id).then(roommate => {
      res.json(roommate)
    })
  } else {
    next(new Error('Invalid Roommate'))
  }
})

router.post('/current/bills', requireAuth, getCurrentHouse, (req, res, next) => {
  if (isValidBill(req.body)) {
    bills.addBillToHouse(req.body.name, req.body.amount, req.currentHouse.id).then(bill => {
      res.json(bill)
    })
  } else {
    next(new Error('Invalid Bill'))
  }
})

router.post('/current/payments', requireAuth, getCurrentHouse, (req, res, next) => {
  if (!isValidPayment(req.body)) {
    next(new Error('Invalid Payment'))
    return
  }
  auth.isRoommateInHouse(req.body.roommate_id, req.currentHouse.id)
    .then(() => {
      return auth.isBillInHouse(req.body.bill_id, req.currentHouse.id)
    })
    .then(() => {
      return bills.getBillAmountRemaining(req.body.bill_id)
    })
    .then(amountRemaining => {
      if (amountRemaining >= req.body.amount) {
        return payments.createPayment(req.body)
      } else {
        throw new Error('Payment Amount Exceeds Remaining Balance')
      }
    })
    .then(payment => {
      res.json(payment)
    })
    .catch(err => {
      next(err)
    })
})

router.post('/', (req, res, next) => {
  if (isValidHouse(req.body)) {
    houses.createHouse(req.body)
      .then(houses => {
        res.json(houses[0])
      })
  } else {
    next(new Error('Invalid House'))
  }
})

router.put('/:id', isValidId, (req, res, next) => {
  if (isValidHouse(req.body)) {
    houses.updateHouse(req.params.id, req.body).then(houses => {
      res.json(houses[0])
    })
  } else {
    next(new Error('Invalid House'))
  }
})

router.patch('/current/roommates/:id', isValidId, (req, res, next) => {
  roommates.updateRoommate(req.params.id, req.body).then(roommates => {
    res.json(roommates[0])
  })
})

router.delete('/:id', isValidId, (req, res) => {
  houses.deleteHouse(req.params.id).then(() => {
    res.json({message: 'Deleted'})
  })
})

router.delete('/current/payments/:id', isValidId, (req, res) => {
  payments.deletePayment(req.params.id).then(() => {
    res.json({message: 'Deleted'})
  })
})

module.exports = router

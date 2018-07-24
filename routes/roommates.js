const express = require('express')
const router = express.Router()
const houses = require('../db/houses')

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

router.get('/:id', isValidId, (req, res, next) => {
  houses.getHouseById(req.params.id)
    .then(house => {
      if (house) {
        res.json(house)
      } else {
        next()
      }
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

router.delete('/:id', isValidId, (req, res) => {
  houses.deleteHouse(req.params.id).then(() => {
    res.json({message: 'Deleted'})
  })
})

module.exports = router

const express = require('express')
const router = express.Router()
const users = require('../db/users')

function isValidId(req, res, next) {
  if (!isNaN(req.params.id)) {
    return next()
  } else {
    next(new Error('Invalid Id'))
  }
}

function isValidUser(house) {
  const hasName = typeof house.name == 'string' && house.name.trim() != ''
  return hasName
}

router.get('/:id', isValidId, (req, res, next) => {
  users.getUserById(req.params.id)
    .then(house => {
      if (house) {
        res.json(house)
      } else {
        next()
      }
    })
})

router.post('/', (req, res, next) => {
  if (isValidUser(req.body)) {
    users.createUser(req.body)
      .then(users => {
        res.json(users[0])
      })
  } else {
    next(new Error('Invalid User'))
  }
})

router.put('/:id', isValidId, (req, res, next) => {
  if (isValidUser(req.body)) {
    users.updateUser(req.params.id, req.body).then(users => {
      res.json(users[0])
    })
  } else {
    next(new Error('Invalid User'))
  }
})

router.delete('/:id', isValidId, (req, res) => {
  users.deleteUser(req.params.id).then(() => {
    res.json({message: 'Deleted'})
  })
})

module.exports = router

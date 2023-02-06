const express = require('express')
const { logIn, signUp, getUser } = require('../Controllers/user.Controller')
const router = express.Router()

router.post('/login', logIn)
router.post('/signup', signUp)
router.get('/:id', getUser)

module.exports = router

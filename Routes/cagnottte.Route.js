const express = require('express')
const auth = require('../Middlewares/auth')
const {
  getCagnottes,
  getCagnotte,
  createCagnotte,
} = require('../Controllers/cagnotte.Controllers')

const router = express.Router()

router.post('/create', auth, createCagnotte)
router.get('/all', auth, getCagnottes)
router.get('/:id', auth, getCagnotte)

module.exports = router

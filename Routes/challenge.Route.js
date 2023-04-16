const express = require('express')
const auth = require('../Middlewares/auth')
const {
  getChallenges,
  getChallenge,
  createChallenge,
  buyChallengeCard,
  depositChallengeCard,
} = require('../Controllers/challenge.Controllers')

const router = express.Router()

router.post('/create',auth, createChallenge)
router.post('/buy' ,auth, buyChallengeCard)
router.post('/deposit',auth, depositChallengeCard)
router.get('/all',auth, getChallenges)

module.exports = router

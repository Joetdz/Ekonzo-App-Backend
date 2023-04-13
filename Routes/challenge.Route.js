const express = require('express')
const {
  getChallenges,
  getChallenge,
  createChallenge,
  buyChallengeCard,
} = require('../Controllers/challenge.Controllers')

const router = express.Router()

router.post('/create', createChallenge)
router.post('/buy', buyChallengeCard)
router.get('/all', getChallenges)
router.get('/:id', getChallenge)

module.exports = router

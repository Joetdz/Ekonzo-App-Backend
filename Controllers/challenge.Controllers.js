const axios = require('axios')
const { Challenges } = require('../Models/Challenge')

const createChallenge = (req, res) => {
  Challenges.findOne({ nom: req.body.nom }).then((challenge) => {
    if (challenge) {
      res
        .status(401)
        .json(
          `le challenge  ${challenge.nom} existe déjà impossible de créer un nouveau challenge avec ce nom`
        )
    } else {
      const challenge = new Challenges({
        ...req.body,
      })

      challenge.save().then((challenge) => {
        const message = `le challenge ${challenge.name} a été créé avec succès`
        console.log(message)
        res
          .status(200)
          .json({
            message: message,
            data: challenge,
          })
          .catch((err) => {
            const message = "Le challenge n'a pas pu ête crée"
            res.status(403).json({
              err: err,
              message: message,
            })
          })
      })
    }
  })
}

const getChallenges = (req, res) => {
  Challenges.find()
    .then((challenges) => {
      if (challenges) {
        res.status(200).json({ challenges })
        res.send('Hello from the backend')
      } else {
        res.status(404).json({
          messages: "Aucun chanllenge n'est disponible",
        })
      }
    })
    .catch((err) => {
      console.log(err)
      res.status(403).json({
        err,
      })
    })
}

const getChallenge = (req, res) => {
  Challenges.findone({ _id: req.params.id })
    .then((challenge) => {
      res.status(200).json({ challenge })
    })
    .catch((err) => {
      res.status(403).json({ err })
    })
}

const buyChallengeCard = async (req, res) => {
  const data = {
    gatewayMode: 1, // required, 0 : SandBox 1 : Live
    publicApiKey: `${process.env.MAISHAPAY_PUBLICKEY}`, // required,
    secretApiKey: `${process.env.MAISHAPAY_SECRETKEY}`, // required
    transactionReference: 'AdfdfdfBCD', // required
    amount: req.body.prix, // required
    currency: req.body.devise, // required USD, CDF, FCFA, EURO
    customerFullName: req.body.client, // nullable
    customerPhoneNumber: '', // nullable
    customerEmailAddress: null, // nullable
    chanel: 'MOBILEMONEY', // required MOBILEMONEY
    provider: req.body.operateur, // reqyuired MPESA, ORANGE, AITEL, AFRICEL, MTN
    walletID: req.body.numero, // required
  }
  console.log('data', data)

  await axios({
    method: 'post',
    url: 'https://marchand.maishapay.online/api/payment/rest/vers1.0/merchant',
    data: data,
  })
    .then((res) => console.log(res))
    .catch((err) => console.error(err.data))
}
module.exports = {
  createChallenge,
  getChallenges,
  getChallenge,
  buyChallengeCard,
}

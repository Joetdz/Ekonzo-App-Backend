const axios = require('axios')
const { Challenges } = require('../Models/Challenge')
const { User } = require('../Models/User')
const uuid = require('uuid')
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
  const ref = uuid.v4()
  const data = {
    gatewayMode: 1, // required, 0 : SandBox 1 : Live
    publicApiKey: `${process.env.MAISHAPAY_PUBLICKEY}`, // required,
    secretApiKey: `${process.env.MAISHAPAY_SECRETKEY}`, // required
    transactionReference: ref, // required
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
    url: `${process.env.MAISHAPAY_URL}`,
    data: data,
  })
    .then((res) => {
      if (res.status === 202) {
        User.updateOne(
          { _id: req.body.id },
          { $push: { challenge: req.body.challenge } }
        ).then((user) => {
          console.log('user', user)
        })
      }

      console.log('res', res.status)
    })
    .catch((err) => {
      console.error('eer', err)
    })
}
const depositChallengeCard = async (req, res) => {
  await User.findOne({ _id: req.body.id }).then((user) => {
    if (user) {
      const startAmount = user.challenge[req.body.index].montant_depart
      const progress = user.challenge[req.body.index].progression
      const target = user.challenge[req.body.index].target
      const sold = user.challenge[req.body.index].solde
      const depositAmount = startAmount * progress

      if ((progress) => target) {
        const ref = uuid.v4()
        const data = {
          gatewayMode: 1, // required, 0 : SandBox 1 : Live
          publicApiKey: `${process.env.MAISHAPAY_PUBLICKEY}`, // required,
          secretApiKey: `${process.env.MAISHAPAY_SECRETKEY}`, // required
          transactionReference: ref, // required
          amount: depositAmount, // required
          currency: req.body.devise, // required USD, CDF, FCFA, EURO
          customerFullName: req.body.client, // nullable
          customerPhoneNumber: '', // nullable
          customerEmailAddress: null, // nullable
          chanel: 'MOBILEMONEY', // required MOBILEMONEY
          provider: req.body.operateur, // reqyuired MPESA, ORANGE, AITEL, AFRICEL, MTN
          walletID: req.body.numero, // required
        }
        console.log('depot data', data.data)
        axios({
          method: 'post',
          url: `${process.env.MAISHAPAY_URL}`,
          data: data,
        })
          .then((res) => {
            if (res.status === 202) {
              User.updateOne(
                { _id: req.body.id },
                {
                  $set: {
                    ['challenge.' + req.body.index]: {
                      image: 'piyo.png',
                      nom: 'piyo',
                      prix: 1,
                      target: 25,
                      progression: progress + 1,
                      montant_depart: 1,
                      solde: sold + depositAmount,

                      status: 'active',
                    },
                  },
                }
              )
                .then((res) => console.log('userz ajour ', res))
                .catch((err) => console.log('uuurs ajour', err))
            }

            console.log('res', res)
          })
          .catch((err) => {
            console.error('', err)
          })
      } else {
        console.log('félicitation , vous avez terrminer le challenge')
      }

      const nextStep = user
    }
    console.log('user', user.challenge[req.body.index])
  })
}

module.exports = {
  createChallenge,
  getChallenges,
  getChallenge,
  buyChallengeCard,
  depositChallengeCard,
}

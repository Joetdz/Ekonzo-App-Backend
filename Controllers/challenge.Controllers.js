const axios = require('axios')
const { Challenges } = require('../Models/Challenge')
const { User } = require('../Models/User')
const uuid = require('uuid')
const createChallenge = async (req, res) => {
  await Challenges.findOne({ nom: req.body.nom }).then((challenge) => {
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

const getChallenges = async (req, res) => {
  Challenges.find()
    .then((challenges) => {
      if (challenges) {
        res.status(200).json({ challenges })

        res.end()
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

const getChallenge = async (req, res) => {
  await Challenges.findone({ _id: req.params.id })
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
    walletID: '243' + req.body.numero, // required
  }
  console.log('data', data)

  await axios({
    method: 'post',
    url: `${process.env.MAISHAPAY_URL}`,
    data: data,
  })
    .then((transaction) => {
      if (transaction.status === 202) {
        User.updateOne(
          { _id: req.body.id },
          {
            $push: {
              challenge: {
                nom: req.body.nom,
                image: req.body.image,
                devise: req.body.devise,
                prix: req.body.prix,
                target: req.body.target,
                montant_depart: req.body.montant_depart,
                progression: 1,
                solde: 0,
              },
            },
          }
        ).then((user) => {
          res.status(200).json({
            messages: 'paiement effectué avec succès',
          })
          console.log('user', user)
        })
      }

      console.log('res', res.data)
    })
    .catch((err) => {
      console.error('eer', err)
      res
        .status(403)
        .json(
          "Désolé quelque chose s'est mal passé avec l'operateur lors de l'achat de votre carte ! Vueilliez réessayer "
        )
      res.end
    })
}
const depositChallengeCard = async (req, res) => {
  await User.findOne({ _id: req.body.id }).then((user) => {
    if (user) {
      const startAmount = user.challenge[req.body.index].montant_depart
      const progress = user.challenge[req.body.index].progression
      const target = user.challenge[req.body.index].target
      const sold = user.challenge[req.body.index].solde
      const nom = user.challenge[req.body.index].nom
      const image = user.challenge[req.body.index].image
      const prix = user.challenge[req.body.index].prix

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
          customerFullName: '', // nullable
          customerPhoneNumber: '', // nullable
          customerEmailAddress: null, // nullable
          chanel: 'MOBILEMONEY', // required MOBILEMONEY
          provider: req.body.operateur, // reqyuired MPESA, ORANGE, AITEL, AFRICEL, MTN
          walletID: '243' + req.body.numero, // required
        }
        console.log('depot data', data.data)
        axios({
          method: 'post',
          url: `${process.env.MAISHAPAY_URL}`,
          data: data,
        })
          .then((transaction) => {
            if (transaction.status === 202) {
              User.updateOne(
                { _id: req.body.id },
                {
                  $set: {
                    ['challenge.' + req.body.index]: {
                      image: image,
                      nom: nom,
                      prix: prix,
                      target: target,
                      progression: progress + 1,
                      solde: sold + depositAmount,
                      montant_depart: startAmount,

                      status: 'active',
                    },
                  },
                }
              )
                .then((data) => {
                  console.log('userz ajour ', data)
                  res.status(200).json({
                    messages: 'paiement effectué avec succès',
                  })
                  res.end
                })
                .catch((err) => {
                  
                  console.log('uuurs ajour', err.data)
                })
            }

            console.log('res', res)
          })
          .catch((err) => {
            console.error('', err.data)
            res.status(403).json('Vueilliez réessayer ')
          })
      } else {
        console.log('félicitation , vous avez terrminer le challenge')
      }

      const nextStep = user
    }
    console.log('user', user.challenge[req.body.index])
  })
}

const getUserChallengeCards = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (user) {
      res.status(200).json({ challenges: user.challenge })
    } else {
      res.status(404).json('Aucun utilisateur trouvé')
    }
  } catch (err) {
    res.status(403).json({ err })
  }
}

module.exports = {
  createChallenge,
  getChallenges,
  getChallenge,
  buyChallengeCard,
  depositChallengeCard,
  getUserChallengeCards,
}

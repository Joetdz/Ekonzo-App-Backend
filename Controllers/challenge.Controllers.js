const { Challenges } = require('../Models/Challenge')

const createChallenge = (res, req) => {
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

const getChallenges = (res, req) => {
  Challenges.find()
    .then((challenges) => {
      if (challenges) {
        res.status(200).json({
          data: challenges,
        })
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

const getChallenge = (res, req) => {
  Challenges.findone({ _id: req.params.id })
    .then((challenge) => {
      res.status(200).json({ challenge })
    })
    .catch((err) => {
      res.status(403).json({ err })
    })
}
module.exports = { createChallenge, getChallenges, getChallenge }

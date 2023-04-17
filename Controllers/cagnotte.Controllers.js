const { Cagnottes } = require('../Models/Cagnotte')

const createCagnotte = (res, req) => {
  Cagnottes.findOne({ nom: req.body.nom }).then((Cagnotte) => {
    if (Cagnotte) {
      res
        .status(401)
        .json(
          `le Cagnotte  ${Cagnotte.nom} existe déjà impossible de créer un nouveau Cagnotte avec ce nom`
        )
    } else {
      const Cagnotte = new Cagnottes({
        ...req.body,
      })

      Cagnotte.save().then((Cagnotte) => {
        const message = `la Cagnotte ${Cagnotte.name} a été créé avec succès`
        console.log(message)
        res
          .status(200)
          .json({
            message: message,
            data: Cagnotte,
          })
          .catch((err) => {
            const message = "Le Cagnotte n'a pas pu ête crée"
            res.status(403).json({
              err: err,
              message: message,
            })
          })
      })
    }
  })
}

const getCagnottes = (req, res) => {
  Cagnottes.find()
    .then((Cagnottes) => {
      if (Cagnottes) {
        res.status(200).json({ Cagnottes })
        res.send('Hello from the backend')
      } else {
        res.status(404).json({
          messages: "Aucuns   Cagnottes n'est disponible",
        })
      }
    })
    .catch((err) => {
      console.log(err)
      // res.status(403).json({
      //   err,
      // })
    })
}

const getCagnotte = (res, req) => {
  Cagnottes.findone({ _id: req.params.id })
    .then((Cagnotte) => {
      // res.status(200).json({ Cagnotte })
    })
    .catch((err) => {
      res.status(403).json({ err })
    })
}
module.exports = { createCagnotte, getCagnottes, getCagnotte }

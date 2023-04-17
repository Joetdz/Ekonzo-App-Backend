const { User } = require('../Models/User')
const bcrypt = require('bcrypt')
const jwt = require('jwt-simple')
const config = require('../Config/config')

const signUp = (req, res) => {
  User.findOne({
    tel: req.body.tel,
  }).then((user) => {
    if (user) {
      console.log(user)
      res
        .status(400)
        .json('Ce numéro est déja utilisé par un autre utilisateur')
      res.end
    } else {
      bcrypt.hash(req.body.password, 10).then((hashedPassword) => {
        req.body.password = hashedPassword
        const user = new User({
          ...req.body,
        })

        user
          .save()
          .then((user) => {
            console.log(`l'utilisateur ${user.prenom} est inscrit avec succès`)
            const playload = {
              id: user.id,
              name: user.name,
              expire: Date.now() + 1000 * 60 * 60 * 24 * 7,
            }
            const token = jwt.encode(playload, config.jwtSecret)
            delete user.password
            res.status(200).json({
              userId: user._id,
              token: `Bearer ${token}`,
            })
          })
          .catch((err) => {
            console.log(err)
            res.status(403).json(err.massage)
          })
      })
    }
  })
}
const logIn = (req, res) => {
  console.log(req.body)
  User.findOne({
    tel: req.body.numero,
  })
    .then((user) => {
      if (!user) {
        console.log(user)
        res.status(401).json('Aucun compte lié a ce numero')
      } else {
        const playload = {
          id: user.id,
          name: user.name,
          expire: Date.now() + 1000 * 60 * 60 * 24 * 7,
        }
        const token = jwt.encode(playload, config.jwtSecret)

        bcrypt
          .compare(req.body.password, user.password)

          .then((valid) => {
            if (!valid) res.status(401).json('mot de passe incorrect')
            else {
              delete user.password
              res.status(200).json({
                userId: user._id,
                token: `Bearer ${token}`,
              })
            }
          })
      }
    })
    .catch((err) => res.status(403).json(err))
}

const getUser = async (req, res) => {
  await User.find({ _id: req.params.id })
    .then((user) => {
      res.status(200).json(user)
    })
    .catch((err) => {
      res.status(401).json(err.message)
    })
}

module.exports = { logIn, signUp, getUser }

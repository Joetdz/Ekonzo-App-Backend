const { User } = require('../Models/User')
const bcrypt = require('bcrypt')
const jwt = require('jwt-simple')
const config = require('../Config/config')

const signUp = (req, res) => {
  User.findOne({
    $or: [{ email: req.body.email }, { tel: req.body.tel }],
  }).then((user) => {
    if (user) {
      console.log(user)
      res
        .status(400)
        .json(
          'ce numéro et/ou cet email sont déja utilisés pour un autre compte'
        )
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
              userId: user,
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
        res.status(401).json('email ou numéro incorect')
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
                userId: user.id,
                token: `Bearer ${token}`,
              })
            }
          })
      }
    })
    .catch((err) => res.status(403).json(err))
}

module.exports = { logIn, signUp }

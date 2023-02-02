const mongoose = require('mongoose')
const Schema = mongoose.Schema
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new Schema(
  {
    nom: {
      type: String,
    },
    prenom: {
      type: String,
    },

    tel: {
      type: String,
    },
    email: {
      type: String,
    },
    password: String,
    profil: String,
    promoCode: String,
  },

  { timestamps: true }
)

userSchema.plugin(uniqueValidator)
const User = mongoose.model('user', userSchema)

module.exports = { User }

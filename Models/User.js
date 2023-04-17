const mongoose = require('mongoose')
const Schema = mongoose.Schema
const uniqueValidator = require('mongoose-unique-validator')
const challengesSchema = new Schema(
  {
    nom: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },

    montant_depart: {
      type: Number,
    },

    progression: {
      type: Number,
    },
    target: {
      type: Number,
    },
    image: {
      type: String,
    },
    prix: {
      type: Number,
    },
    solde: {
      type: Number,
    },
    status: {
      type: String,
    },
  },
  { timestamps: true }
)

const CagnottesSchema = new Schema(
  {
    nom: {
      type: String,
    },
    description: {
      type: String,
    },
    target: {
      type: Number,
    },
    progress: {
      type: Number,
    },

    image: {
      type: String,
    },
    montant_depart: {
      type: Number,
    },
    status: {
      type: String,
    },
  },
  { timestamps: true }
)

const userSchema = new Schema(
  {
    nom: {
      type: String,
    },
    prenom: {
      type: String,
    },

    tel: {
      type: Number,
    },
    email: {
      type: String,
    },

    challenge: [challengesSchema],
    cagnotte: [CagnottesSchema],

    password: { type: String },
    profil: { type: String },
    promoCode: { type: String },
  },

  { timestamps: true }
)

userSchema.plugin(uniqueValidator)
const User = mongoose.model('user', userSchema)

module.exports = { User }

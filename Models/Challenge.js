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
      required: true,
    },
    complexite: {
      name: {
        type: String,
        required: true,
      },
      nombre: {
        type: Number,
        required: true,
      },
    },
    longueur: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    prix: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
)
challengesSchema.plugin(uniqueValidator)
const Challenges = mongoose.model('challenges', challengesSchema)

module.exports = { Challenges }

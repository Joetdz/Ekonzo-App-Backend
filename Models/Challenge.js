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

    target: {
      type: Number,
      required: true,
    },

    image: {
      type: String,
      required: false,
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

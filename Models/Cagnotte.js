const mongoose = require('mongoose')
const Schema = mongoose.Schema
const uniqueValidator = require('mongoose-unique-validator')

const CagnottesSchema = new Schema(
  {
    nom: {
      type: String,
    },
    description: {
      type: String,
    },

    image: {
      type: String,
    },
    prix: {
      type: Number,
    },
  },
  { timestamps: true }
)
CagnottesSchema.plugin(uniqueValidator)
const Cagnottes = mongoose.model('Cagnottes', CagnottesSchema)

module.exports = { Cagnottes }

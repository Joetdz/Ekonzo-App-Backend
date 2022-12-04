const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");
const carteShema = new Schema({
  Numero: {
    type: String,
    unique: true,
  },
});
const userSchema = new Schema(
  {
    name: {
      type: String,
    },
    numero: {
      type: Number,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
    },
    password: String,
    profil: String,
    promoCode: String,
    cartes: [],
  },

  { timestamps: true }
);

userSchema.plugin(uniqueValidator);
const User = mongoose.model("user", userSchema);

module.exports = { User };

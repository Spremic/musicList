const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    nameBand: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    naslov: [String],
    tekst: [String],
  },
  {
    cllection: "users",
  }
);

const model = mongoose.model("UserSchema", UserSchema);

module.exports = model;

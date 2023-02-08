/* Import package mongodb, création model d'utilisateur
application du package uniqueValidator et export de User*/

const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const accountSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

accountSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", accountSchema);

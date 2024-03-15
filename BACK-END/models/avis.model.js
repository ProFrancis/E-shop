import mongoose from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";

const avisSchema = mongoose.Schema({
  stars: { type: Number, required: true },
  content: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Avis = mongoose.model('Avis', avisSchema);

module.exports = Avis;

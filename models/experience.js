const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ExperienceSchema = new Schema({
  name: String,
  price: Number,
  images: String,
  imagesName: String,
  description: String,
  duration: Number,
  availability: [{ type: Date }],
  user: { type: Schema.Types.ObjectId, ref: "User" },
  address: String,
  location: { type: { type: String }, coordinates: [Number] },
  category: String
},
{
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

ExperienceSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Experience", ExperienceSchema);

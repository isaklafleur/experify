const mongoose = require('mongoose');

const ExperienceSchema = mongoose.Schema({
  name: String,
  price: Number,
  images: [{ type: String }],
  description: String,
  duration: Number,
  availability: [{ type: Date }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  location: {
    city: String,
    street: String,
  },
  categories: [{ type: String }],
},
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  });

module.exports = mongoose.model('Experience', ExperienceSchema);

const mongoose = require('mongoose');

const BookingSchema = mongoose.Schema({
  name: String,
  value: Number,
  host: { type: Schema.Types.ObjectId, ref: 'Host' },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  experience: { type: Schema.Types.ObjectId, ref: 'Experience' },
},
{
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

module.exports = mongoose.model('Experience', ExperienceSchema);

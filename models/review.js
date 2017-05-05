const mongoose = require('mongoose');

const ReviewSchema = mongoose.Schema({
  comment: String,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  experience: { type: Schema.Types.ObjectId, ref: 'Experience' },
},
{
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

module.exports = mongoose.model('Review', ReviewSchema);

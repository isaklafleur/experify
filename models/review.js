const mongoose = require('mongoose');

const ReviewSchema = mongoose.Schema({
  comment: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
},
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  });

module.exports = mongoose.model('Review', ReviewSchema);

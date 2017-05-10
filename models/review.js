const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  comment: String,
  author: {
    id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    name: String,
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

module.exports = mongoose.model('Review', ReviewSchema);

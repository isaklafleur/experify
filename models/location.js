const mongoose = require('mongoose');

const LocationSchema = mongoose.Schema({
  name: String,
  location: { type: { type: String }, coordinates: [Number] },
},
{
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

LocationSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Location', LocationSchema);

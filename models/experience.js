const mongoose = require('mongoose');

const ExperienceSchema = mongoose.Schema({
  name: String,
  host: { type: Schema.Types.ObjectId, ref: 'Host' },
  location: { type: Schema.Types.ObjectId, ref: 'Location' },
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
},
{
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

module.exports = mongoose.model('Experience', ExperienceSchema);

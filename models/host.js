const mongoose = require('mongoose');

const HostSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
},
{
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

module.exports = mongoose.model('Host', HostSchema);
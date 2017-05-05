const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  experiences: [{ type: Schema.Types.ObjectId, ref: 'Experience' }],
},
{
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

module.exports = mongoose.model('Host', HostSchema);

const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  name: String,
  username: String,
  password: String,
  experiences: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Experience' }],
},
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  });

module.exports = mongoose.model('User', UserSchema);

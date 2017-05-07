const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  email: String,
  password: String,
  name: String,
  profileImg: String,
  about: String,
  facebookId: Number,
  experiences: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Experience' }],
},
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  });

module.exports = mongoose.model('User', UserSchema);

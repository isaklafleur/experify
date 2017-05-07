const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  email: String,
  password: String,
  name: String,
  pic_path: String,
  pic_name: String,
  about: String,
  facebookId: Number,
  location: {
    city: { type: String },
    country: { type: String },
  },
  experiences: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Experience' }],
},
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  });

module.exports = mongoose.model('User', UserSchema);

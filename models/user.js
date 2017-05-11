const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: String,
  password: String,
  name: String,
  avatar: String,
  about: String,
  facebookId: Number,
  location: {
    city: { type: String },
    country: { type: String },
  },
  experiences: [{ type: Schema.Types.ObjectId, ref: 'Experience' }],
},
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  });

module.exports = mongoose.model('User', UserSchema);

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Schema defines how chat messages will be stored in MongoDB
const ChatSchema = new Schema({
  nick: String,
  msg: String,
  created: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Chat', ChatSchema);
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Schema defines how chat messages will be stored in MongoDB
const ConversationSchema = new Schema({
  participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
  experience: { type: Schema.Types.ObjectId, ref: "Experience" }
});

module.exports = mongoose.model("Conversation", ConversationSchema);

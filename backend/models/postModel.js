const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  description: { type: String },
  image: { type: String, required: true },
  likes: { type: Number, default: 0 },
  comments: [{ text: String, createdAt: { type: Date, default: Date.now } }],
});

exports.Post = mongoose.model('Post', postSchema);

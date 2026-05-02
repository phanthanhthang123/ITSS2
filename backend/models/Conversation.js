const mongoose = require('mongoose');

// Schema cuộc hội thoại - giữa 2 người dùng
const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  lastMessage: {
    type: String,
    default: ''
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index để tìm conversations của 1 user nhanh
conversationSchema.index({ participants: 1 });

module.exports = mongoose.model('Conversation', conversationSchema);

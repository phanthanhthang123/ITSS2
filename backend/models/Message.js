const mongoose = require('mongoose');

// Schema tin nhắn - thuộc về 1 cuộc hội thoại
const messageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Tin nhắn không được để trống'],
    maxlength: 5000
  },
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index để lấy tin nhắn theo conversation nhanh
messageSchema.index({ conversationId: 1, createdAt: 1 });

module.exports = mongoose.model('Message', messageSchema);

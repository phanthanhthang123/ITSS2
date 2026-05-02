const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// @desc    Lấy danh sách hội thoại của user hiện tại
// @route   GET /api/conversations
exports.getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id
    })
      .populate('participants', 'name email role')
      .sort({ lastMessageAt: -1 });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Tạo cuộc hội thoại mới hoặc lấy nếu đã tồn tại
// @route   POST /api/conversations
exports.createConversation = async (req, res) => {
  try {
    const { participantId } = req.body;

    if (!participantId) {
      return res.status(400).json({ message: 'Thiếu participantId' });
    }

    // Kiểm tra conversation đã tồn tại chưa
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, participantId] }
    }).populate('participants', 'name email role');

    if (conversation) {
      return res.json(conversation);
    }

    // Tạo conversation mới
    conversation = await Conversation.create({
      participants: [req.user._id, participantId]
    });

    await conversation.populate('participants', 'name email role');

    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Lấy tin nhắn của 1 cuộc hội thoại
// @route   GET /api/messages/:conversationId
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    // Kiểm tra user có trong conversation không
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user._id
    });

    if (!conversation) {
      return res.status(403).json({ message: 'Không có quyền xem tin nhắn này' });
    }

    const messages = await Message.find({ conversationId })
      .populate('senderId', 'name role')
      .sort({ createdAt: 1 });

    // Đánh dấu tin nhắn đã đọc
    await Message.updateMany(
      { conversationId, senderId: { $ne: req.user._id }, read: false },
      { read: true }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

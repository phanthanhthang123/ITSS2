const jwt = require('jsonwebtoken');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');

// Setup Socket.io cho real-time chat
module.exports = (io) => {
  // Middleware xác thực socket connection
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Chưa xác thực'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) {
        return next(new Error('User không tồn tại'));
      }

      // Gắn user vào socket
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Token không hợp lệ'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.user.name} (${socket.user._id})`);

    // Join room riêng của user để nhận tin nhắn
    socket.join(socket.user._id.toString());

    // Event: Tham gia vào conversation room
    socket.on('join_conversation', (conversationId) => {
      socket.join(conversationId);
      console.log(`📌 ${socket.user.name} joined conversation: ${conversationId}`);
    });

    // Event: Rời conversation room
    socket.on('leave_conversation', (conversationId) => {
      socket.leave(conversationId);
    });

    // Event: Gửi tin nhắn
    socket.on('send_message', async (data) => {
      try {
        const { conversationId, content } = data;

        // Kiểm tra conversation tồn tại và user có quyền
        const conversation = await Conversation.findOne({
          _id: conversationId,
          participants: socket.user._id
        });

        if (!conversation) {
          socket.emit('error', { message: 'Conversation không hợp lệ' });
          return;
        }

        // Lưu tin nhắn vào DB
        const message = await Message.create({
          conversationId,
          senderId: socket.user._id,
          content
        });

        // Populate sender info
        await message.populate('senderId', 'name role');

        // Cập nhật lastMessage của conversation
        conversation.lastMessage = content;
        conversation.lastMessageAt = new Date();
        await conversation.save();

        // Broadcast tin nhắn đến tất cả users trong conversation
        io.to(conversationId).emit('receive_message', message);

        // Gửi notification đến participants (kể cả khi không ở trong conversation room)
        conversation.participants.forEach((participantId) => {
          if (participantId.toString() !== socket.user._id.toString()) {
            io.to(participantId.toString()).emit('new_message_notification', {
              conversationId,
              message
            });
          }
        });

      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Không thể gửi tin nhắn' });
      }
    });

    // Event: Đánh dấu tin nhắn đã đọc
    socket.on('mark_read', async (conversationId) => {
      try {
        await Message.updateMany(
          { conversationId, senderId: { $ne: socket.user._id }, read: false },
          { read: true }
        );
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    });

    // Event: Typing indicator
    socket.on('typing', (data) => {
      socket.to(data.conversationId).emit('user_typing', {
        userId: socket.user._id,
        name: socket.user.name
      });
    });

    socket.on('stop_typing', (data) => {
      socket.to(data.conversationId).emit('user_stop_typing', {
        userId: socket.user._id
      });
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.user.name}`);
    });
  });
};

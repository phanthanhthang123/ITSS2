import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getSocket } from '../services/socket';
import ChatMessage from '../components/ChatMessage';

const ChatPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const socket = getSocket();

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get('/chat/conversations');
        setConversations(res.data);

        // Nếu có conversationId từ navigate state
        if (location.state?.conversationId) {
          const conv = res.data.find(c => c._id === location.state.conversationId);
          if (conv) setActiveConv(conv);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, [location.state]);

  // Fetch messages khi chọn conversation
  useEffect(() => {
    if (!activeConv) return;

    const fetchMessages = async () => {
      try {
        const res = await api.get(`/chat/messages/${activeConv._id}`);
        setMessages(res.data);
        scrollToBottom();
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchMessages();

    // Join socket room
    if (socket) {
      socket.emit('join_conversation', activeConv._id);
      socket.emit('mark_read', activeConv._id);
    }

    return () => {
      if (socket && activeConv) {
        socket.emit('leave_conversation', activeConv._id);
      }
    };
  }, [activeConv, socket]);

  // Lắng nghe tin nhắn mới qua socket
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      setMessages(prev => [...prev, message]);
      scrollToBottom();

      // Cập nhật lastMessage trong danh sách conversations
      setConversations(prev => prev.map(c =>
        c._id === message.conversationId
          ? { ...c, lastMessage: message.content, lastMessageAt: message.createdAt }
          : c
      ));
    };

    const handleTyping = (data) => {
      setTyping(data.name);
    };

    const handleStopTyping = () => {
      setTyping(null);
    };

    const handleNotification = (data) => {
      // Cập nhật conversations list khi có tin nhắn mới
      setConversations(prev => {
        const updated = prev.map(c =>
          c._id === data.conversationId
            ? { ...c, lastMessage: data.message.content, lastMessageAt: data.message.createdAt }
            : c
        );
        return updated.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
      });
    };

    socket.on('receive_message', handleNewMessage);
    socket.on('user_typing', handleTyping);
    socket.on('user_stop_typing', handleStopTyping);
    socket.on('new_message_notification', handleNotification);

    return () => {
      socket.off('receive_message', handleNewMessage);
      socket.off('user_typing', handleTyping);
      socket.off('user_stop_typing', handleStopTyping);
      socket.off('new_message_notification', handleNotification);
    };
  }, [socket]);

  // Auto scroll khi có tin nhắn mới
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Gửi tin nhắn
  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConv || !socket) return;

    socket.emit('send_message', {
      conversationId: activeConv._id,
      content: newMessage.trim()
    });

    socket.emit('stop_typing', { conversationId: activeConv._id });
    setNewMessage('');
  };

  // Typing indicator
  const handleTypingInput = (e) => {
    setNewMessage(e.target.value);

    if (socket && activeConv) {
      socket.emit('typing', { conversationId: activeConv._id });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('stop_typing', { conversationId: activeConv._id });
      }, 2000);
    }
  };

  // Lấy tên người chat
  const getOtherParticipant = (conv) => {
    return conv.participants?.find(p => p._id !== user._id) || { name: 'Unknown' };
  };

  if (loading) {
    return <div className="loading-screen"><div className="spinner"></div></div>;
  }

  return (
    <div className="chat-page">
      {/* Sidebar - Danh sách cuộc hội thoại */}
      <div className="chat-sidebar">
        <div className="chat-sidebar-header">
          <h2>💬 Tin nhắn</h2>
        </div>

        <div className="conversation-list">
          {conversations.length === 0 ? (
            <div className="empty-conversations">
              <p>Chưa có cuộc hội thoại nào</p>
              <small>Hãy ứng tuyển hoặc nhắn tin cho doanh nghiệp</small>
            </div>
          ) : (
            conversations.map((conv) => {
              const other = getOtherParticipant(conv);
              return (
                <div
                  key={conv._id}
                  className={`conversation-item ${activeConv?._id === conv._id ? 'active' : ''}`}
                  onClick={() => setActiveConv(conv)}
                >
                  <div className="conv-avatar">
                    {other.role === 'company' ? '🏢' : '🎓'}
                  </div>
                  <div className="conv-info">
                    <h4 className="conv-name">{other.name}</h4>
                    <p className="conv-last-message">
                      {conv.lastMessage || 'Bắt đầu cuộc trò chuyện...'}
                    </p>
                  </div>
                  {conv.lastMessageAt && (
                    <span className="conv-time">
                      {new Date(conv.lastMessageAt).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-main">
        {activeConv ? (
          <>
            {/* Chat Header */}
            <div className="chat-header">
              <div className="chat-header-info">
                <span className="chat-header-avatar">
                  {getOtherParticipant(activeConv).role === 'company' ? '🏢' : '🎓'}
                </span>
                <div>
                  <h3>{getOtherParticipant(activeConv).name}</h3>
                  <span className="chat-header-role">
                    {getOtherParticipant(activeConv).role === 'company' ? 'Doanh nghiệp' : 'Sinh viên'}
                  </span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="chat-messages">
              {messages.length === 0 ? (
                <div className="empty-messages">
                  <p>👋 Hãy bắt đầu cuộc trò chuyện!</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <ChatMessage key={msg._id} message={msg} />
                ))
              )}
              {typing && (
                <div className="typing-indicator">
                  <span>{typing} đang nhập...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="chat-input-form">
              <input
                type="text"
                placeholder="Nhập tin nhắn..."
                value={newMessage}
                onChange={handleTypingInput}
                className="chat-input"
              />
              <button type="submit" className="btn btn-primary chat-send-btn"
                disabled={!newMessage.trim()}>
                📤 Gửi
              </button>
            </form>
          </>
        ) : (
          <div className="chat-placeholder">
            <span className="placeholder-icon">💬</span>
            <h3>Chọn cuộc hội thoại</h3>
            <p>Chọn một cuộc hội thoại từ danh sách bên trái để bắt đầu nhắn tin</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;

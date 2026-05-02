import { useAuth } from '../context/AuthContext';

const ChatMessage = ({ message }) => {
  const { user } = useAuth();
  const isOwn = message.senderId?._id === user?._id || message.senderId === user?._id;

  return (
    <div className={`chat-message ${isOwn ? 'own' : 'other'}`}>
      <div className="message-bubble">
        {!isOwn && (
          <span className="message-sender">{message.senderId?.name || 'User'}</span>
        )}
        <p className="message-content">{message.content}</p>
        <span className="message-time">
          {new Date(message.createdAt).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;

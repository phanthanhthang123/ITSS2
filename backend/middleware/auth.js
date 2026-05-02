const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware xác thực JWT token
const protect = async (req, res, next) => {
  let token;

  // Lấy token từ header Authorization: Bearer <token>
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Bạn chưa đăng nhập' });
  }

  try {
    // Giải mã token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Gắn user vào request
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return res.status(401).json({ message: 'Người dùng không tồn tại' });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token không hợp lệ' });
  }
};

// Middleware kiểm tra role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Role '${req.user.role}' không có quyền truy cập` 
      });
    }
    next();
  };
};

module.exports = { protect, authorize };

const mongoose = require('mongoose');

// Schema hồ sơ sinh viên - CV và thông tin cá nhân
const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // Mỗi sinh viên chỉ có 1 profile
  },
  bio: {
    type: String,
    maxlength: 1000,
    default: ''
  },
  skills: [{
    type: String,
    trim: true
    // Ví dụ: JavaScript, React, Python, Machine Learning...
  }],
  experience: {
    type: String,
    default: ''
    // Mô tả kinh nghiệm làm việc/dự án
  },
  education: {
    type: String,
    default: ''
    // Trường, ngành học, năm
  },
  githubLink: {
    type: String,
    default: ''
  },
  cvText: {
    type: String,
    default: ''
    // Nội dung CV dạng text
  },
  cvFileUrl: {
    type: String,
    default: ''
    // URL file CV đã upload
  },
  phone: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Profile', profileSchema);

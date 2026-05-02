const mongoose = require('mongoose');

// Schema doanh nghiệp - thông tin chi tiết về công ty
const companySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // Mỗi user company chỉ có 1 company profile
  },
  name: {
    type: String,
    required: [true, 'Vui lòng nhập tên công ty'],
    trim: true,
    maxlength: 200
  },
  field: {
    type: String,
    required: [true, 'Vui lòng nhập lĩnh vực'],
    trim: true
    // Ví dụ: IT, AI, Web Development, Mobile, Data Science...
  },
  description: {
    type: String,
    required: [true, 'Vui lòng nhập mô tả'],
    maxlength: 5000
  },
  address: {
    type: String,
    required: [true, 'Vui lòng nhập địa chỉ'],
    trim: true
  },
  technologies: [{
    type: String,
    trim: true
    // Ví dụ: React, Node.js, Python, Java, Docker...
  }],
  website: {
    type: String,
    default: ''
  },
  logo: {
    type: String,
    default: ''
  },
  employeeCount: {
    type: String,
    default: ''
    // Ví dụ: "10-50", "50-200", "200+"
  }
}, {
  timestamps: true
});

// Text index cho tìm kiếm
companySchema.index({ name: 'text', field: 'text', description: 'text' });

module.exports = mongoose.model('Company', companySchema);

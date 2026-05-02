const mongoose = require('mongoose');

// Schema việc làm / dự án - do doanh nghiệp đăng
const jobSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Vui lòng nhập tiêu đề'],
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: [true, 'Vui lòng nhập mô tả'],
    maxlength: 5000
  },
  requirements: [{
    type: String,
    trim: true
  }],
  technologies: [{
    type: String,
    trim: true
  }],
  type: {
    type: String,
    enum: ['internship', 'fulltime', 'parttime', 'project'],
    default: 'internship'
  },
  salary: {
    type: String,
    default: 'Thỏa thuận'
  },
  location: {
    type: String,
    default: ''
  },
  deadline: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Job', jobSchema);

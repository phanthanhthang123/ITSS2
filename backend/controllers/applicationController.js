const Application = require('../models/Application');
const Job = require('../models/Job');
const Company = require('../models/Company');

// @desc    Sinh viên apply vào job
// @route   POST /api/applications
exports.apply = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;

    // Kiểm tra job tồn tại và đang mở
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Không tìm thấy job' });
    }
    if (job.status === 'closed') {
      return res.status(400).json({ message: 'Job đã đóng' });
    }

    // Kiểm tra đã apply chưa
    const existing = await Application.findOne({
      jobId,
      studentId: req.user._id
    });
    if (existing) {
      return res.status(400).json({ message: 'Bạn đã apply job này rồi' });
    }

    const application = await Application.create({
      jobId,
      studentId: req.user._id,
      coverLetter
    });

    await application.populate([
      { path: 'jobId', select: 'title type', populate: { path: 'companyId', select: 'name' } },
      { path: 'studentId', select: 'name email' }
    ]);

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Lấy danh sách applications
// @route   GET /api/applications
// Sinh viên: xem applications của mình
// Company: xem applications cho jobs của mình
exports.getApplications = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'student') {
      // Sinh viên xem applications của mình
      query.studentId = req.user._id;
    } else if (req.user.role === 'company') {
      // Company xem applications cho jobs của mình
      const company = await Company.findOne({ userId: req.user._id });
      if (!company) {
        return res.json([]);
      }
      const jobIds = await Job.find({ companyId: company._id }).distinct('_id');
      query.jobId = { $in: jobIds };
    }

    const applications = await Application.find(query)
      .populate({
        path: 'jobId',
        select: 'title type companyId',
        populate: { path: 'companyId', select: 'name logo' }
      })
      .populate('studentId', 'name email')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Company cập nhật trạng thái application (accept/reject)
// @route   PATCH /api/applications/:id
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status không hợp lệ' });
    }

    const application = await Application.findById(req.params.id)
      .populate('jobId');

    if (!application) {
      return res.status(404).json({ message: 'Không tìm thấy application' });
    }

    // Kiểm tra quyền: chỉ company sở hữu job mới được cập nhật
    const company = await Company.findOne({ userId: req.user._id });
    if (!company || application.jobId.companyId.toString() !== company._id.toString()) {
      return res.status(403).json({ message: 'Không có quyền' });
    }

    application.status = status;
    await application.save();

    await application.populate([
      { path: 'jobId', select: 'title type', populate: { path: 'companyId', select: 'name logo' } },
      { path: 'studentId', select: 'name email' }
    ]);

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

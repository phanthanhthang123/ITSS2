const Job = require('../models/Job');
const Company = require('../models/Company');

// @desc    Lấy danh sách jobs
// @route   GET /api/jobs?type=&tech=&companyId=
exports.getJobs = async (req, res) => {
  try {
    const { type, tech, companyId, keyword } = req.query;
    let query = { status: 'open' };

    if (type) query.type = type;
    if (companyId) query.companyId = companyId;
    if (tech) query.technologies = { $regex: tech, $options: 'i' };
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }

    const jobs = await Job.find(query)
      .populate({
        path: 'companyId',
        select: 'name field logo address'
      })
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Lấy chi tiết 1 job
// @route   GET /api/jobs/:id
exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate({
        path: 'companyId',
        select: 'name field logo address description technologies website'
      });

    if (!job) {
      return res.status(404).json({ message: 'Không tìm thấy job' });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Tạo job mới (company only)
// @route   POST /api/jobs
exports.createJob = async (req, res) => {
  try {
    // Tìm company profile của user
    const company = await Company.findOne({ userId: req.user._id });
    if (!company) {
      return res.status(400).json({ message: 'Bạn cần tạo company profile trước' });
    }

    const job = await Job.create({
      ...req.body,
      companyId: company._id
    });

    // Populate company info trước khi trả về
    await job.populate('companyId', 'name field logo address');

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Cập nhật job
// @route   PUT /api/jobs/:id
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('companyId');

    if (!job) {
      return res.status(404).json({ message: 'Không tìm thấy job' });
    }

    // Chỉ owner company mới được update
    if (job.companyId.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Không có quyền chỉnh sửa' });
    }

    const updated = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('companyId', 'name field logo address');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Lấy jobs của company hiện tại
// @route   GET /api/jobs/my-jobs
exports.getMyJobs = async (req, res) => {
  try {
    const company = await Company.findOne({ userId: req.user._id });
    if (!company) {
      return res.status(404).json({ message: 'Chưa tạo company profile' });
    }

    const jobs = await Job.find({ companyId: company._id })
      .populate('companyId', 'name field logo address')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

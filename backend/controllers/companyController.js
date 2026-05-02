const Company = require('../models/Company');

// @desc    Lấy danh sách doanh nghiệp + tìm kiếm
// @route   GET /api/companies?keyword=&field=&tech=
exports.getCompanies = async (req, res) => {
  try {
    const { keyword, field, tech } = req.query;
    let query = {};

    // Tìm theo keyword (tên công ty hoặc mô tả)
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }

    // Tìm theo lĩnh vực
    if (field) {
      query.field = { $regex: field, $options: 'i' };
    }

    // Tìm theo công nghệ
    if (tech) {
      query.technologies = { $regex: tech, $options: 'i' };
    }

    const companies = await Company.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Lấy chi tiết 1 doanh nghiệp
// @route   GET /api/companies/:id
exports.getCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id)
      .populate('userId', 'name email');

    if (!company) {
      return res.status(404).json({ message: 'Không tìm thấy doanh nghiệp' });
    }

    res.json(company);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Tạo company profile
// @route   POST /api/companies
exports.createCompany = async (req, res) => {
  try {
    // Kiểm tra đã có company profile chưa
    const existing = await Company.findOne({ userId: req.user._id });
    if (existing) {
      return res.status(400).json({ message: 'Bạn đã có company profile' });
    }

    const company = await Company.create({
      ...req.body,
      userId: req.user._id
    });

    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Cập nhật company profile
// @route   PUT /api/companies/:id
exports.updateCompany = async (req, res) => {
  try {
    let company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ message: 'Không tìm thấy doanh nghiệp' });
    }

    // Chỉ owner mới được update
    if (company.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Không có quyền chỉnh sửa' });
    }

    company = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json(company);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Lấy company profile của user hiện tại
// @route   GET /api/companies/me
exports.getMyCompany = async (req, res) => {
  try {
    const company = await Company.findOne({ userId: req.user._id });
    if (!company) {
      return res.status(404).json({ message: 'Chưa tạo company profile' });
    }
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

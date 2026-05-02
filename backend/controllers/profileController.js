const Profile = require('../models/Profile');

// @desc    Tạo hoặc cập nhật profile sinh viên
// @route   POST /api/profile
exports.createOrUpdateProfile = async (req, res) => {
  try {
    const { bio, skills, experience, education, githubLink, cvText, phone, address } = req.body;

    const profileData = {
      userId: req.user._id,
      bio, skills, experience, education, githubLink, cvText, phone, address
    };

    // Upsert: tạo mới nếu chưa có, cập nhật nếu đã có
    let profile = await Profile.findOne({ userId: req.user._id });

    if (profile) {
      profile = await Profile.findOneAndUpdate(
        { userId: req.user._id },
        profileData,
        { new: true, runValidators: true }
      );
    } else {
      profile = await Profile.create(profileData);
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Lấy profile của user hiện tại
// @route   GET /api/profile/me
exports.getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user._id })
      .populate('userId', 'name email role');

    if (!profile) {
      return res.status(404).json({ message: 'Chưa tạo profile' });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Lấy profile theo userId
// @route   GET /api/profile/:userId
exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId })
      .populate('userId', 'name email role');

    if (!profile) {
      return res.status(404).json({ message: 'Không tìm thấy profile' });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

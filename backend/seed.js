require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Company = require('./models/Company');
const Profile = require('./models/Profile');
const Job = require('./models/Job');

// Dữ liệu mẫu để demo
const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB');

    // Xóa dữ liệu cũ
    await User.deleteMany({});
    await Company.deleteMany({});
    await Profile.deleteMany({});
    await Job.deleteMany({});
    console.log('🗑️  Cleared old data');

    // ===== TẠO USERS =====
    const students = await User.create([
      { name: 'Nguyễn Văn An', email: 'an@student.com', password: '123456', role: 'student' },
      { name: 'Trần Thị Bình', email: 'binh@student.com', password: '123456', role: 'student' },
      { name: 'Lê Minh Cường', email: 'cuong@student.com', password: '123456', role: 'student' }
    ]);

    const companyUsers = await User.create([
      { name: 'TechVN Admin', email: 'techvn@company.com', password: '123456', role: 'company' },
      { name: 'AI Solutions Admin', email: 'ai@company.com', password: '123456', role: 'company' },
      { name: 'WebDev Corp Admin', email: 'webdev@company.com', password: '123456', role: 'company' },
      { name: 'DataPro Admin', email: 'datapro@company.com', password: '123456', role: 'company' },
      { name: 'CloudTech Admin', email: 'cloud@company.com', password: '123456', role: 'company' },
      { name: 'MobileDev Admin', email: 'mobile@company.com', password: '123456', role: 'company' }
    ]);
    console.log('👤 Created users');

    // ===== TẠO COMPANIES =====
    const companies = await Company.create([
      {
        userId: companyUsers[0]._id,
        name: 'TechVN Solutions',
        field: 'IT Outsourcing',
        description: 'Công ty hàng đầu về outsourcing phần mềm tại Việt Nam. Chúng tôi cung cấp giải pháp công nghệ cho các doanh nghiệp toàn cầu với đội ngũ 200+ kỹ sư giàu kinh nghiệm.',
        address: 'Tầng 15, Tòa nhà Landmark 72, Hà Nội',
        technologies: ['React', 'Node.js', 'Java', 'AWS', 'Docker'],
        website: 'https://techvn.example.com',
        employeeCount: '200-500'
      },
      {
        userId: companyUsers[1]._id,
        name: 'AI Solutions JSC',
        field: 'Artificial Intelligence',
        description: 'Tiên phong trong lĩnh vực AI và Machine Learning tại Đông Nam Á. Phát triển các giải pháp chatbot, computer vision và NLP cho doanh nghiệp.',
        address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
        technologies: ['Python', 'TensorFlow', 'PyTorch', 'Docker', 'Kubernetes'],
        website: 'https://aisolutions.example.com',
        employeeCount: '50-200'
      },
      {
        userId: companyUsers[2]._id,
        name: 'WebDev Creative',
        field: 'Web Development',
        description: 'Agency thiết kế và phát triển website chuyên nghiệp. Đội ngũ sáng tạo, luôn cập nhật xu hướng mới nhất trong thiết kế UX/UI.',
        address: '456 Lê Lợi, Quận 3, TP.HCM',
        technologies: ['React', 'Vue.js', 'Next.js', 'Figma', 'TypeScript'],
        website: 'https://webdev.example.com',
        employeeCount: '10-50'
      },
      {
        userId: companyUsers[3]._id,
        name: 'DataPro Analytics',
        field: 'Data Science',
        description: 'Chuyên gia phân tích dữ liệu lớn. Cung cấp dịch vụ BI, data warehouse và predictive analytics cho các tập đoàn lớn.',
        address: '789 Trần Hưng Đạo, Đà Nẵng',
        technologies: ['Python', 'R', 'SQL', 'Spark', 'Tableau'],
        website: 'https://datapro.example.com',
        employeeCount: '50-200'
      },
      {
        userId: companyUsers[4]._id,
        name: 'CloudTech Vietnam',
        field: 'Cloud Computing',
        description: 'Nhà cung cấp dịch vụ đám mây hàng đầu. Giải pháp IaaS, PaaS, và SaaS cho doanh nghiệp mọi quy mô.',
        address: '321 Hai Bà Trưng, Hà Nội',
        technologies: ['AWS', 'Azure', 'GCP', 'Terraform', 'Go'],
        website: 'https://cloudtech.example.com',
        employeeCount: '200-500'
      },
      {
        userId: companyUsers[5]._id,
        name: 'MobileDev Studio',
        field: 'Mobile Development',
        description: 'Studio phát triển ứng dụng di động đa nền tảng. Chuyên về iOS, Android và cross-platform với React Native và Flutter.',
        address: '567 Nguyễn Trãi, Hà Nội',
        technologies: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase'],
        website: 'https://mobiledev.example.com',
        employeeCount: '10-50'
      }
    ]);
    console.log('🏢 Created companies');

    // ===== TẠO STUDENT PROFILES =====
    await Profile.create([
      {
        userId: students[0]._id,
        bio: 'Sinh viên năm 3 ngành CNTT, đam mê web development và open source.',
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'Git'],
        experience: '6 tháng thực tập tại công ty ABC. Tham gia 3 dự án freelance.',
        education: 'Đại học Bách Khoa Hà Nội - CNTT',
        githubLink: 'https://github.com/nguyenvanan',
        cvText: 'Sinh viên năm 3 với kinh nghiệm thực tập. Thành thạo JavaScript, React.'
      },
      {
        userId: students[1]._id,
        bio: 'Sinh viên năm 4 chuyên ngành AI/ML. Yêu thích nghiên cứu và phát triển mô hình AI.',
        skills: ['Python', 'TensorFlow', 'Machine Learning', 'SQL', 'Docker'],
        experience: '1 năm nghiên cứu tại lab AI. 2 papers published.',
        education: 'Đại học Công Nghệ - ĐHQGHN - Trí Tuệ Nhân Tạo',
        githubLink: 'https://github.com/tranthibinh'
      },
      {
        userId: students[2]._id,
        bio: 'Sinh viên năm 3, đam mê mobile development và UX design.',
        skills: ['React Native', 'Flutter', 'Figma', 'TypeScript', 'Firebase'],
        experience: 'Tự phát triển 2 ứng dụng trên Play Store.',
        education: 'Đại học FPT - Kỹ thuật Phần mềm',
        githubLink: 'https://github.com/leminhcuong'
      }
    ]);
    console.log('📝 Created profiles');

    // ===== TẠO JOBS =====
    await Job.create([
      {
        companyId: companies[0]._id,
        title: 'Frontend Developer Intern',
        description: 'Tham gia phát triển giao diện web cho các dự án outsourcing quốc tế. Được mentoring bởi senior dev.',
        requirements: ['Biết React hoặc Vue.js', 'HTML/CSS cơ bản', 'Git', 'Tiếng Anh giao tiếp'],
        technologies: ['React', 'TypeScript', 'CSS', 'Git'],
        type: 'internship',
        salary: '5-8 triệu/tháng',
        location: 'Hà Nội',
        deadline: new Date('2025-12-31')
      },
      {
        companyId: companies[0]._id,
        title: 'Backend Developer (Node.js)',
        description: 'Phát triển và bảo trì RESTful APIs cho hệ thống e-commerce. Làm việc với microservices architecture.',
        requirements: ['Node.js/Express', 'MongoDB/PostgreSQL', 'Docker cơ bản', 'Hiểu REST API'],
        technologies: ['Node.js', 'Express', 'MongoDB', 'Docker'],
        type: 'fulltime',
        salary: '15-25 triệu/tháng',
        location: 'Hà Nội'
      },
      {
        companyId: companies[1]._id,
        title: 'AI Research Intern',
        description: 'Nghiên cứu và phát triển mô hình NLP cho chatbot thông minh. Được tiếp cận dữ liệu thực tế.',
        requirements: ['Python', 'Machine Learning cơ bản', 'Linear Algebra', 'Đam mê AI'],
        technologies: ['Python', 'PyTorch', 'Hugging Face', 'Docker'],
        type: 'internship',
        salary: '6-10 triệu/tháng',
        location: 'TP.HCM',
        deadline: new Date('2025-11-30')
      },
      {
        companyId: companies[2]._id,
        title: 'UI/UX Designer + Frontend',
        description: 'Thiết kế giao diện và code frontend cho các dự án web app sáng tạo.',
        requirements: ['Figma proficient', 'React/Vue', 'CSS Animation', 'Responsive Design'],
        technologies: ['React', 'Figma', 'CSS', 'GSAP'],
        type: 'project',
        salary: '10-15 triệu/dự án',
        location: 'Remote'
      },
      {
        companyId: companies[3]._id,
        title: 'Data Analyst Intern',
        description: 'Phân tích dữ liệu kinh doanh, tạo dashboard và báo cáo cho khách hàng doanh nghiệp.',
        requirements: ['SQL', 'Python/R', 'Excel nâng cao', 'Visualization tools'],
        technologies: ['Python', 'SQL', 'Tableau', 'Power BI'],
        type: 'internship',
        salary: '5-8 triệu/tháng',
        location: 'Đà Nẵng'
      },
      {
        companyId: companies[4]._id,
        title: 'DevOps Engineer',
        description: 'Xây dựng và quản lý hạ tầng cloud, CI/CD pipeline cho các dự án lớn.',
        requirements: ['Linux', 'AWS/Azure', 'Docker & K8s', 'CI/CD tools'],
        technologies: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins'],
        type: 'fulltime',
        salary: '20-35 triệu/tháng',
        location: 'Hà Nội'
      },
      {
        companyId: companies[5]._id,
        title: 'Mobile Developer (React Native)',
        description: 'Phát triển ứng dụng mobile cross-platform cho startup fintech.',
        requirements: ['React Native', 'JavaScript/TypeScript', 'REST API', 'Mobile UI/UX'],
        technologies: ['React Native', 'TypeScript', 'Firebase', 'Redux'],
        type: 'parttime',
        salary: '12-18 triệu/tháng',
        location: 'Remote',
        deadline: new Date('2025-12-15')
      }
    ]);
    console.log('💼 Created jobs');

    console.log('\n✅ Seed hoàn tất!');
    console.log('\n📋 Tài khoản demo:');
    console.log('   Student: an@student.com / 123456');
    console.log('   Student: binh@student.com / 123456');
    console.log('   Company: techvn@company.com / 123456');
    console.log('   Company: ai@company.com / 123456');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();

# StuBiz Connect - Nền tảng kết nối Sinh viên và Doanh nghiệp

Đây là dự án MVP (Minimum Viable Product) giúp kết nối sinh viên IT với các doanh nghiệp, cung cấp các tính năng tìm kiếm việc làm/thực tập, nộp hồ sơ, đăng tin tuyển dụng và đặc biệt là hệ thống chat realtime trực tiếp giữa doanh nghiệp và ứng viên.

## 🚀 Công nghệ sử dụng
- **Frontend**: React (Vite), React Router, Axios, CSS Modules (Custom Design System).
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Realtime**: Socket.io.
- **Authentication**: JWT (JSON Web Tokens).

## 📋 Yêu cầu hệ thống
- Node.js (phiên bản v18 trở lên khuyến nghị).
- MongoDB (cài đặt local hoặc sử dụng MongoDB Atlas).

## 🛠️ Hướng dẫn cài đặt và chạy dự án

### Bước 1: Clone dự án
```bash
git clone https://github.com/phanthanhthang123/ITSS2.git
cd ITSS2
```

### Bước 2: Cài đặt Backend
1. Di chuyển vào thư mục backend và cài đặt các thư viện:
```bash
cd backend
npm install
```

2. Cấu hình biến môi trường:
Trong thư mục `backend`, đã có sẵn file `.env`. Nếu chưa có, bạn tạo file `.env` với nội dung sau:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/student_business_connect
JWT_SECRET=sbc_jwt_secret_key_2024_mvp
```
*(Lưu ý: Thay đổi `MONGODB_URI` nếu bạn sử dụng MongoDB Atlas).*

3. Khởi tạo dữ liệu mẫu (Seed Data):
Để tiện test hệ thống, bạn có thể chạy lệnh sau để tự động tạo các doanh nghiệp, hồ sơ sinh viên, công việc và tài khoản demo:
```bash
npm run seed
```

### Bước 3: Cài đặt Frontend
Mở một terminal mới (hoặc tab mới), di chuyển vào thư mục frontend và cài đặt:
```bash
cd frontend
npm install
```

### Bước 4: Khởi động hệ thống

1. Khởi động Backend server (chạy ở cổng 5000):
```bash
cd backend
npm run dev
```

2. Khởi động Frontend server (chạy ở cổng 5173):
```bash
cd frontend
npm run dev
```

3. Mở trình duyệt và truy cập: `http://localhost:5173`

---

## 🔑 Tài khoản Demo (nếu đã chạy lệnh npm run seed)

**Tài khoản Sinh viên:**
- Email: `an@student.com`
- Email: `binh@student.com`
- Password (cho tất cả): `123456`

**Tài khoản Doanh nghiệp:**
- Email: `techvn@company.com`
- Email: `ai@company.com`
- Password (cho tất cả): `123456`

*(Tại trang đăng nhập của Frontend, có sẵn các nút bấm nhanh để điền tài khoản demo).*

## 🌟 Các tính năng chính
1. **Quản lý Auth**: Đăng nhập/Đăng ký theo vai trò (Sinh viên/Doanh nghiệp).
2. **Hồ sơ cá nhân**: 
   - Sinh viên: Tạo/Cập nhật profile, kỹ năng, kinh nghiệm.
   - Doanh nghiệp: Thiết lập thông tin công ty, quy mô, lĩnh vực, công nghệ.
3. **Tuyển dụng**:
   - Doanh nghiệp: Đăng/Sửa tin tuyển dụng (Việc làm, Thực tập, Dự án).
   - Sinh viên: Tìm kiếm tin tuyển dụng (có filter theo lĩnh vực, công nghệ), nộp thư xin việc.
4. **Quản lý ứng viên**: Doanh nghiệp duyệt/từ chối đơn ứng tuyển.
5. **Real-time Chat**: Hệ thống nhắn tin trực tiếp giữa Doanh nghiệp và Sinh viên ngay trên nền tảng với Socket.io (Hỗ trợ trạng thái "đang nhập tin nhắn").

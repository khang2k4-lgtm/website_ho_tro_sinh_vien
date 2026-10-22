# PHÂN TÍCH CHI TIẾT LUỒNG CHỨC NĂNG HUMG PORTAL

Tài liệu này mô tả cách một thao tác của người dùng đi qua toàn bộ hệ thống: giao diện React, thư viện gọi API, proxy, Express route, middleware, Prisma, SQLite và response quay lại frontend.

## 1. Kiến trúc xử lý chung

```text
Người dùng thao tác trên trình duyệt
        |
        v
React component / event handler
        |
        v
AuthContext hoặc service API
        |
        v
Axios client: frontend/src/services/api.js
        |
        v
Vite proxy: /api -> http://localhost:5000
        |
        v
Express app: backend/src/index.js
        |
        v
Router nghiệp vụ
        |
        +--> authMiddleware: kiểm tra JWT
        |
        +--> requireRoles: kiểm tra vai trò
        |
        +--> multer: xử lý file multipart nếu có
        |
        v
Prisma Client: truy vấn/mutate SQLite
        |
        v
JSON response hoặc lỗi HTTP
        |
        v
Axios Promise -> React state/localStorage -> render lại giao diện
```

## 2. Các thư viện và nhiệm vụ

| Thư viện/công nghệ | Vị trí | Nhiệm vụ |
|---|---|---|
| React | frontend | Tạo component, state và giao diện |
| React Router | `frontend/src/App.jsx` | Điều hướng theo URL, route bảo vệ |
| Axios | `frontend/src/services/api.js` | Gửi HTTP request tới backend |
| Vite | `frontend/vite.config.js` | Chạy frontend và proxy `/api`, `/uploads` |
| Express | `backend/src/index.js` | Tạo HTTP server và router |
| CORS | backend | Cho phép frontend gọi backend khác origin |
| dotenv | backend | Đọc biến môi trường |
| jsonwebtoken | `middleware/auth.js` | Tạo và kiểm tra JWT |
| bcryptjs | `routes/auth.js` | Hash và so sánh mật khẩu |
| Prisma Client | `backend/src/lib/prisma.js` | ORM truy cập SQLite |
| SQLite | `backend/prisma` | Lưu dữ liệu nghiệp vụ |
| multer | `middleware/upload.js` | Nhận và lưu file upload |
| Leaflet/react-leaflet | frontend | Hiển thị bản đồ phòng ban |
| Recharts | frontend | Hiển thị biểu đồ dashboard/báo cáo |
| lucide-react | frontend | Icon giao diện |

## 3. Khởi động và kết nối hệ thống

### 3.1. Khởi động frontend

1. Chạy `npm run dev` trong thư mục `frontend`.
2. Vite đọc `vite.config.js`.
3. Vite chạy frontend tại port `5173`.
4. Request `/api/...` được proxy tới `http://localhost:5000`.
5. Request `/uploads/...` cũng được proxy tới backend.

### 3.2. Khởi động backend

1. Chạy `npm run dev` hoặc `npm start` trong thư mục `backend`.
2. `backend/src/index.js` tạo Express app.
3. `cors()` cho phép request từ frontend.
4. `express.json()` đọc body JSON.
5. `express.static()` phục vụ file trong `backend/uploads`.
6. Các router được mount dưới `/api/...`.
7. Server lắng nghe port trong `process.env.PORT`, mặc định `5000`.

### 3.3. Khởi tạo database

1. Prisma đọc `DATABASE_URL` từ biến môi trường.
2. `prisma db push` đồng bộ schema với SQLite.
3. `prisma generate` tạo Prisma Client.
4. `node prisma/seed.js` tạo dữ liệu mẫu.
5. `npm run db:refresh` chạy seed cưỡng chế và nạp lại dữ liệu mẫu.

## 4. Axios và cơ chế request chung

File `frontend/src/services/api.js` tạo một Axios instance:

```js
baseURL: '/api'
headers: { 'Content-Type': 'application/json' }
```

### Request interceptor

Trước mỗi request:

1. Đọc `token` từ `localStorage`.
2. Nếu có token, thêm header:

```text
Authorization: Bearer <token>
```

3. Request đi tới `/api/...`.
4. Vite chuyển request sang backend port `5000`.

### Response interceptor

Nếu backend trả `401` và localStorage đang có token:

1. Xóa `token`.
2. Xóa `user`.
3. Nếu đang không ở trang đăng nhập, chuyển trình duyệt tới `/dang-nhap`.
4. Promise vẫn bị reject để component có thể xử lý lỗi riêng.

Nếu response không lỗi, Axios trả response cho `.then()` hoặc kết quả `await`.

## 5. Luồng xác thực và phiên đăng nhập

### 5.1. Luồng đăng nhập đầy đủ

Ví dụ người dùng nhập:

```text
email = sv001@humg.edu.vn
password = 123456
```

#### Bước 1: giao diện

1. Người dùng mở `/dang-nhap`.
2. React Router render component `Login`.
3. `Login` giữ email, password, error và loading bằng `useState`.
4. Người dùng ấn nút đăng nhập.
5. `handleSubmit` gọi `event.preventDefault()` để không reload trang.
6. `handleSubmit` gọi `login(email, password)` từ `useAuth()`.

#### Bước 2: AuthContext

1. Hàm `login` trong `AuthContext.jsx` gọi:

```js
api.post('/auth/login', { email, password })
```

2. Axios tự thêm `Authorization` nếu có token cũ.
3. Request thực tế là `POST /api/auth/login`.

#### Bước 3: Vite và Express

1. Vite nhận request `/api/auth/login`.
2. Proxy chuyển tới `http://localhost:5000/api/auth/login`.
3. Express nhận request tại router auth được mount bằng:

```js
app.use('/api/auth', authRoutes)
```

4. Router khớp `POST /login` trong `backend/src/routes/auth.js`.

#### Bước 4: Prisma tìm tài khoản

Backend lấy `email` và `password` từ `req.body`.

1. Gọi Prisma:

```js
prisma.user.findUnique({ where: { email } })
```

2. Prisma chuyển lệnh sang truy vấn SQLite bảng `users`.
3. Nếu không có user hoặc `isActive = false`, trả HTTP `401`.

#### Bước 5: bcryptjs kiểm tra mật khẩu

1. Database không lưu mật khẩu thô mà lưu chuỗi hash.
2. Backend gọi:

```js
bcrypt.compare(password, user.password)
```

3. `bcryptjs` so sánh mật khẩu người dùng nhập với hash trong database.
4. Sai mật khẩu trả `401` với message `Email hoặc mật khẩu không đúng`.

#### Bước 6: jsonwebtoken tạo token

Nếu đúng:

1. Backend loại bỏ trường `password` khỏi user trả về.
2. Gọi `generateToken(safeUser)`.
3. `jsonwebtoken.sign()` tạo JWT gồm `id`, `email`, `role`.
4. JWT có thời hạn `7d`, dùng `JWT_SECRET`.
5. Backend trả:

```json
{
  "user": {
    "id": "...",
    "email": "sv001@humg.edu.vn",
    "fullName": "Nguyễn Văn A",
    "role": "STUDENT"
  },
  "token": "eyJ..."
}
```

#### Bước 7: quay về frontend

1. Axios nhận HTTP `200`.
2. `AuthContext.login` lấy `data.token` và `data.user`.
3. Lưu cả hai vào localStorage.
4. Gọi `setUser(data.user)`.
5. Trả user cho component `Login`.
6. `Login` kiểm tra role:
   - `STAFF`, `DEPT_MANAGER`, `ADMIN` -> `/dashboard`.
   - `STUDENT` -> `/tai-khoan`.
7. React Router đổi route và render trang mới.

### 5.2. Luồng đăng ký

1. `Register` thu thập `fullName`, `email`, `password`, `studentId`, `faculty`, `major`, `className`, `phone`.
2. Người dùng ấn đăng ký.
3. Component gọi `register(form)` trong `AuthContext`.
4. AuthContext gọi `POST /api/auth/register`.
5. Backend kiểm tra `email`, `password`, `fullName`.
6. Prisma tìm email trùng bằng `user.findUnique`.
7. Nếu trùng trả `400`.
8. `bcrypt.hash(password, 10)` tạo hash.
9. Prisma `user.create` tạo user role mặc định `STUDENT`.
10. Backend tạo JWT.
11. Response gồm `user` và `token`.
12. Frontend lưu localStorage, set user và chuyển `/tai-khoan`.

### 5.3. Kiểm tra phiên khi reload trang

1. `AuthProvider` khởi tạo user từ localStorage.
2. Nếu có token, `loading = true`.
3. `useEffect` gọi `GET /api/auth/me`.
4. Axios thêm Bearer token.
5. `authMiddleware` giải mã JWT bằng `jwt.verify`.
6. Backend dùng `req.user.id` để tìm user.
7. Prisma trả thông tin user qua `userSelect`.
8. Frontend cập nhật state và localStorage.
9. Nếu lỗi, xóa token/user và coi là chưa đăng nhập.
10. `loading = false`.

### 5.4. Route bảo vệ

`ProtectedRoute` lấy `user` và `loading` từ `AuthContext`.

- Đang kiểm tra phiên: hiển thị `Đang tải...`.
- Không có user: chuyển `/dang-nhap`.
- Có `roles` nhưng role không phù hợp: chuyển `/`.
- Hợp lệ: render component con.

Route dashboard dùng:

```jsx
<ProtectedRoute roles={STAFF_ROLES}>
  <DashboardLayout />
</ProtectedRoute>
```

### 5.5. Đổi mật khẩu

1. Người dùng gửi mật khẩu cũ và mới từ `AccountPage`.
2. Frontend gọi `PUT /api/auth/change-password`.
3. Axios thêm JWT.
4. `authMiddleware` xác định user.
5. Prisma lấy user hiện tại.
6. `bcrypt.compare(currentPassword, user.password)` kiểm tra mật khẩu cũ.
7. Nếu sai trả `400`.
8. `bcrypt.hash(newPassword, 10)` tạo hash mới.
9. Prisma update trường `password`.
10. Tạo `AuditLog` hành động `CHANGE_PASSWORD`.
11. Trả message thành công.

### 5.6. Sửa hồ sơ cá nhân

1. `AccountPage` gửi `fullName`, `phone`, `faculty`, `major`, `className`, `avatar`.
2. Gọi `PUT /api/auth/profile`.
3. `authMiddleware` xác định `req.user.id`.
4. Prisma update đúng user.
5. Backend trả user đã chọn bằng `userSelect`.
6. Frontend gọi `updateUser`, cập nhật state và localStorage.

## 6. Luồng dịch vụ

### 6.1. Danh sách dịch vụ

1. `ServiceList` render và gọi `GET /api/services`.
2. Backend đọc query filter nếu có.
3. Prisma `service.findMany` lấy service đang active, kèm department.
4. Backend trả mảng JSON.
5. React lưu vào state.
6. Người dùng lọc/sắp xếp trên giao diện hoặc gửi query mới.

### 6.2. Chi tiết dịch vụ

1. Người dùng bấm một service.
2. React Router lấy `slug` từ URL.
3. `ServiceDetail` gọi `GET /api/services/:slug`.
4. Prisma `service.findUnique` theo slug.
5. Backend include department, documents, ratings và dữ liệu liên quan.
6. Response chứa tên, mô tả, category, giấy tờ, bước, thời gian, phí, phòng ban.
7. Frontend hiển thị nút nộp hồ sơ nếu người dùng phù hợp.

### 6.3. Tạo/sửa/xóa dịch vụ

1. Dashboard gửi form tới `POST /api/services` hoặc `PUT /api/services/:id`.
2. `authMiddleware` xác thực.
3. `requireRoles('ADMIN', 'DEPT_MANAGER')` kiểm tra quyền.
4. Prisma create/update bảng `services`.
5. Ghi audit log cho thao tác quản trị.
6. Xóa dịch vụ dùng `DELETE` nhưng thực tế là vô hiệu hóa `isActive`, không xóa vật lý.
7. Chỉ `ADMIN` được xóa/vô hiệu hóa.

## 7. Luồng nộp và xử lý hồ sơ

### 7.1. Mở form hồ sơ

1. Người dùng bấm nộp hồ sơ tại chi tiết dịch vụ.
2. React Router đi tới `/nop-ho-so/:slug`.
3. `ProtectedRoute` kiểm tra đăng nhập.
4. `ApplicationForm` tải service theo slug.
5. Component đọc `formFields`, `requiredDocs`, `steps` để dựng form.

### 7.2. Gửi hồ sơ không có file

1. Sinh viên điền dữ liệu động.
2. Component tạo `formData` JSON.
3. Axios gửi `POST /api/applications`.
4. Backend đi qua `authMiddleware` và `requireRoles('STUDENT')`.
5. Middleware upload bỏ qua nếu content type không phải multipart.
6. Backend lấy `serviceId`, `formData`, `note` từ body.
7. Gọi `generateCode('HD')` tạo mã.
8. Prisma tạo `Application`.
9. Nested create tạo `ApplicationStatusHistory` trạng thái `SUBMITTED`.
10. Tạo audit log `SUBMIT`.
11. Trả HTTP `201` cùng application và service.
12. Frontend thông báo thành công và chuyển tới trang hồ sơ.

### 7.3. Gửi hồ sơ có file

1. Component tạo `FormData` browser.
2. Append `serviceId`, `formData`, `note`, `attachments`.
3. Request dùng multipart form data.
4. `multer` nhận file trong `upload.array('attachments', 5)`.
5. File được lưu bằng `diskStorage` vào `backend/uploads`.
6. Tên file gồm timestamp, số ngẫu nhiên và phần mở rộng gốc.
7. File bị từ chối nếu quá 10 MB hoặc đuôi không nằm trong JPG, JPEG, PNG, GIF, PDF, DOC, DOCX, XLS, XLSX.
8. Backend tạo URL `/uploads/<filename>`.
9. Danh sách URL được lưu trong trường JSON `attachments`.
10. Các bước còn lại giống luồng gửi hồ sơ không có file.

### 7.4. Xem danh sách hồ sơ

1. `MyApplications` gọi `GET /api/applications`.
2. Sinh viên có JWT.
3. Backend đặt `where.studentId = req.user.id`.
4. Prisma lấy application, service, student, assignedTo và statusHistory.
5. Trả danh sách mới nhất trước.
6. Role xử lý không bị lọc theo student và được xem toàn bộ hồ sơ.

### 7.5. Xem chi tiết hồ sơ

1. Frontend lấy `id` từ URL `/ho-so/:id` hoặc dashboard.
2. Gọi `GET /api/applications/:id`.
3. Prisma include service/department, student, assignedTo, history, rating.
4. Nếu student không sở hữu hồ sơ, backend trả `403`.
5. Frontend dựng timeline từ statusHistory và hiển thị file đính kèm.

### 7.6. Nhân viên cập nhật hồ sơ

1. Nhân viên chọn trạng thái, ghi chú, lý do từ chối.
2. Frontend gửi `PATCH /api/applications/:id/status`.
3. Middleware xác thực JWT.
4. `requireRoles('STAFF', 'DEPT_MANAGER', 'ADMIN')` kiểm tra quyền.
5. Prisma update Application.
6. `assignedToId` gán người đang thao tác.
7. Nested create thêm ApplicationStatusHistory.
8. Tạo Notification cho student.
9. Tạo AuditLog `UPDATE_STATUS`.
10. Trả application đã cập nhật.
11. Sinh viên nhìn thấy trạng thái mới ở lần tải tiếp theo.

## 8. Luồng ticket hỗ trợ

### 8.1. Tạo ticket

1. Sinh viên mở `/ho-tro`.
2. Nhập title, content, category, departmentId.
3. Frontend gọi `POST /api/tickets`.
4. Backend yêu cầu JWT và role `STUDENT`.
5. Nếu multipart, multer xử lý tối đa 5 file.
6. `generateCode('TK')` tạo mã ticket.
7. Prisma tạo `SupportTicket` trạng thái mặc định `OPEN`.
8. Ghi audit log `CREATE` loại `Ticket`.
9. Trả ticket HTTP `201`.

### 8.2. Danh sách ticket

1. Frontend gọi `GET /api/tickets`.
2. Có thể gửi `status` và `category` query.
3. Student bị lọc theo `studentId` của chính mình.
4. Nhân viên có `departmentId` bị lọc theo phòng ban.
5. Prisma include student, department, assignedTo và số messages.
6. Trả danh sách theo `createdAt` giảm dần.

### 8.3. Cập nhật ticket

1. Nhân viên gửi `PATCH /api/tickets/:id/status`.
2. Backend xác thực role xử lý.
3. Prisma update status và assignedToId.
4. Tạo notification cho sinh viên.
5. Trả ticket đã cập nhật.

### 8.4. Tin nhắn ticket

1. Người dùng nhập nội dung tại `TicketDetail`.
2. Frontend gọi `POST /api/tickets/:id/messages`.
3. Backend tạo `TicketMessage` với ticketId, senderId, content.
4. Prisma include sender để trả về thông tin người gửi.
5. Backend lấy ticket để tìm phía còn lại.
6. Nếu người gửi là student, notify assigned staff; ngược lại notify student.
7. Trả message HTTP `201`.

### 8.5. Chi tiết ticket

1. Frontend gọi `GET /api/tickets/:id`.
2. Prisma include student, department, assignedTo, messages và rating.
3. Backend trả toàn bộ hội thoại theo thứ tự thời gian.
4. Frontend render nội dung, người gửi, trạng thái và form phản hồi.

## 9. Luồng thông báo

### 9.1. Sinh notification

Helper `createNotification` trong `backend/src/utils/helpers.js` gọi:

```js
prisma.notification.create({ data: ... })
```

Các nơi gọi:

- Application status route: báo trạng thái hồ sơ.
- Ticket status route: báo trạng thái ticket.
- Ticket message route: báo tin nhắn mới.
- Question answer route: báo câu trả lời mới.

### 9.2. Hiển thị thông báo

1. Header gọi `GET /api/notifications/unread-count`.
2. Backend lọc theo `userId = req.user.id`, `isRead = false`.
3. Trả `{ count }`.
4. `NotificationPage` gọi `GET /api/notifications`.
5. Backend lấy notification của user hiện tại.
6. Người dùng bấm một thông báo -> `PATCH /api/notifications/:id/read`.
7. Bấm đọc tất cả -> `PATCH /api/notifications/read-all`.

## 10. Luồng phòng ban

### Xem danh sách/chi tiết

1. `DepartmentList` gọi `GET /api/departments`.
2. `DepartmentDetail` gọi `GET /api/departments/:slug`.
3. Prisma trả department cùng services, announcements, FAQs hoặc dữ liệu liên quan.
4. Frontend hiển thị thông tin liên hệ, địa chỉ, bản đồ và dịch vụ.

### Quản trị phòng ban

1. Admin gửi `POST` hoặc `PUT`.
2. `authMiddleware` xác thực.
3. `requireRoles('ADMIN')` cho phép.
4. Prisma create/update bảng `departments`.
5. Delete thực hiện soft disable bằng `isActive = false`.
6. Ghi audit log nếu route triển khai thao tác đó.

## 11. Luồng thông báo chung

### Danh sách và chi tiết

1. `AnnouncementList` gọi `GET /api/announcements`.
2. `AnnouncementDetail` gọi `GET /api/announcements/:id`.
3. Endpoint công khai, không cần JWT.
4. Prisma lấy announcements, department và dữ liệu lưu liên quan.
5. Frontend hiển thị thông báo ghim trước hoặc theo ngày.

### Tạo và lưu thông báo

1. Staff/manager/admin gửi `POST /api/announcements`.
2. Backend kiểm tra auth và role.
3. Prisma tạo announcement.
4. Người dùng đăng nhập gửi `POST /api/announcements/:id/save`.
5. Backend tạo hoặc xóa quan hệ trong `saved_announcements`.

## 12. Luồng FAQ

1. `FaqPage` gọi `GET /api/faqs`.
2. Có thể truyền từ khóa tìm kiếm.
3. Prisma lấy FAQ và department.
4. Backend trả mảng JSON.
5. Staff/manager/admin tạo FAQ qua `POST /api/faqs`.
6. Request đi qua JWT và role middleware.
7. Prisma tạo bản ghi `FAQ`.

## 13. Luồng hỏi đáp

### Xem câu hỏi

1. `QnAPage` gọi `GET /api/questions`.
2. `QuestionDetail` gọi `GET /api/questions/:id`.
3. Endpoint công khai.
4. Prisma include author, answers và votes.
5. Frontend hiển thị số vote, câu trả lời và trạng thái resolved.

### Tạo câu hỏi

1. Student nhập title/content.
2. Gọi `POST /api/questions`.
3. Backend yêu cầu role `STUDENT`.
4. Prisma tạo Question với authorId hiện tại.
5. Trả câu hỏi mới.

### Trả lời câu hỏi

1. Staff/manager/admin gửi `POST /api/questions/:id/answers`.
2. Backend kiểm tra role.
3. Prisma tạo Answer.
4. Nếu có logic thông báo, tạo Notification cho author của Question.
5. Trả answer.

### Vote câu hỏi

1. User bấm vote.
2. Frontend gọi `POST /api/questions/:id/vote`.
3. Backend yêu cầu login.
4. Prisma tạo hoặc xử lý `QuestionVote`.
5. Unique `(questionId, userId)` ngăn vote trùng.
6. Trả kết quả vote/count.

## 14. Luồng bài viết, bình luận, like và report

### Danh sách/chi tiết

1. `GET /api/posts` lấy danh sách.
2. `GET /api/posts/:id` lấy bài viết cụ thể.
3. Endpoint công khai.
4. Prisma include author, department, comments và reports tùy route.

### Tạo bài viết

1. Student gửi multipart tới `POST /api/posts`.
2. `upload.array('attachments', 3)` xử lý tối đa 3 file.
3. Prisma tạo Post, lưu URL file trong JSON `attachments`.
4. Bài viết có `likes` mặc định bằng 0.

### Bình luận

1. User gửi `POST /api/posts/:id/comments`.
2. JWT xác định authorId.
3. Prisma tạo Comment thuộc post.
4. Trả comment mới.

### Like

1. User bấm like.
2. Gọi `POST /api/posts/:id/like`.
3. Backend cập nhật counter `likes` trong Post.
4. Trả bài viết hoặc số like mới.

### Report

1. User gửi lý do `SPAM`, `WRONG_INFO`, `OFFENSIVE`, `FAKE` hoặc `OTHER`.
2. Gọi `POST /api/reports`.
3. JWT xác định reporterId.
4. Prisma tạo Report trạng thái mặc định `PENDING`.
5. Admin xử lý dữ liệu report qua nghiệp vụ quản trị/báo cáo.

## 15. Luồng tìm kiếm và hướng dẫn

### Tìm kiếm tổng hợp

1. User nhập từ khóa trên Header hoặc `SearchPage`.
2. Frontend điều hướng tới `/tim-kiem?q=...`.
3. `SearchPage` gọi `GET /api/search?q=...`.
4. Backend tìm trên services, departments, FAQs, announcements và posts.
5. Prisma thực hiện các truy vấn phù hợp.
6. Backend gộp kết quả và trả về theo nhóm.
7. Frontend hiển thị link tới từng loại dữ liệu.

### Hướng dẫn dịch vụ

1. User nhập nhu cầu.
2. Frontend gọi `GET /api/search/guide?q=...`.
3. Backend tìm service phù hợp bằng name, description hoặc keywords.
4. Trả service, requiredDocs, steps, processingTime và department.
5. Home hiển thị hướng dẫn dạng từng bước.

## 16. Luồng bản đồ

1. `MapPage` gọi API departments hoặc dùng dữ liệu department đã tải.
2. Lấy `latitude`, `longitude`, address, phone, email.
3. `react-leaflet` tạo bản đồ và marker.
4. Người dùng bấm marker để xem thông tin phòng ban.
5. Chức năng bản đồ chủ yếu là hiển thị; tọa độ được lưu trong bảng `departments`.

## 17. Luồng đánh giá

1. Người dùng mở chi tiết service, application hoặc ticket.
2. Nhập điểm và comment.
3. Frontend gọi `POST /api/ratings`.
4. JWT cung cấp `userId`.
5. Backend xác định đối tượng qua `serviceId`, `applicationId` hoặc `ticketId`.
6. Prisma tạo Rating.
7. `applicationId` và `ticketId` unique nên một hồ sơ/ticket chỉ có tối đa một rating.
8. Backend trả rating để frontend cập nhật giao diện.

## 18. Luồng tài liệu

### Danh sách

1. Frontend gọi `GET /api/documents`.
2. Endpoint công khai, có thể lọc category/department.
3. Prisma lấy name, description, category, fileUrl.
4. Frontend tạo link mở file.

### Tạo tài liệu

1. User đã đăng nhập gửi `POST /api/documents`.
2. Backend kiểm tra JWT.
3. Prisma tạo Document.
4. URL file được lưu trong `fileUrl`.

## 19. Luồng dashboard và báo cáo

### Thống kê dashboard

1. Dashboard gọi `GET /api/admin/stats`.
2. Middleware yêu cầu một trong `ADMIN`, `DEPT_MANAGER`, `STAFF`.
3. Backend dùng Prisma count/groupBy các bảng chính.
4. Response có số lượng user, service, application, ticket hoặc các trạng thái.
5. `DashboardOverview` hiển thị card và biểu đồ.

### Quản lý user

1. Admin mở `ManageUsers`.
2. Gọi `GET /api/admin/users`.
3. Admin tạo user bằng `POST /api/admin/users`.
4. Admin cập nhật role, active hoặc thông tin bằng `PATCH /api/admin/users/:id`.
5. Backend hash mật khẩu nếu có mật khẩu mới.
6. Prisma update bảng `users`.

### Báo cáo

1. Manager/admin mở `Reports`.
2. Gọi `GET /api/admin/reports`.
3. Middleware cho `ADMIN` hoặc `DEPT_MANAGER`.
4. Backend truy vấn hồ sơ, ticket, trạng thái, phòng ban và thời gian.
5. Frontend hiển thị bảng/biểu đồ bằng Recharts nếu màn hình dùng biểu đồ.

### Audit log

1. Admin mở `AuditLogs`.
2. Gọi `GET /api/admin/audit-logs`.
3. Backend yêu cầu role `ADMIN`.
4. Prisma lấy user, action, entityType, entityId, details, createdAt.
5. Frontend hiển thị lịch sử thao tác.

## 20. Luồng audit log

Helper `createAuditLog` được gọi sau các nghiệp vụ quan trọng.

Các ví dụ action:

- `SUBMIT`: sinh viên nộp hồ sơ.
- `UPDATE_STATUS`: nhân viên đổi trạng thái hồ sơ.
- `CREATE`: tạo ticket.
- `CHANGE_PASSWORD`: đổi mật khẩu.
- Thao tác quản trị phòng ban/dịch vụ/người dùng nếu route gọi helper.

Chuỗi xử lý:

1. Route nghiệp vụ đã xác định user hiện tại.
2. Gọi `createAuditLog(userId, action, entityType, entityId, details)`.
3. Helper gọi `prisma.auditLog.create`.
4. Nếu ghi log lỗi, helper log lỗi server nhưng không làm request nghiệp vụ thất bại.
5. Log nằm trong bảng `audit_logs`.

## 21. Xử lý lỗi

### Lỗi validation nghiệp vụ

Backend trả HTTP `400`, ví dụ:

- Thiếu email/password/fullName khi đăng ký.
- Email đã tồn tại.
- Mật khẩu hiện tại sai.
- Vote trùng hoặc dữ liệu không hợp lệ.

### Lỗi xác thực

Backend trả HTTP `401` khi:

- Không có Bearer token.
- Token không hợp lệ.
- Token hết hạn.
- Email/mật khẩu đăng nhập sai.
- Tài khoản không active.

### Lỗi phân quyền

Backend trả HTTP `403` khi token hợp lệ nhưng role không được phép.

### Không tìm thấy dữ liệu

Backend trả HTTP `404`, ví dụ không tìm thấy hồ sơ, ticket hoặc service.

### Lỗi server/database

Các route bắt lỗi bằng `try/catch` và thường trả:

```json
{
  "message": "..."
}
```

Middleware cuối trong `index.js` cũng bắt lỗi chưa được xử lý và trả HTTP `500`.

### Lỗi frontend

Axios response interceptor xử lý `401` tập trung. Các component thường dùng `try/catch` để đưa `err.response?.data?.message` vào state `error` và hiển thị trên form.

## 22. Quan hệ dữ liệu theo luồng

### Luồng hồ sơ

```text
User (student)
  -> Application
     -> Service
        -> Department
     -> ApplicationStatusHistory
     -> Rating
     -> Notification
     -> AuditLog
```

### Luồng hỗ trợ

```text
User (student)
  -> SupportTicket
     -> Department
     -> User (assigned staff)
     -> TicketMessage
     -> Rating
     -> Notification
```

### Luồng cộng đồng

```text
User
  -> Post
     -> Comment
     -> Report

User
  -> Question
     -> Answer
     -> QuestionVote
```

## 23. Tóm tắt theo thao tác người dùng

| Thao tác | Component | Axios | Backend chính | Bảng chính |
|---|---|---|---|---|
| Đăng nhập | `Login` | POST auth/login | bcryptjs + JWT | users |
| Đăng ký | `Register` | POST auth/register | bcryptjs + Prisma | users |
| Xem dịch vụ | `ServiceList` | GET services | Express + Prisma | services, departments |
| Nộp hồ sơ | `ApplicationForm` | POST applications | multer + Prisma | applications, history |
| Theo dõi hồ sơ | `MyApplications` | GET applications | JWT + Prisma | applications |
| Xử lý hồ sơ | `ManageApplications` | PATCH applications/status | role + notification + audit | applications, history, notifications, audit_logs |
| Tạo hỗ trợ | `SupportPage` | POST tickets | multer + Prisma | support_tickets |
| Chat hỗ trợ | `TicketDetail` | POST tickets/id/messages | Prisma + notification | ticket_messages, notifications |
| Xem thông báo | `NotificationPage` | GET notifications | JWT + Prisma | notifications |
| Hỏi đáp | `QnAPage` | GET/POST questions | role + Prisma | questions, answers, votes |
| Tìm kiếm | `SearchPage` | GET search | Prisma nhiều bảng | services, departments, FAQs, announcements, posts |
| Quản lý user | `ManageUsers` | GET/POST/PATCH admin/users | ADMIN + bcrypt | users |
| Báo cáo | `Reports` | GET admin/reports | role + Prisma | applications, tickets, users |
| Audit | `AuditLogs` | GET admin/audit-logs | ADMIN + Prisma | audit_logs |

## 24. Một số lưu ý kỹ thuật

1. Token được lưu trong localStorage, không phải HttpOnly cookie.
2. File upload được lưu local disk, chưa phải object storage.
3. `GET /applications` cho role xử lý đang cho xem toàn bộ hồ sơ.
4. Ticket list có lọc phòng ban cho nhân viên có `departmentId`.
5. Một số trang có dữ liệu fallback/demo khi API lỗi hoặc rỗng.
6. Nên bổ sung kiểm tra ownership cho các thao tác ticket/message/rating/document khi triển khai production.
7. Nên validate score rating và các enum ở backend trước khi ghi database.
8. Các thao tác notification đọc theo ID nên kiểm tra notification thuộc user hiện tại.
9. Các thao tác upload nên cân nhắc đổi tên file an toàn hơn, antivirus scan và lưu object storage.

## 25. Kết luận

Hệ thống xử lý theo mô hình frontend gọi REST API. React chịu trách nhiệm giao diện và state; Axios chịu trách nhiệm HTTP; Vite làm proxy trong môi trường phát triển; Express điều phối route; middleware xử lý JWT, role và file; Prisma chuyển thao tác nghiệp vụ thành truy vấn SQLite; cuối cùng response JSON quay lại React để cập nhật state và giao diện.

Luồng quan trọng nhất là:

```text
Ấn nút trên React
-> event handler
-> AuthContext hoặc api.js
-> Axios
-> Vite proxy
-> Express router
-> JWT/role/multer middleware
-> bcryptjs hoặc Prisma
-> SQLite
-> notification/audit nếu có
-> JSON response
-> React state/localStorage
-> giao diện cập nhật
```

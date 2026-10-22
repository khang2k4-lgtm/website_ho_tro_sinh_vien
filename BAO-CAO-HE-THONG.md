# BÁO CÁO PHÂN TÍCH HỆ THỐNG HUMG PORTAL
flowchart TD
    APP["Ứng dụng HUMG"]

    APP --> AUTH["Layout xác thực"]
    AUTH --> LOGIN["/dang-nhap · Đăng nhập"]
    AUTH --> REGISTER["/dang-ky · Đăng ký"]

    APP --> MAIN["Layout người dùng · Header + Footer"]

    subgraph PUBLIC["Trang công khai"]
        HOME["/ · Trang chủ"]
        SERVICES["/dich-vu · Danh sách dịch vụ"]
        SERVICE_DETAIL["/dich-vu/:slug · Chi tiết dịch vụ"]
        APPLY["/nop-ho-so/:slug · Nộp hồ sơ 🔒"]
        DEPARTMENTS["/phong-ban · Danh sách phòng ban"]
        DEPARTMENT_DETAIL["/phong-ban/:slug · Chi tiết phòng ban"]
        ANNOUNCEMENTS["/thong-bao · Danh sách thông báo"]
        ANNOUNCEMENT_DETAIL["/thong-bao/:id · Chi tiết thông báo"]
        SUPPORT["/ho-tro · Hỗ trợ"]
        TICKET_DETAIL["/ho-tro/:id · Chi tiết ticket 🔒"]
        MAP["/bando · Bản đồ"]
        SEARCH["/tra-cuu · Tra cứu"]
        SEARCH_ALIAS["/tim-kiem · Tìm kiếm (cùng trang Tra cứu)"]
        FAQ["/faq · Câu hỏi thường gặp"]
        QNA["/hoi-dap · Hỏi đáp"]
        QUESTION["/hoi-dap/:id · Chi tiết câu hỏi"]
        ACCOUNT["/tai-khoan · Tài khoản 🔒"]
        MY_APPS["/tai-khoan/ho-so · Hồ sơ của tôi 🔒"]
        APP_DETAIL["/ho-so/:id · Chi tiết hồ sơ 🔒"]
        NOTIFICATIONS["/thong-bao-ca-nhan · Thông báo cá nhân 🔒"]
    end

    MAIN --> HOME
    MAIN --> SERVICES
    SERVICES --> SERVICE_DETAIL
    SERVICE_DETAIL --> APPLY
    MAIN --> DEPARTMENTS
    DEPARTMENTS --> DEPARTMENT_DETAIL
    MAIN --> ANNOUNCEMENTS
    ANNOUNCEMENTS --> ANNOUNCEMENT_DETAIL
    MAIN --> SUPPORT
    SUPPORT --> TICKET_DETAIL
    MAIN --> MAP
    MAIN --> SEARCH
    MAIN --> SEARCH_ALIAS
    MAIN --> FAQ
    MAIN --> QNA
    QNA --> QUESTION
    MAIN --> ACCOUNT
    ACCOUNT --> MY_APPS
    MY_APPS --> APP_DETAIL
    MAIN --> NOTIFICATIONS

    APP --> DASH["Layout Dashboard 🔒<br/>Chỉ STAFF, DEPT_MANAGER, ADMIN"]

    subgraph DASHBOARD["Các route Dashboard"]
        DHOME["/dashboard · Trang tổng quan theo vai trò"]
        STAFF_HOME["Nhân viên: DashboardOverview"]
        MANAGER_HOME["Quản lý phòng ban: DepartmentManagerOverviewPage"]
        ADMIN_HOME["Quản trị viên: AdminSystemOverviewPage"]

        OVERVIEW["/dashboard/tong-quan · Tổng quan cá nhân"]
        SCHEDULE["/dashboard/lich-truc · Lịch trực & hẹn gặp"]

        INTAKE["/dashboard/ho-so-cho-tiep-nhan · Hồ sơ chờ tiếp nhận"]
        PROCESSING["/dashboard/ho-so-dang-xu-ly · Hồ sơ đang xử lý"]
        RESUBMIT["/dashboard/ho-so-cho-sv-bo-sung · Chờ sinh viên bổ sung"]
        ARCHIVE["/dashboard/kho-ho-so · Kho hồ sơ & lịch sử"]

        DASH_TICKET["/dashboard/ticket-ho-tro · Ticket hỗ trợ"]
        CHAT["/dashboard/chat-sinh-vien · Chat với sinh viên"]

        PRINT["/dashboard/in-an · In ấn & xuất bản phôi"]
        SIGN["/dashboard/ky-so · Duyệt & ký số"]
        FEE["/dashboard/le-phi · Lệ phí & biên lai"]

        DIRECTORY["/dashboard/tra-cuu-sinh-vien · Tra cứu sinh viên"]
        GUIDE["/dashboard/cam-nang · Cẩm nang nghiệp vụ"]
        KPI["/dashboard/bao-cao-kpi · Báo cáo KPI"]
        SETTINGS["/dashboard/cai-dat · Cài đặt tài khoản"]

        MANAGE_APPS["/dashboard/ho-so · Quản lý hồ sơ"]
        ROLE_DETAIL["/dashboard/chi-tiet/:category/:slug · Chi tiết nghiệp vụ"]
        DASH_APP_DETAIL["/dashboard/ho-so/:id · Chi tiết hồ sơ"]
        MANAGE_TICKETS["/dashboard/tickets · Quản lý ticket"]
        MANAGE_DEPTS["/dashboard/phong-ban · Quản lý phòng ban"]
        MANAGE_SERVICES["/dashboard/dich-vu · Quản lý dịch vụ"]
        USERS["/dashboard/nguoi-dung · Quản lý người dùng"]
        AUDIT["/dashboard/audit · Nhật ký hệ thống"]
        REPORTS["/dashboard/bao-cao · Báo cáo & thống kê"]
    end

    DASH --> DHOME
    DHOME --> STAFF_HOME
    DHOME --> MANAGER_HOME
    DHOME --> ADMIN_HOME

    DASH --> OVERVIEW
    DASH --> SCHEDULE
    DASH --> INTAKE
    DASH --> PROCESSING
    DASH --> RESUBMIT
    DASH --> ARCHIVE
    DASH --> DASH_TICKET
    DASH --> CHAT
    DASH --> PRINT
    DASH --> SIGN
    DASH --> FEE
    DASH --> DIRECTORY
    DASH --> GUIDE
    DASH --> KPI
    DASH --> SETTINGS

    DASH --> MANAGE_APPS
    MANAGE_APPS --> DASH_APP_DETAIL
    DASH --> ROLE_DETAIL
    DASH --> MANAGE_TICKETS
    DASH --> MANAGE_DEPTS
    DASH --> MANAGE_SERVICES
    DASH --> USERS
    DASH --> AUDIT
    DASH --> REPORTS

    APP --> NOT_FOUND["* · Trang không tồn tại"]
## 1. Tổng quan

HUMG Portal là cổng dịch vụ sinh viên gồm:

- Frontend: React 19, Vite, React Router, Axios, Leaflet và Recharts.
- Backend: Node.js, Express, Prisma ORM.
- Database: SQLite.
- Xác thực: JWT Bearer Token, thời hạn 7 ngày.
- Mật khẩu: bcryptjs.
- Lưu file: thư mục `backend/uploads`, truy cập qua `/uploads/...`.
- API gốc: `/api`.
- Frontend gọi API qua Vite proxy tới `http://localhost:5000`.

Luồng dữ liệu tổng quát:

```text
Người dùng -> React page -> Axios -> Vite proxy -> Express route
-> Middleware JWT/quyền -> Prisma Client -> SQLite
-> JSON response -> React state/localStorage -> giao diện
```

## 2. Cấu trúc thư mục chính

```text
backend/
  prisma/schema.prisma       Mô hình database
  prisma/seed.js             Dữ liệu mẫu
  src/index.js               Khởi tạo Express và mount route
  src/routes/                API theo nghiệp vụ
  src/middleware/auth.js     JWT và phân quyền
  src/middleware/upload.js   Upload file
  src/utils/helpers.js       Mã hồ sơ, notification, audit log
frontend/
  src/App.jsx                Khai báo route frontend
  src/services/api.js        Axios client và token interceptor
  src/context/AuthContext.jsx Quản lý phiên đăng nhập
  src/features/             Các nghiệp vụ auth, hồ sơ, dashboard
  src/pages/                 Các trang người dùng
  src/layouts/               Layout người dùng và quản trị
```

## 3. Vai trò và phân quyền

| Mã vai trò | Tên | Quyền chính |
|---|---|---|
| `STUDENT` | Sinh viên | Tra cứu dịch vụ, tạo hồ sơ, tạo ticket, hỏi đáp, bình chọn, xem dữ liệu của mình |
| `STAFF` | Nhân viên | Xem và xử lý hồ sơ, ticket thuộc phòng ban, trả lời Q&A |
| `DEPT_MANAGER` | Quản lý phòng ban | Quyền xử lý hồ sơ/ticket, quản lý dịch vụ, xem báo cáo |
| `ADMIN` | Quản trị viên | Quản lý toàn hệ thống: người dùng, phòng ban, dịch vụ, audit và báo cáo |

`STAFF_ROLES` ở frontend gồm `STAFF`, `DEPT_MANAGER`, `ADMIN`.

Cơ chế backend:

1. Client gửi `Authorization: Bearer <token>`.
2. `authMiddleware` giải mã JWT và gắn `req.user`.
3. `requireRoles(...)` kiểm tra vai trò.
4. Thiếu token trả `401`; sai hoặc hết hạn trả `401`; không đủ quyền trả `403`.
5. Frontend nhận `401` sẽ xóa token/user trong localStorage và chuyển về `/dang-nhap`.

## 4. Các route frontend và màn hình

### 4.1. Khu vực công khai

| URL | Component | Chức năng |
|---|---|---|
| `/` | `Home` | Trang chủ, giới thiệu dịch vụ, phòng ban, thông báo và hướng dẫn |
| `/dang-nhap` | `Login` | Đăng nhập |
| `/dang-ky` | `Register` | Đăng ký tài khoản sinh viên |
| `/dich-vu` | `ServiceList` | Danh sách và lọc dịch vụ |
| `/dich-vu/:slug` | `ServiceDetail` | Chi tiết dịch vụ, giấy tờ, bước xử lý, phòng ban, đánh giá |
| `/phong-ban` | `DepartmentList` | Danh sách phòng ban |
| `/phong-ban/:slug` | `DepartmentDetail` | Chi tiết phòng ban và dịch vụ liên quan |
| `/thong-bao` | `AnnouncementList` | Danh sách thông báo |
| `/thong-bao/:id` | `AnnouncementDetail` | Nội dung thông báo |
| `/ho-tro` | `SupportPage` | Tạo và xem ticket hỗ trợ |
| `/bando` | `MapPage` | Bản đồ vị trí các phòng ban |
| `/tra-cuu` | `SearchPage` | Tra cứu tổng hợp |
| `/tim-kiem` | `SearchPage` | Tìm kiếm tổng hợp bằng từ khóa |
| `/faq` | `FaqPage` | Câu hỏi thường gặp |
| `/hoi-dap` | `QnAPage` | Danh sách hỏi đáp cộng đồng |
| `/hoi-dap/:id` | `QuestionDetail` | Chi tiết câu hỏi và câu trả lời |
| `*` | `NotFound` | Trang không tìm thấy |

### 4.2. Khu vực cần đăng nhập

| URL | Component | Chức năng |
|---|---|---|
| `/ho-tro/:id` | `TicketDetail` | Xem hội thoại và phản hồi ticket |
| `/nop-ho-so/:slug` | `ApplicationForm` | Nộp hồ sơ cho một dịch vụ |
| `/tai-khoan` | `AccountPage` | Xem/sửa thông tin tài khoản, đổi mật khẩu |
| `/tai-khoan/ho-so` | `MyApplications` | Danh sách hồ sơ của sinh viên |
| `/ho-so/:id` | `ApplicationDetail` | Chi tiết và lịch sử xử lý hồ sơ |
| `/thong-bao-ca-nhan` | `NotificationPage` | Thông báo cá nhân, đánh dấu đã đọc |

### 4.3. Dashboard nhân viên

Tất cả route dashboard yêu cầu một trong ba vai trò `STAFF`, `DEPT_MANAGER`, `ADMIN`.

| URL | Component | Chức năng |
|---|---|---|
| `/dashboard` | `DashboardOverview` | Tổng quan số liệu |
| `/dashboard/ho-so` | `ManageApplications` | Quản lý hồ sơ |
| `/dashboard/ho-so/:id` | `ApplicationDetail` | Xử lý một hồ sơ |
| `/dashboard/tickets` | `ManageTickets` | Quản lý ticket |
| `/dashboard/phong-ban` | `ManageDepartments` | Quản lý phòng ban |
| `/dashboard/dich-vu` | `ManageServices` | Quản lý dịch vụ |
| `/dashboard/nguoi-dung` | `ManageUsers` | Quản lý người dùng |
| `/dashboard/audit` | `AuditLogs` | Xem nhật ký hệ thống |
| `/dashboard/bao-cao` | `Reports` | Báo cáo, thống kê |

Menu hiển thị theo vai trò:

- `STAFF`: tổng quan, hồ sơ, ticket.
- `DEPT_MANAGER`: hồ sơ, ticket, dịch vụ phòng ban, báo cáo.
- `ADMIN`: người dùng, phòng ban, dịch vụ, hồ sơ, báo cáo, audit.

## 5. Các luồng nghiệp vụ chính

### 5.1. Đăng ký

1. Người dùng mở `/dang-ky`.
2. Nhập họ tên, email, mật khẩu và thông tin sinh viên tùy chọn.
3. Frontend gọi `POST /api/auth/register`.
4. Backend kiểm tra email bắt buộc và email chưa tồn tại.
5. Mật khẩu được băm bằng bcrypt.
6. Tài khoản được tạo với role `STUDENT`.
7. Backend trả user và JWT.
8. Frontend lưu phiên trong `AuthContext`/localStorage và chuyển tới `/tai-khoan`.

### 5.2. Đăng nhập

1. Người dùng nhập email và mật khẩu tại `/dang-nhap`.
2. Frontend gọi `POST /api/auth/login`.
3. Backend tìm user, kiểm tra `isActive` và so sánh bcrypt.
4. Nếu đúng, backend phát JWT 7 ngày.
5. Frontend lưu token và user.
6. Nhân viên chuyển tới `/dashboard`; sinh viên chuyển tới `/tai-khoan`.
7. Khi mở lại ứng dụng, frontend gọi `GET /api/auth/me` để lấy user hiện tại.

Tài khoản demo:

```text
admin@humg.edu.vn / 123456
nv.ctsv@humg.edu.vn / 123456
ql.ctsv@humg.edu.vn / 123456
sv001@humg.edu.vn / 123456
```

### 5.3. Tra cứu dịch vụ

1. Người dùng mở danh sách dịch vụ.
2. Frontend gọi `GET /api/services`.
3. Người dùng lọc theo từ khóa, category hoặc phòng ban.
4. Chọn dịch vụ để mở `/dich-vu/:slug`.
5. Frontend gọi `GET /api/services/:slug`.
6. Chi tiết gồm mô tả, loại dịch vụ, giấy tờ, quy trình, thời gian, phí, phòng ban và đánh giá.
7. Người dùng đã đăng nhập có thể chuyển sang form nộp hồ sơ.

### 5.4. Nộp hồ sơ

1. Sinh viên chọn dịch vụ.
2. Mở `/nop-ho-so/:slug`.
3. Nhập các trường động theo `formFields`, ghi chú và file đính kèm.
4. Frontend gửi multipart form data tới `POST /api/applications`.
5. Backend giới hạn tối đa 5 file, mỗi file tối đa 10 MB.
6. Tạo mã hồ sơ dạng `HD + năm + 5 chữ số ngẫu nhiên`.
7. Tạo bản ghi `Application` với trạng thái `SUBMITTED`.
8. Tạo dòng đầu tiên trong `ApplicationStatusHistory`.
9. Ghi `AuditLog` hành động `SUBMIT`.
10. Sinh viên theo dõi tại `/tai-khoan/ho-so`.

### 5.5. Xử lý hồ sơ

1. Nhân viên mở dashboard hồ sơ.
2. Backend cho các role xử lý xem toàn bộ hồ sơ.
3. Nhân viên mở chi tiết hồ sơ.
4. Cập nhật trạng thái bằng `PATCH /api/applications/:id/status`.
5. Backend cập nhật trạng thái, ghi người xử lý và tạo lịch sử trạng thái.
6. Backend tạo notification cho sinh viên.
7. Backend ghi audit log `UPDATE_STATUS`.
8. Sinh viên xem timeline tại trang chi tiết.

Trạng thái hồ sơ:

```text
SUBMITTED       Đã gửi
RECEIVED        Đã tiếp nhận
PROCESSING      Đang xử lý
NEED_SUPPLEMENT Chờ bổ sung
APPROVED        Đã duyệt
REJECTED        Từ chối
COMPLETED       Hoàn thành
```

### 5.6. Ticket hỗ trợ

1. Sinh viên đăng nhập và mở `/ho-tro`.
2. Gửi tiêu đề, nội dung, category, phòng ban và file nếu có.
3. Backend tạo mã `TK + năm + 5 chữ số`, trạng thái `OPEN`.
4. Nhân viên xem ticket thuộc phòng ban của mình.
5. Nhân viên cập nhật trạng thái hoặc người được phân công.
6. Sinh viên và nhân viên trao đổi tại `/ho-tro/:id`.
7. Mỗi tin nhắn có một dòng `TicketMessage`.
8. Người đối thoại nhận notification.

Trạng thái ticket:

```text
OPEN        Mới
IN_PROGRESS Đang xử lý
WAITING     Chờ phản hồi
RESOLVED    Đã giải quyết
CLOSED      Đã đóng
```

### 5.7. Thông báo

Thông báo được tạo khi:

- Trạng thái hồ sơ thay đổi.
- Trạng thái ticket thay đổi.
- Có tin nhắn ticket mới.
- Có câu trả lời cho câu hỏi.
- Có sự kiện hệ thống khác.

Frontend hiển thị số chưa đọc ở header và danh sách tại `/thong-bao-ca-nhan`.

### 5.8. Hỏi đáp

1. Người dùng xem câu hỏi công khai tại `/hoi-dap`.
2. Sinh viên tạo câu hỏi bằng `POST /api/questions`.
3. Nhân viên, quản lý hoặc admin trả lời bằng `POST /api/questions/:id/answers`.
4. Sinh viên có thể vote một lần cho mỗi câu hỏi.
5. Câu trả lời tạo notification cho người hỏi.
6. Câu hỏi có thể được đánh dấu `isResolved` trong dữ liệu.

### 5.9. Tìm kiếm

`GET /api/search?q=...` tìm trên:

- Service.
- Department.
- FAQ.
- Announcement.
- Post.

`GET /api/search/guide?q=...` tìm dịch vụ phù hợp và trả về hướng dẫn gồm giấy tờ, các bước và thời gian xử lý.

### 5.10. Quản trị

Admin có thể:

- Xem thống kê.
- Tạo, sửa, khóa/mở khóa người dùng.
- Tạo, sửa, vô hiệu hóa phòng ban.
- Tạo, sửa, vô hiệu hóa dịch vụ.
- Xem audit log.
- Xem báo cáo.

Quản lý phòng ban có thể quản lý dịch vụ và xem báo cáo theo quyền được cấp.

## 6. API backend đầy đủ

Tất cả endpoint dưới đây nằm dưới tiền tố `/api`.

### 6.1. Health và auth

| Method | Endpoint | Quyền | Chức năng |
|---|---|---|---|
| GET | `/health` | Công khai | Kiểm tra server |
| POST | `/auth/register` | Công khai | Đăng ký sinh viên |
| POST | `/auth/login` | Công khai | Đăng nhập |
| GET | `/auth/me` | Đăng nhập | Lấy user hiện tại |
| PUT | `/auth/profile` | Đăng nhập | Sửa hồ sơ cá nhân |
| PUT | `/auth/change-password` | Đăng nhập | Đổi mật khẩu |

### 6.2. Phòng ban và dịch vụ

| Method | Endpoint | Quyền | Chức năng |
|---|---|---|---|
| GET | `/departments` | Công khai | Danh sách phòng ban |
| GET | `/departments/:slug` | Công khai | Chi tiết phòng ban |
| POST | `/departments` | ADMIN | Tạo phòng ban |
| PUT | `/departments/:id` | ADMIN | Sửa phòng ban |
| DELETE | `/departments/:id` | ADMIN | Vô hiệu hóa phòng ban |
| GET | `/services` | Công khai | Danh sách dịch vụ |
| GET | `/services/:slug` | Công khai | Chi tiết dịch vụ |
| POST | `/services` | ADMIN, DEPT_MANAGER | Tạo dịch vụ |
| PUT | `/services/:id` | ADMIN, DEPT_MANAGER | Sửa dịch vụ |
| DELETE | `/services/:id` | ADMIN | Vô hiệu hóa dịch vụ |

### 6.3. Hồ sơ và ticket

| Method | Endpoint | Quyền | Chức năng |
|---|---|---|---|
| GET | `/applications` | Đăng nhập | Sinh viên xem hồ sơ mình; role xử lý xem toàn bộ |
| GET | `/applications/:id` | Đăng nhập | Chi tiết hồ sơ |
| POST | `/applications` | STUDENT | Tạo hồ sơ, tối đa 5 file |
| PATCH | `/applications/:id/status` | STAFF, DEPT_MANAGER, ADMIN | Cập nhật trạng thái hồ sơ |
| GET | `/tickets` | Đăng nhập | Sinh viên xem ticket mình; nhân viên xem theo phòng |
| GET | `/tickets/:id` | Đăng nhập | Chi tiết ticket và tin nhắn |
| POST | `/tickets` | STUDENT | Tạo ticket, tối đa 5 file |
| PATCH | `/tickets/:id/status` | STAFF, DEPT_MANAGER, ADMIN | Đổi trạng thái ticket |
| POST | `/tickets/:id/messages` | Đăng nhập | Gửi tin nhắn ticket |

### 6.4. Nội dung, hỏi đáp và tương tác

| Method | Endpoint | Quyền | Chức năng |
|---|---|---|---|
| GET | `/announcements` | Công khai | Danh sách thông báo |
| GET | `/announcements/:id` | Công khai | Chi tiết thông báo |
| POST | `/announcements` | STAFF, DEPT_MANAGER, ADMIN | Tạo thông báo |
| POST | `/announcements/:id/save` | Đăng nhập | Lưu/bỏ lưu thông báo |
| GET | `/faqs` | Công khai | Danh sách/tìm FAQ |
| POST | `/faqs` | STAFF, DEPT_MANAGER, ADMIN | Tạo FAQ |
| GET | `/questions` | Công khai | Danh sách câu hỏi |
| GET | `/questions/:id` | Công khai | Chi tiết câu hỏi |
| POST | `/questions` | STUDENT | Tạo câu hỏi |
| POST | `/questions/:id/answers` | STAFF, DEPT_MANAGER, ADMIN | Trả lời câu hỏi |
| POST | `/questions/:id/vote` | Đăng nhập | Vote câu hỏi |
| GET | `/posts` | Công khai | Danh sách bài viết |
| GET | `/posts/:id` | Công khai | Chi tiết bài viết |
| POST | `/posts` | STUDENT | Tạo bài viết, tối đa 3 file |
| POST | `/posts/:id/comments` | Đăng nhập | Bình luận |
| POST | `/posts/:id/like` | Đăng nhập | Like bài viết |
| POST | `/reports` | Đăng nhập | Báo cáo bài viết |

### 6.5. Tài liệu, đánh giá và thông báo

| Method | Endpoint | Quyền | Chức năng |
|---|---|---|---|
| GET | `/documents` | Công khai | Danh sách/lọc tài liệu |
| POST | `/documents` | Đăng nhập | Tạo tài liệu |
| POST | `/ratings` | Đăng nhập | Đánh giá dịch vụ/hồ sơ/ticket |
| GET | `/notifications` | Đăng nhập | Danh sách thông báo của user |
| GET | `/notifications/unread-count` | Đăng nhập | Đếm chưa đọc |
| PATCH | `/notifications/read-all` | Đăng nhập | Đánh dấu tất cả đã đọc |
| PATCH | `/notifications/:id/read` | Đăng nhập | Đánh dấu một thông báo đã đọc |
| GET | `/search` | Công khai | Tìm kiếm tổng hợp |
| GET | `/search/guide` | Công khai | Hướng dẫn theo từ khóa |

### 6.6. Admin

| Method | Endpoint | Quyền | Chức năng |
|---|---|---|---|
| GET | `/admin/stats` | STAFF, DEPT_MANAGER, ADMIN | Thống kê dashboard |
| GET | `/admin/users` | ADMIN | Danh sách người dùng |
| POST | `/admin/users` | ADMIN | Tạo người dùng |
| PATCH | `/admin/users/:id` | ADMIN | Sửa/khóa người dùng |
| GET | `/admin/audit-logs` | ADMIN | Xem audit log |
| GET | `/admin/reports` | ADMIN, DEPT_MANAGER | Xem báo cáo |

## 7. Enum trong database

### `Role`

`STUDENT`, `STAFF`, `DEPT_MANAGER`, `ADMIN`.

### `ApplicationStatus`

`SUBMITTED`, `RECEIVED`, `PROCESSING`, `NEED_SUPPLEMENT`, `APPROVED`, `REJECTED`, `COMPLETED`.

### `TicketStatus`

`OPEN`, `IN_PROGRESS`, `WAITING`, `RESOLVED`, `CLOSED`.

### `TicketCategory`

`HOC_VU`, `TAI_CHINH`, `CONG_TAC_SINH_VIEN`, `CO_SO_VAT_CHAT`, `CNTT`, `KHAC`.

### `ServiceCategory`

`HOC_VU`, `CONG_TAC_SINH_VIEN`, `TAI_CHINH`, `THU_VIEN`, `CNTT`, `KHAC`.

### `NotificationType`

`APPLICATION`, `TICKET`, `ANNOUNCEMENT`, `QUESTION`, `SYSTEM`.

### `ReportReason`

`SPAM`, `WRONG_INFO`, `OFFENSIVE`, `FAKE`, `OTHER`.

## 8. Thiết kế database

Database hiện có **21 model/bảng**. Tên bảng SQLite được chỉ định bởi `@@map(...)`.

### 8.1. `users`

Lưu tài khoản sinh viên, nhân viên, quản lý và admin.

| Trường | Kiểu | Bắt buộc/mặc định | Ý nghĩa |
|---|---|---|---|
| `id` | String | PK, cuid | Mã user |
| `email` | String | bắt buộc, unique | Email đăng nhập |
| `password` | String | bắt buộc | Mật khẩu đã hash |
| `fullName` | String | bắt buộc | Họ tên |
| `role` | Role | mặc định STUDENT | Vai trò |
| `studentId` | String | nullable, unique | MSSV |
| `phone` | String | nullable | Số điện thoại |
| `avatar` | String | nullable | URL ảnh đại diện |
| `dateOfBirth` | DateTime | nullable | Ngày sinh |
| `faculty` | String | nullable | Khoa |
| `major` | String | nullable | Ngành |
| `className` | String | nullable | Lớp |
| `departmentId` | String | nullable, FK | Phòng ban của nhân viên |
| `isActive` | Boolean | mặc định true | Trạng thái hoạt động |
| `createdAt` | DateTime | now | Ngày tạo |
| `updatedAt` | DateTime | auto update | Ngày sửa |

Quan hệ: thuộc `Department`; có applications, assignedApps, statusHistories, tickets, assignedTickets, ticketMessages, posts, comments, notifications, questions, answers, votes, ratings, auditLogs, reports và savedAnnouncements.

### 8.2. `departments`

Lưu phòng/khoa/bộ phận tiếp nhận và xử lý dịch vụ.

| Trường | Kiểu | Bắt buộc/mặc định | Ý nghĩa |
|---|---|---|---|
| `id` | String | PK, cuid | Mã phòng ban |
| `name` | String | bắt buộc | Tên |
| `slug` | String | bắt buộc, unique | URL thân thiện |
| `description` | String | nullable | Mô tả |
| `address` | String | nullable | Địa chỉ |
| `building` | String | nullable | Tòa nhà |
| `floor` | String | nullable | Tầng |
| `room` | String | nullable | Phòng |
| `phone` | String | nullable | Điện thoại |
| `email` | String | nullable | Email |
| `workingHours` | String | nullable | Giờ làm việc |
| `latitude` | Float | nullable | Vĩ độ bản đồ |
| `longitude` | Float | nullable | Kinh độ bản đồ |
| `isActive` | Boolean | true | Đang hoạt động |
| `createdAt` | DateTime | now | Ngày tạo |
| `updatedAt` | DateTime | auto update | Ngày sửa |

Quan hệ: có users, services, announcements, FAQs, documents, tickets, posts.

### 8.3. `services`

Lưu dịch vụ/thủ tục sinh viên.

| Trường | Kiểu | Bắt buộc/mặc định | Ý nghĩa |
|---|---|---|---|
| `id` | String | PK, cuid | Mã dịch vụ |
| `name` | String | bắt buộc | Tên dịch vụ |
| `slug` | String | bắt buộc, unique | URL |
| `description` | String | nullable | Mô tả |
| `category` | ServiceCategory | KHAC | Nhóm dịch vụ |
| `departmentId` | String | bắt buộc, FK | Phòng xử lý |
| `requiredDocs` | Json | nullable | Danh sách giấy tờ |
| `steps` | Json | nullable | Các bước xử lý |
| `processingTime` | String | nullable | Thời gian xử lý |
| `submissionType` | String | Online | Online/trực tiếp |
| `fee` | String | nullable | Lệ phí |
| `formFields` | Json | nullable | Trường form động |
| `keywords` | Json | nullable | Từ khóa tìm kiếm |
| `isActive` | Boolean | true | Đang cung cấp |
| `createdAt` | DateTime | now | Ngày tạo |
| `updatedAt` | DateTime | auto update | Ngày sửa |

Quan hệ: thuộc Department; có applications, service documents và ratings.

### 8.4. `service_documents`

Tài liệu biểu mẫu/tệp hướng dẫn của dịch vụ.

| Trường | Kiểu | Ý nghĩa |
|---|---|---|
| `id` | String PK | Mã tài liệu |
| `serviceId` | String FK | Dịch vụ |
| `name` | String | Tên file |
| `fileUrl` | String | Đường dẫn file |
| `createdAt` | DateTime | Ngày tạo |

Xóa dịch vụ sẽ xóa tài liệu liên quan (`Cascade`).

### 8.5. `applications`

Lưu hồ sơ sinh viên nộp cho một dịch vụ.

| Trường | Kiểu | Bắt buộc/mặc định | Ý nghĩa |
|---|---|---|---|
| `id` | String | PK, cuid | Mã nội bộ |
| `code` | String | bắt buộc, unique | Mã tra cứu dạng HD... |
| `studentId` | String FK | bắt buộc | Người nộp |
| `serviceId` | String FK | bắt buộc | Dịch vụ |
| `status` | ApplicationStatus | SUBMITTED | Trạng thái |
| `formData` | Json | bắt buộc | Dữ liệu form |
| `attachments` | Json | nullable | Danh sách file |
| `note` | String | nullable | Ghi chú |
| `rejectReason` | String | nullable | Lý do từ chối |
| `assignedToId` | String FK | nullable | Nhân viên xử lý |
| `createdAt` | DateTime | now | Ngày nộp |
| `updatedAt` | DateTime | auto update | Ngày cập nhật |

Quan hệ: thuộc User, Service và nhân viên xử lý; có status history và tối đa một Rating.

### 8.6. `application_status_history`

Lưu lịch sử chuyển trạng thái hồ sơ.

| Trường | Kiểu | Ý nghĩa |
|---|---|---|
| `id` | String PK | Mã lịch sử |
| `applicationId` | String FK | Hồ sơ |
| `status` | ApplicationStatus | Trạng thái mới |
| `note` | String nullable | Ghi chú xử lý |
| `changedById` | String FK | Người thay đổi |
| `createdAt` | DateTime | Thời điểm |

Xóa hồ sơ sẽ xóa lịch sử (`Cascade`).

### 8.7. `support_tickets`

Lưu yêu cầu hỗ trợ.

| Trường | Kiểu | Bắt buộc/mặc định | Ý nghĩa |
|---|---|---|---|
| `id` | String | PK, cuid | Mã nội bộ |
| `code` | String | unique | Mã ticket TK... |
| `title` | String | bắt buộc | Tiêu đề |
| `content` | String | bắt buộc | Nội dung |
| `category` | TicketCategory | KHAC | Nhóm hỗ trợ |
| `status` | TicketStatus | OPEN | Trạng thái |
| `studentId` | String FK | bắt buộc | Người gửi |
| `departmentId` | String FK | nullable | Phòng tiếp nhận |
| `assignedToId` | String FK | nullable | Người xử lý |
| `attachments` | Json | nullable | Danh sách file |
| `createdAt` | DateTime | now | Ngày tạo |
| `updatedAt` | DateTime | auto update | Ngày cập nhật |

Quan hệ: có messages và tối đa một Rating.

### 8.8. `ticket_messages`

Tin nhắn trong ticket.

| Trường | Kiểu | Ý nghĩa |
|---|---|---|
| `id` | String PK | Mã tin nhắn |
| `ticketId` | String FK | Ticket |
| `senderId` | String FK | Người gửi |
| `content` | String | Nội dung |
| `createdAt` | DateTime | Thời điểm |

Xóa ticket sẽ xóa tin nhắn (`Cascade`).

### 8.9. `announcements`

Thông báo chung của trường/phòng ban.

| Trường | Kiểu | Ý nghĩa |
|---|---|---|
| `id` | String PK | Mã |
| `title` | String | Tiêu đề |
| `content` | String | Nội dung |
| `departmentId` | String FK nullable | Phòng ban liên quan |
| `tags` | Json nullable | Nhãn |
| `isPinned` | Boolean false | Ghim đầu danh sách |
| `authorId` | String nullable | ID tác giả, hiện không khai báo relation |
| `createdAt` | DateTime | Ngày tạo |
| `updatedAt` | DateTime | Ngày sửa |

Có quan hệ savedBy với `SavedAnnouncement`.

### 8.10. `saved_announcements`

Thông báo người dùng đã lưu.

| Trường | Kiểu | Ý nghĩa |
|---|---|---|
| `id` | String PK | Mã |
| `userId` | String FK | Người lưu |
| `announcementId` | String FK | Thông báo |
| `createdAt` | DateTime | Ngày lưu |

Unique kép `userId + announcementId`, không thể lưu trùng. Xóa user/thông báo sẽ xóa dòng lưu.

### 8.11. `faqs`

Câu hỏi thường gặp.

| Trường | Kiểu | Ý nghĩa |
|---|---|---|
| `id` | String PK | Mã |
| `question` | String | Câu hỏi |
| `answer` | String | Câu trả lời |
| `departmentId` | String FK nullable | Phòng ban |
| `keywords` | Json nullable | Từ khóa |
| `createdAt` | DateTime | Ngày tạo |
| `updatedAt` | DateTime | Ngày sửa |

### 8.12. `posts`

Bài viết/cộng đồng.

| Trường | Kiểu | Bắt buộc/mặc định | Ý nghĩa |
|---|---|---|---|
| `id` | String | PK, cuid | Mã |
| `title` | String | bắt buộc | Tiêu đề |
| `content` | String | bắt buộc | Nội dung |
| `category` | TicketCategory | KHAC | Nhóm bài viết |
| `authorId` | String FK | bắt buộc | Tác giả |
| `departmentId` | String FK nullable | nullable | Phòng liên quan |
| `attachments` | Json | nullable | File đính kèm |
| `likes` | Int | 0 | Số lượt thích |
| `createdAt` | DateTime | now | Ngày tạo |
| `updatedAt` | DateTime | auto update | Ngày sửa |

Có comments và reports; bài viết bị xóa thì comments/reports bị xóa theo.

### 8.13. `comments`

Bình luận bài viết.

| Trường | Kiểu | Ý nghĩa |
|---|---|---|
| `id` | String PK | Mã |
| `postId` | String FK | Bài viết |
| `authorId` | String FK | Người viết |
| `content` | String | Nội dung |
| `createdAt` | DateTime | Ngày tạo |

### 8.14. `questions`

Câu hỏi trong khu vực hỏi đáp.

| Trường | Kiểu | Mặc định | Ý nghĩa |
|---|---|---|---|
| `id` | String PK | cuid | Mã |
| `title` | String | - | Tiêu đề |
| `content` | String | - | Nội dung |
| `authorId` | String FK | - | Người hỏi |
| `isResolved` | Boolean | false | Đã giải quyết chưa |
| `createdAt` | DateTime | now | Ngày tạo |
| `updatedAt` | DateTime | auto update | Ngày sửa |

Có answers và votes; xóa câu hỏi thì xóa hai nhóm liên quan.

### 8.15. `answers`

Câu trả lời cho câu hỏi.

| Trường | Kiểu | Mặc định | Ý nghĩa |
|---|---|---|---|
| `id` | String PK | cuid | Mã |
| `questionId` | String FK | - | Câu hỏi |
| `authorId` | String FK | - | Người trả lời |
| `content` | String | - | Nội dung |
| `isAccepted` | Boolean | false | Câu trả lời được chấp nhận |
| `createdAt` | DateTime | now | Ngày tạo |

### 8.16. `question_votes`

Vote câu hỏi.

| Trường | Kiểu | Ý nghĩa |
|---|---|---|
| `id` | String PK | Mã |
| `questionId` | String FK | Câu hỏi |
| `userId` | String FK | Người vote |

Unique kép `questionId + userId`, mỗi user chỉ vote một lần cho mỗi câu hỏi.

### 8.17. `documents`

Tài liệu dùng chung theo phòng ban.

| Trường | Kiểu | Ý nghĩa |
|---|---|---|
| `id` | String PK | Mã |
| `name` | String | Tên tài liệu |
| `description` | String nullable | Mô tả |
| `category` | String | Danh mục |
| `fileUrl` | String | URL file |
| `departmentId` | String FK nullable | Phòng ban |
| `createdAt` | DateTime | Ngày tạo |

### 8.18. `notifications`

Thông báo riêng cho từng user.

| Trường | Kiểu | Mặc định | Ý nghĩa |
|---|---|---|---|
| `id` | String PK | cuid | Mã |
| `userId` | String FK | - | Người nhận |
| `title` | String | - | Tiêu đề |
| `message` | String | - | Nội dung |
| `type` | NotificationType | SYSTEM | Loại |
| `link` | String nullable | nullable | Link điều hướng |
| `isRead` | Boolean | false | Đã đọc chưa |
| `createdAt` | DateTime | now | Ngày tạo |

Xóa user sẽ xóa notification (`Cascade`).

### 8.19. `ratings`

Đánh giá dịch vụ, hồ sơ hoặc ticket.

| Trường | Kiểu | Ý nghĩa |
|---|---|---|
| `id` | String PK | Mã |
| `score` | Int | Điểm đánh giá |
| `comment` | String nullable | Nhận xét |
| `userId` | String FK | Người đánh giá |
| `serviceId` | String FK nullable | Dịch vụ được đánh giá |
| `applicationId` | String FK nullable, unique | Hồ sơ được đánh giá |
| `ticketId` | String FK nullable, unique | Ticket được đánh giá |
| `createdAt` | DateTime | Ngày tạo |

Một hồ sơ hoặc ticket chỉ có tối đa một rating. Một rating có thể liên quan service, application hoặc ticket tùy payload.

### 8.20. `reports`

Báo cáo vi phạm bài viết.

| Trường | Kiểu | Mặc định | Ý nghĩa |
|---|---|---|---|
| `id` | String PK | cuid | Mã |
| `postId` | String FK | - | Bài viết bị báo cáo |
| `reporterId` | String FK | - | Người báo cáo |
| `reason` | ReportReason | - | Lý do |
| `description` | String nullable | nullable | Mô tả thêm |
| `status` | String | PENDING | Trạng thái xử lý |
| `createdAt` | DateTime | now | Ngày tạo |

### 8.21. `audit_logs`

Nhật ký hành động quan trọng.

| Trường | Kiểu | Ý nghĩa |
|---|---|---|
| `id` | String PK | Mã |
| `userId` | String FK | Người thực hiện |
| `action` | String | Hành động, ví dụ SUBMIT, UPDATE_STATUS |
| `entityType` | String | Loại đối tượng |
| `entityId` | String | ID đối tượng |
| `details` | String nullable | Chi tiết |
| `createdAt` | DateTime | Thời điểm |

## 9. Dữ liệu seed hiện có

Seed chỉ chạy đầy đủ khi database chưa có service hoặc khi dùng `--force`/`npm run db:refresh`. Mật khẩu tất cả tài khoản mẫu là `123456` trước khi hash.

### 9.1. Phòng ban

Có khoảng 8 phòng/bộ phận hoạt động:

1. Phòng Công tác Chính trị - Sinh viên (`phong-ctsv`).
2. Phòng Đào tạo đại học (`phong-dao-tao`).
3. Bộ phận Một cửa (`bo-phan-mot-cua`).
4. Phòng Tài chính - Kế toán (`phong-tai-chinh`).
5. Bộ phận Tuyển sinh (`bo-phan-tuyen-sinh`).
6. Phòng Đào tạo Sau đại học (`phong-dao-tao-sau-dai-hoc`).
7. Phòng Hành chính - Tổng hợp (`phong-hanh-chinh-tong-hop`).
8. Phòng Kế hoạch tài chính (`phong-ke-hoach-tai-chinh`).

Hai phòng CNTT và Thư viện trong đoạn seed gốc đang bị comment; các biến `cntt` và `thuvien` thực tế trỏ tới phần tử phòng Tuyển sinh và Đào tạo Sau đại học trong mảng hiện tại. Đây là điểm cần kiểm tra nếu triển khai dữ liệu thật.

### 9.2. Tài khoản

Seed tạo khoảng 19 user:

- 1 admin: `admin@humg.edu.vn`.
- 3 nhân sự CTSV: `nv.ctsv@humg.edu.vn`, `chamsoc@humg.edu.vn`, `ql.ctsv@humg.edu.vn`.
- 1 sinh viên chính: `sv001@humg.edu.vn`, MSSV `21190001`.
- 11 sinh viên demo từ `sv002@humg.edu.vn` tới `sv012@humg.edu.vn`.
- 1 nhân viên Đào tạo: `nv.daotao@humg.edu.vn`.
- 1 quản lý Đào tạo: `ql.daotao@humg.edu.vn`.
- 1 nhân viên Tài chính: `nv.taichinh@humg.edu.vn`.

### 9.3. Dịch vụ

Seed tạo 48 dịch vụ, gồm 10 dịch vụ mẫu:

1. Đơn xin hoãn học.
2. Đơn xin bảo lưu kết quả học tập.
3. Xác nhận sinh viên.
4. Cấp lại thẻ sinh viên.
5. Đăng ký môn học.
6. Xin cấp bảng điểm.
7. Xin giấy xác nhận.
8. Tra cứu học phí.
9. Hỗ trợ tài khoản email trường.
10. Đăng ký mượn sách.

Ngoài ra có 38 thủ tục một cửa chính thức, gồm các nhóm: trình ký hành chính, chứng thực bản sao, phúc khảo, kiểm tra kết quả học tập, nhập học trở lại, thôi học, chương trình thứ hai, nghỉ học tạm thời, mở/ghép/rút học phần, xác nhận học phần, thực tập, đồ án tốt nghiệp, cấp bảng điểm/bằng, hiệu chỉnh hồ sơ, xác nhận sinh viên, chính sách sinh viên, thẻ sinh viên, điểm rèn luyện, hoãn thi, thi bù và các khoản thanh toán tài chính.

Mỗi service thường có:

- `requiredDocs`: giấy tờ phải nộp.
- `steps`: quy trình xử lý.
- `processingTime`: thời gian dự kiến.
- `submissionType`: online, trực tiếp hoặc cả hai.
- `keywords`: từ khóa tìm kiếm.
- `departmentId`: phòng tiếp nhận.

### 9.4. Hồ sơ mẫu

- 18 hồ sơ mẫu, mã từ `HD202600002` tới `HD202600019`, nhiều trạng thái khác nhau.
- 1 hồ sơ chính `HD202600001` của `sv001`, trạng thái `PROCESSING`.
- Hồ sơ chính có lịch sử `SUBMITTED`, `RECEIVED`, `PROCESSING`.
- Dữ liệu form mẫu gồm mục đích và học kỳ.
- Một số file mẫu: `don-xac-nhan-sinh-vien.pdf`, `don-xin-hoan-hoc.pdf`, `giay-xac-nhan-hoc-tap.pdf`.

### 9.5. Ticket mẫu

- 10 ticket mẫu với mã `TK202600002` tới `TK202600011`.
- 1 ticket chính `TK202600001`: không nhận được thông báo học phí.
- Category mẫu: công tác sinh viên, tài chính, học vụ.
- Trạng thái mẫu: OPEN, IN_PROGRESS, WAITING, RESOLVED.

### 9.6. Nội dung mẫu khác

- 5 FAQ về hoãn học, hồ sơ, thời gian xử lý, nộp online và học phí.
- 4 thông báo: nghỉ lễ 30/4 - 1/5, đóng học phí HK2, đăng ký môn học HK2, hướng dẫn cổng dịch vụ.
- 1 câu hỏi: thủ tục xin bảo lưu cần giấy tờ gì.
- 1 bài viết: Wifi ký túc xá chậm.
- 1 notification cho sinh viên chính về hồ sơ đã được tiếp nhận.
- Không seed sẵn service documents, documents, comments, answers, votes, ratings hoặc reports.

## 10. Upload file

Cấu hình tại `backend/src/middleware/upload.js`:

- Thư mục mặc định: `backend/uploads`.
- Kích thước tối đa: 10 MB/file.
- Đuôi cho phép: JPG, JPEG, PNG, GIF, PDF, DOC, DOCX, XLS, XLSX.
- Application: tối đa 5 file.
- Ticket: backend hỗ trợ tối đa 5 file; form frontend hiện tại chủ yếu gửi JSON.
- Post: tối đa 3 file.
- File được lưu trên disk, URL lưu trong trường JSON `attachments` hoặc `fileUrl`.

## 11. Trạng thái và mã dữ liệu

- Mã hồ sơ: hàm `generateCode('HD')`, ví dụ `HD202600001`.
- Mã ticket: hàm `generateCode('TK')`, ví dụ `TK202600001`.
- ID database: Prisma `cuid()`.
- Ngày tạo: `DateTime @default(now())`.
- Ngày cập nhật: `DateTime @updatedAt`.
- Các danh sách giấy tờ, bước, file và từ khóa được lưu dưới dạng JSON SQLite.

## 12. Điểm cần lưu ý khi viết báo cáo/triển khai

1. Database là SQLite nên phù hợp demo, đồ án hoặc hệ thống quy mô nhỏ; triển khai lớn có thể cân nhắc PostgreSQL.
2. JWT được lưu trong localStorage; cần cân nhắc HttpOnly cookie nếu yêu cầu bảo mật cao.
3. Các route chi tiết ticket/message/document/rating cần tiếp tục kiểm tra ownership nếu dùng production.
4. `GET /applications` cho các role xử lý đang xem toàn bộ hồ sơ, không giới hạn theo phòng ban.
5. Ticket list có lọc theo phòng ban đối với nhân viên có `departmentId`.
6. Một số trang frontend có dữ liệu demo fallback khi API lỗi hoặc trả rỗng; dữ liệu hiển thị vì vậy có thể không hoàn toàn là dữ liệu database.
7. Seed hiện có mapping biến `cntt`/`thuvien` cần sửa nếu muốn dữ liệu phòng CNTT và Thư viện đúng nghĩa.
8. `Announcement.authorId` là trường dữ liệu nhưng schema chưa khai báo quan hệ tới User.
9. Cần validate điểm rating, trạng thái enum và quyền sở hữu ở tầng API nếu đưa lên môi trường thật.

## 13. Kết luận

HUMG Portal bao phủ ba nhóm chức năng chính:

- Cổng thông tin: dịch vụ, phòng ban, thông báo, FAQ, tìm kiếm, bản đồ.
- Cổng giao dịch: nộp và xử lý hồ sơ, hỗ trợ ticket, notification, đánh giá.
- Cổng quản trị: người dùng, dịch vụ, phòng ban, hồ sơ, báo cáo và audit log.

Mô hình dữ liệu trung tâm xoay quanh `User`, `Department`, `Service`, `Application` và `SupportTicket`. Các bảng lịch sử, tin nhắn, notification, rating, Q&A và audit mở rộng để theo dõi toàn bộ quá trình xử lý và tương tác.

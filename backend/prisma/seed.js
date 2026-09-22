import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding HUMG Portal database...');

  // Seed chỉ tạo dữ liệu mẫu cho CSDL trống. Không xóa dữ liệu đã được
  // quản trị viên sửa trên giao diện khi chạy lại lệnh db:seed.
  const existingServices = await prisma.service.count();
  const forceSeed = process.env.FORCE_SEED === 'true' || process.argv.includes('--force');
  if (existingServices > 0 && !forceSeed) {
    console.log(`ℹ️ Database đã có ${existingServices} dịch vụ, bỏ qua seed để giữ các thay đổi hiện có.`);
    console.log('   Dùng npm run db:refresh để nạp lại dữ liệu từ seed.js.');
    return;
  }

  await prisma.auditLog.deleteMany();
  await prisma.rating.deleteMany();
  await prisma.report.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.answer.deleteMany();
  await prisma.questionVote.deleteMany();
  await prisma.question.deleteMany();
  await prisma.ticketMessage.deleteMany();
  await prisma.supportTicket.deleteMany();
  await prisma.applicationStatusHistory.deleteMany();
  await prisma.application.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.savedAnnouncement.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.fAQ.deleteMany();
  await prisma.document.deleteMany();
  await prisma.serviceDocument.deleteMany();
  await prisma.service.deleteMany();
  await prisma.user.deleteMany();
  await prisma.department.deleteMany();

  const password = await bcrypt.hash('123456', 10);

  const departments = await Promise.all([
    prisma.department.create({
      data: {
        name: 'Phòng Công tác Chính trị - Sinh viên',
        slug: 'phong-ctsv',
        description: 'Phòng phụ trách công tác sinh viên, hỗ trợ học tập, đời sống và các thủ tục hành chính liên quan đến sinh viên.',
        address: 'Tòa nhà A, Trường ĐH Mỏ - Địa chất',
        building: 'A',
        floor: '1',
        room: '101-105',
        phone: '024.3838.1234',
        email: 'ctsv@humg.edu.vn',
        workingHours: '8:00 - 17:00 (T2-T6)',
        latitude: 21.07338,
        longitude: 105.77365,
      },
    }),
    prisma.department.create({
      data: {
        name: 'Phòng Đào tạo đại học',
        slug: 'phong-dao-tao',
        description: 'Quản lý chương trình đào tạo, đăng ký môn học, bảng điểm và các thủ tục học vụ.',
        address: 'Phòng 203 nhà C12 tầng, Trường Đại học Mỏ - Địa chất',
        building: 'C',
        floor: '2',
        room: '201-210',
        phone: '024.38386214',
        email: 'phongdaotao@humg.edu.vn',
        workingHours: '8:00 - 17:00 (T2-T6)',
        latitude: 21.07358,
        longitude: 105.77391,
      },
    }),
    prisma.department.create({
      data: {
        name: 'Bộ phận Một cửa',
        slug: 'bo-phan-mot-cua',
        description: 'Tiếp nhận và trả kết quả hồ sơ hành chính tập trung cho sinh viên.',
        address: 'Tầng 1, Tòa nhà C',
        building: 'A1',
        floor: '0',
        room: '001',
        phone: '024.3838.3456',
        email: 'motcua@humg.edu.vn',
        workingHours: '7:30 - 17:30 (T2-T6)',
        latitude: 21.07332,
        longitude: 105.77344,
      },
    }),
    prisma.department.create({
      data: {
        name: 'Phòng Tài chính - Kế toán',
        slug: 'phong-tai-chinh',
        description: 'Quản lý học phí, các khoản thu chi và hỗ trợ sinh viên về tài chính.',
        address: 'Tòa nhà C',
        building: 'B1',
        floor: '1',
        room: '110-115',
        phone: '024.3838.4567',
        email: 'taichinh@humg.edu.vn',
        workingHours: '8:00 - 17:00 (T2-T6)',
        latitude: 21.07373,
        longitude: 105.77355,
      },
    }),
    // prisma.department.create({
    //   data: {
    //     name: 'Phòng CNTT',
    //     slug: 'phong-cntt',
    //     description: 'Hỗ trợ hệ thống thông tin, tài khoản sinh viên, email trường.',
    //     address: 'Tòa nhà C',
    //     building: 'C',
    //     floor: '3',
    //     room: '301-305',
    //     phone: '024.3838.5678',
    //     email: 'cntt@humg.edu.vn',
    //     workingHours: '8:00 - 17:00 (T2-T6)',
    //     latitude: 21.07355,
    //     longitude: 105.77415,
    //   },
    // }),
    // prisma.department.create({
    //   data: {
    //     name: 'Thư viện',
    //     slug: 'thu-vien',
    //     description: 'Quản lý tài liệu, mượn trả sách và hỗ trợ nghiên cứu.',
    //     address: 'Tòa nhà C',
    //     building: 'C',
    //     floor: '1-3',
    //     room: '101-320',
    //     phone: '024.3838.6789',
    //     email: 'thuvien@humg.edu.vn',
    //     workingHours: '7:30 - 21:00 (T2-T7)',
    //     latitude: 21.07388,
    //     longitude: 105.77395,
    //   },
    // }),
    prisma.department.create({
      data: {
        name: 'Bộ phận Tuyển sinh',
        slug: 'bo-phan-tuyen-sinh',
        description: 'Tư vấn và hỗ trợ thông tin tuyển sinh. ',
        address: 'Phòng 105, Nhà F, Trường Đại học Mỏ - Địa chất',
        building: 'F',
        floor: '1',
        room: '105',
        phone: '024.3838 6739',
        email: 'qhccdn@humg.edu.vn',
        workingHours: 'Liên hệ Bộ phận Tuyển sinh',
      },
    }),
    prisma.department.create({
      data: {
        name: 'Phòng Đào tạo Sau đại học',
        slug: 'phong-dao-tao-sau-dai-hoc',
        description: 'Quản lý công tác đào tạo sau đại học. ',
        address: 'Phòng 302, Tầng 3, Nhà C12, Trường Đại học Mỏ - Địa chất',
        building: 'C12',
        floor: '3',
        room: '302',
        phone: '024.38386438',
        email: 'daotaosaudaihoc@humg.edu.vn',
        workingHours: 'Liên hệ Phòng Đào tạo Sau đại học',
      },
    }),
  ]);

  const [ctsv, daotao, motcua, taichinh, cntt, thuvien] = departments;

  // Các đơn vị tiếp nhận trong danh mục thủ tục một cửa.
  const hanhchinh = await prisma.department.create({
    data: { name: 'Phòng Hành chính - Tổng hợp', slug: 'phong-hanh-chinh-tong-hop', address: 'Trường ĐH Mỏ - Địa chất', isActive: true },
  });
  const kehoachtaichinh = await prisma.department.create({
    data: { name: 'Phòng Kế hoạch tài chính', slug: 'phong-ke-hoach-tai-chinh', address: 'Trường ĐH Mỏ - Địa chất', isActive: true },
  });

  const admin = await prisma.user.create({
    data: {
      email: 'admin@humg.edu.vn',
      password,
      fullName: 'Quản trị viên Hệ thống',
      role: 'ADMIN',
    },
  });

  const staffCTSV = await prisma.user.create({
    data: {
      email: 'nv.ctsv@humg.edu.vn',
      password,
      fullName: 'Nguyễn Văn B',
      role: 'STAFF',
      departmentId: ctsv.id,
      phone: '0901234567',
    },
  });

  await prisma.user.create({
    data: {
      email: 'chamsoc@humg.edu.vn',
      password,
      fullName: 'Trần Thị C',
      role: 'STAFF',
      departmentId: ctsv.id,
      phone: '0907654321',
    },
  });

  await prisma.user.create({
    data: {
      email: 'ql.ctsv@humg.edu.vn',
      password,
      fullName: 'Lê Thu Hà',
      role: 'DEPT_MANAGER',
      departmentId: ctsv.id,
      phone: '0908881122',
    },
  });

  const student = await prisma.user.create({
    data: {
      email: 'sv001@humg.edu.vn',
      password,
      fullName: 'Nguyễn Văn A',
      role: 'STUDENT',
      studentId: '21190001',
      faculty: 'Công nghệ thông tin',
      major: 'Khoa học máy tính',
      className: 'DH21KHM01',
      phone: '0912345678',
    },
  });

  const demoStudents = [];
  for (let index = 2; index <= 12; index += 1) {
    demoStudents.push(await prisma.user.create({
      data: {
        email: `sv${String(index).padStart(3, '0')}@humg.edu.vn`,
        password,
        fullName: ['Trần Minh Anh', 'Lê Hoàng Nam', 'Phạm Thu Hà', 'Vũ Đức Long', 'Đỗ Mai Linh', 'Nguyễn Quang Huy', 'Bùi Khánh An', 'Hoàng Gia Bảo', 'Đặng Ngọc Anh', 'Phan Thành Đạt', 'Đỗ Thanh Tâm'][index - 2],
        role: 'STUDENT',
        studentId: `211900${String(index).padStart(2, '0')}`,
        faculty: index % 2 ? 'Công nghệ thông tin' : 'Kinh tế và Quản trị kinh doanh',
        major: index % 2 ? 'Khoa học máy tính' : 'Quản trị kinh doanh',
        className: index % 2 ? 'DH21KHM01' : 'DH21QTKD02',
        phone: `0912345${String(600 + index)}`,
      },
    }));
  }

  const staffDaotao = await prisma.user.create({
    data: { email: 'nv.daotao@humg.edu.vn', password, fullName: 'Phạm Minh Đức', role: 'STAFF', departmentId: daotao.id, phone: '0901112233' },
  });
  await prisma.user.create({
    data: { email: 'ql.daotao@humg.edu.vn', password, fullName: 'Nguyễn Thu Trang', role: 'DEPT_MANAGER', departmentId: daotao.id, phone: '0902223344' },
  });
  await prisma.user.create({
    data: { email: 'nv.taichinh@humg.edu.vn', password, fullName: 'Đặng Quốc Việt', role: 'STAFF', departmentId: taichinh.id, phone: '0903334455' },
  });

  const servicesData = [
    {
      name: 'Đơn xin hoãn học',
      slug: 'don-xin-hoan-hoc',
      category: 'CONG_TAC_SINH_VIEN',
      departmentId: ctsv.id,
      description: 'Sinh viên xin hoãn học do lý do cá nhân hoặc sức khỏe.',
      requiredDocs: ['Đơn xin hoãn học', 'Giấy xác nhận lý do (nếu có)', 'CCCD/CMND'],
      steps: ['Điền biểu mẫu online', 'Upload giấy tờ', 'Chờ phòng CTSV xét duyệt', 'Nhận kết quả'],
      processingTime: '3-5 ngày làm việc',
      submissionType: 'Online',
      keywords: ['hoãn học', 'tạm dừng', 'nghỉ học'],
    },
    {
      name: 'Đơn xin bảo lưu kết quả học tập',
      slug: 'don-xin-bao-luu',
      category: 'CONG_TAC_SINH_VIEN',
      departmentId: ctsv.id,
      description: 'Bảo lưu kết quả học tập khi sinh viên có lý do chính đáng.',
      requiredDocs: ['Đơn xin bảo lưu', 'CCCD', 'Giấy tờ liên quan'],
      steps: ['Nộp đơn online', 'Xét duyệt', 'Nhận quyết định'],
      processingTime: '5-7 ngày',
      submissionType: 'Online',
      keywords: ['bảo lưu', 'kết quả học tập'],
    },
    {
      name: 'Xác nhận sinh viên',
      slug: 'xac-nhan-sinh-vien',
      category: 'CONG_TAC_SINH_VIEN',
      departmentId: ctsv.id,
      description: 'Cấp giấy xác nhận sinh viên đang theo học tại trường.',
      requiredDocs: ['Đơn đề nghị', 'CCCD', 'Thẻ sinh viên'],
      steps: ['Điền form', 'Nộp online', 'Nhận giấy xác nhận'],
      processingTime: '2 ngày',
      submissionType: 'Online',
      keywords: ['xác nhận', 'sinh viên', 'giấy xác nhận'],
    },
    {
      name: 'Cấp lại thẻ sinh viên',
      slug: 'cap-lai-the-sinh-vien',
      category: 'CONG_TAC_SINH_VIEN',
      departmentId: ctsv.id,
      description: 'Cấp lại thẻ sinh viên khi bị mất hoặc hỏng.',
      requiredDocs: ['Đơn đề nghị', 'CCCD', 'Ảnh 3x4', 'Biên lai nộp phí'],
      steps: ['Nộp hồ sơ', 'Đóng phí', 'Chờ cấp thẻ mới'],
      processingTime: '7-10 ngày',
      submissionType: 'Trực tiếp/Online',
      keywords: ['thẻ sinh viên', 'mất thẻ', 'cấp lại'],
    },
    {
      name: 'Đăng ký môn học',
      slug: 'dang-ky-mon-hoc',
      category: 'HOC_VU',
      departmentId: daotao.id,
      description: 'Đăng ký môn học theo kỳ học.',
      requiredDocs: ['Tài khoản sinh viên'],
      steps: ['Đăng nhập hệ thống', 'Chọn môn', 'Xác nhận'],
      processingTime: 'Theo lịch đăng ký',
      submissionType: 'Online',
      keywords: ['đăng ký môn', 'học phần'],
    },
    {
      name: 'Xin cấp bảng điểm',
      slug: 'xin-cap-bang-diem',
      category: 'HOC_VU',
      departmentId: daotao.id,
      description: 'Cấp bảng điểm học tập chính thức.',
      requiredDocs: ['Đơn đề nghị', 'CCCD'],
      steps: ['Nộp đơn', 'Thanh toán phí', 'Nhận bảng điểm'],
      processingTime: '3 ngày',
      submissionType: 'Online',
      keywords: ['bảng điểm', 'transcript'],
    },
    {
      name: 'Xin giấy xác nhận',
      slug: 'xin-giay-xac-nhan',
      category: 'CONG_TAC_SINH_VIEN',
      departmentId: motcua.id,
      description: 'Tiếp nhận hồ sơ xin cấp các loại giấy xác nhận qua bộ phận một cửa.',
      requiredDocs: ['Đơn đề nghị', 'CCCD', 'Thẻ sinh viên'],
      steps: ['Nộp hồ sơ tại một cửa', 'Theo dõi online', 'Nhận kết quả'],
      processingTime: '2-3 ngày',
      submissionType: 'Online/Trực tiếp',
      keywords: ['xác nhận', 'một cửa', 'giấy tờ'],
    },
    {
      name: 'Tra cứu học phí',
      slug: 'tra-cuu-hoc-phi',
      category: 'TAI_CHINH',
      departmentId: taichinh.id,
      description: 'Tra cứu và hỗ trợ vấn đề liên quan học phí.',
      requiredDocs: ['MSSV'],
      steps: ['Tra cứu online', 'Liên hệ nếu có vấn đề'],
      processingTime: '1 ngày',
      submissionType: 'Online',
      keywords: ['học phí', 'thanh toán', 'công nợ'],
    },
    {
      name: 'Hỗ trợ tài khoản email trường',
      slug: 'ho-tro-email-truong',
      category: 'CNTT',
      departmentId: cntt.id,
      description: 'Reset mật khẩu, hỗ trợ email sinh viên @humg.edu.vn.',
      requiredDocs: ['MSSV', 'CCCD'],
      steps: ['Gửi yêu cầu', 'Xác minh', 'Reset mật khẩu'],
      processingTime: '1-2 ngày',
      submissionType: 'Online',
      keywords: ['email', 'mật khẩu', 'tài khoản', 'cntt'],
    },
    {
      name: 'Đăng ký mượn sách',
      slug: 'dang-ky-muon-sach',
      category: 'THU_VIEN',
      departmentId: thuvien.id,
      description: 'Đăng ký mượn sách tại thư viện trường.',
      requiredDocs: ['Thẻ thư viện'],
      steps: ['Tìm sách', 'Đăng ký mượn', 'Nhận sách'],
      processingTime: 'Trong ngày',
      submissionType: 'Trực tiếp/Online',
      keywords: ['mượn sách', 'thư viện'],
    },
  ];

  const officialProcedures = [
    ['Trình ký các văn bản, giấy tờ giải quyết các công việc hành chính đối với các tập thể, cá nhân trong và ngoài Trường', hanhchinh.id, 'KHAC', '1/2 ngày', 1],
    ['Chứng thực bản sao từ bản chính văn bằng, chứng chỉ, hồ sơ, bảng điểm', hanhchinh.id, 'KHAC', '1/2 ngày', 2],
    ['Phúc khảo điểm thi kết thúc học phần', hanhchinh.id, 'HOC_VU', '10 ngày', 3],
    ['Kiểm tra kết quả học tập', hanhchinh.id, 'HOC_VU', '5 ngày', 4],
    ['Nhập học trở lại đối với sinh viên nghỉ học tạm thời', daotao.id, 'HOC_VU', '5 ngày', 5],
    ['Thôi học', daotao.id, 'HOC_VU', '5 ngày', 6],
    ['Học chương trình thứ 2', daotao.id, 'HOC_VU', '3 ngày', 7],
    ['Nghỉ học tạm thời', daotao.id, 'HOC_VU', '5 ngày', 8],
    ['Mở lớp theo yêu cầu (cho sinh viên năm cuối)', daotao.id, 'HOC_VU', '3 ngày', 9],
    ['Ghép lớp', daotao.id, 'HOC_VU', '2 ngày', 10],
    ['Rút bớt học phần', daotao.id, 'HOC_VU', '2 ngày', 11],
    ['Xác nhận học phần tương đương, học phần thay thế', daotao.id, 'HOC_VU', '2 ngày', 12],
    ['Xác nhận học phần tự chọn không tham gia tính điểm', daotao.id, 'HOC_VU', '2 ngày', 13],
    ['Đi thực tập sản xuất (TTSX), thực tập tốt nghiệp / doanh nghiệp (TTTN / TTDN)', daotao.id, 'HOC_VU', '10 ngày', 14],
    ['Đổi địa điểm thực tập sản xuất, thực tập tốt nghiệp / doanh nghiệp', daotao.id, 'HOC_VU', '5 ngày', 15],
    ['Làm đồ án tốt nghiệp / khóa luận tốt nghiệp (ĐATN / KLTN)', daotao.id, 'HOC_VU', '10 ngày', 16],
    ['Bảo vệ đồ án tốt nghiệp / khóa luận tốt nghiệp', daotao.id, 'HOC_VU', '10 ngày', 17],
    ['Cấp lại bảng điểm', daotao.id, 'HOC_VU', '7 ngày', 18],
    ['Cấp giấy chứng nhận đã bảo vệ đồ án tốt nghiệp', daotao.id, 'HOC_VU', '3 ngày', 19],
    ['Cấp bản sao bằng tốt nghiệp đại học, cao đẳng thay bằng đã mất', daotao.id, 'HOC_VU', '5 ngày', 20],
    ['Cấp lại mật khẩu đăng ký học phần', daotao.id, 'HOC_VU', '1 ngày', 21],
    ['Hiệu chỉnh thông tin hồ sơ', daotao.id, 'HOC_VU', '2 ngày', 22],
    ['Xác nhận thông tin sinh viên theo yêu cầu', ctsv.id, 'CONG_TAC_SINH_VIEN', '2 ngày', 23],
    ['Xác nhận làm thẻ xe buýt', ctsv.id, 'CONG_TAC_SINH_VIEN', '2 ngày', 24],
    ['Xác nhận chế độ chính sách tại địa phương', ctsv.id, 'CONG_TAC_SINH_VIEN', '2 ngày', 25],
    ['Cấp giấy giới thiệu', ctsv.id, 'CONG_TAC_SINH_VIEN', '2 ngày', 26],
    ['Vay vốn ngân hàng chính sách', ctsv.id, 'CONG_TAC_SINH_VIEN', '2 ngày', 27],
    ['Xác nhận là Sinh viên không vi phạm kỷ luật', ctsv.id, 'CONG_TAC_SINH_VIEN', '2 ngày', 28],
    ['Xác nhận là Sinh viên đã từng học tại trường', ctsv.id, 'CONG_TAC_SINH_VIEN', '2 ngày', 29],
    ['Đề nghị miễn giảm học phí, hỗ trợ chi phí học tập, xét trợ cấp xã hội', ctsv.id, 'CONG_TAC_SINH_VIEN', '40 ngày', 30],
    ['Đề nghị giải quyết chế độ bảo hiểm thân thể', ctsv.id, 'CONG_TAC_SINH_VIEN', '33 ngày', 31],
    ['Đề nghị cấp lại thẻ sinh viên', ctsv.id, 'CONG_TAC_SINH_VIEN', '2 ngày', 32],
    ['Xác nhận điểm rèn luyện', ctsv.id, 'CONG_TAC_SINH_VIEN', '3 ngày', 33],
    ['Xin hoãn thi kết thúc học phần', daotao.id, 'HOC_VU', '2 ngày', 34],
    ['Xin thi bù do hoãn thi kết thúc học phần', daotao.id, 'HOC_VU', '2 ngày', 35],
    ['Thanh toán tiền hỗ trợ thực tập tốt nghiệp', kehoachtaichinh.id, 'TAI_CHINH', '3 ngày', 36],
    ['Thanh toán tiền Tết Nguyên đán cho sinh viên', kehoachtaichinh.id, 'TAI_CHINH', '2 ngày', 37],
    ['Thanh toán tiền học phí (đóng dư) cho người học', kehoachtaichinh.id, 'TAI_CHINH', '2 ngày', 38],
  ];

  const officialProcedureMeta = {
    'Trình ký các văn bản, giấy tờ giải quyết các công việc hành chính đối với các tập thể, cá nhân trong và ngoài Trường': {
      description: 'Tiếp nhận, kiểm tra và trình ký các văn bản, giấy tờ hành chính cho cá nhân, đơn vị trong và ngoài trường theo đúng quy trình quản lý văn thư.',
      requiredDocs: ['Đơn đề nghị trình ký hoặc yêu cầu giải quyết', 'Văn bản, giấy tờ cần trình ký/giải quyết', 'Bản sao có xác nhận kèm theo bản chính (nếu có)', 'Giấy uỷ quyền hoặc văn bản ủy quyền (nếu được ủy quyền)'],
      steps: ['Sinh viên hoặc đơn vị nộp hồ sơ tại bộ phận một cửa hoặc qua hệ thống.', 'Nhân viên tiếp nhận kiểm tra tính hợp lệ của hồ sơ và văn bản.', 'Phòng Hành chính - Tổng hợp thẩm định và trình cấp có thẩm quyền ký.', 'Trả kết quả và lưu hồ sơ theo quy định.'],
      keywords: ['trình ký', 'văn bản', 'hành chính', 'một cửa'],
    },
    'Chứng thực bản sao từ bản chính văn bằng, chứng chỉ, hồ sơ, bảng điểm': {
      description: 'Chứng thực bản sao từ bản chính các văn bằng, chứng chỉ, bảng điểm và hồ sơ cá nhân theo quy định của trường.',
      requiredDocs: ['Bản chính văn bằng/chứng chỉ/bảng điểm/hồ sơ cần chứng thực', 'Giấy tờ tùy thân: CCCD/CMND hoặc thẻ sinh viên', 'Đơn đề nghị chứng thực (nếu trường yêu cầu)'],
      steps: ['Nộp hồ sơ và bản chính cần chứng thực.', 'Nhân viên đối chiếu bản sao với bản chính.', 'Lập biên bản/chứng thực theo mẫu quy định.', 'Nhận kết quả và lưu hồ sơ.'],
      keywords: ['chứng thực', 'bản sao', 'văn bằng', 'bảng điểm'],
    },
    'Phúc khảo điểm thi kết thúc học phần': {
      description: 'Tiếp nhận đơn phúc khảo điểm thi kết thúc học phần nhằm kiểm tra lại kết quả thi theo quy chế đào tạo.',
      requiredDocs: ['Đơn đề nghị phúc khảo', 'Bản sao/ảnh chụp thẻ sinh viên hoặc CCCD', 'Phiếu dự thi / kết quả thi cần phúc khảo'],
      steps: ['Sinh viên nộp đơn phúc khảo trong thời hạn quy định.', 'Phòng Đào tạo kiểm tra điều kiện và hồ sơ.', 'Tổ chức chấm lại hoặc xem xét theo quy trình.', 'Thông báo kết quả phúc khảo và cập nhật điểm.'],
      keywords: ['phúc khảo', 'điểm thi', 'học phần'],
    },
    'Kiểm tra kết quả học tập': {
      description: 'Hỗ trợ sinh viên kiểm tra, đối chiếu và xác nhận kết quả học tập theo từng học kỳ hoặc cả khóa học.',
      requiredDocs: ['Đơn đề nghị kiểm tra kết quả học tập', 'CCCD/CMND', 'Bảng điểm/biên lai học phí hoặc thông tin học tập liên quan'],
      steps: ['Sinh viên gửi yêu cầu kiểm tra kết quả học tập.', 'Phòng Đào tạo đối chiếu dữ liệu trong hệ thống.', 'Xác nhận điểm, tín chỉ và kết quả học tập.', 'Cung cấp bảng điểm hoặc thông báo kết quả.'],
      keywords: ['kiểm tra điểm', 'kết quả học tập', 'bảng điểm'],
    },
    'Nhập học trở lại đối với sinh viên nghỉ học tạm thời': {
      description: 'Thủ tục sinh viên trở lại học tập sau thời gian nghỉ học tạm thời theo quy định của nhà trường.',
      requiredDocs: ['Đơn xin nhập học trở lại', 'Bằng, giấy tờ xác nhận lý do nghỉ học tạm thời', 'CCCD/CMND', 'Học bạ hoặc hồ sơ liên quan (nếu cần)'],
      steps: ['Sinh viên nộp đơn xin nhập học trở lại.', 'Phòng Đào tạo kiểm tra thời gian nghỉ học và điều kiện tiếp tục học.', 'Xét duyệt và bố trí kế hoạch học tập.', 'Thông báo kết quả và hoàn tất thủ tục nhập học.'],
      keywords: ['nhập học trở lại', 'nghỉ học tạm thời'],
    },
    'Thôi học': {
      description: 'Thủ tục xin thôi học theo quy định của nhà trường khi sinh viên không tiếp tục học.',
      requiredDocs: ['Đơn xin thôi học', 'CCCD/CMND', 'Giấy xác nhận lý do thôi học (nếu có)', 'Bảng điểm hoặc hồ sơ học tập liên quan'],
      steps: ['Sinh viên nộp đơn thôi học.', 'Phòng Đào tạo xác minh thông tin và lý do.', 'Xét duyệt theo điều kiện chính sách.', 'Cấp quyết định thôi học và hoàn tất hồ sơ.'],
      keywords: ['thôi học', 'rút học'],
    },
    'Học chương trình thứ 2': {
      description: 'Hồ sơ và quy trình xét học chương trình thứ 2 theo quy định đào tạo của trường.',
      requiredDocs: ['Đơn đăng ký học chương trình thứ 2', 'Bảng điểm học kỳ gần nhất', 'CCCD/CMND', 'Giấy xác nhận đủ điều kiện theo quy định'],
      steps: ['Sinh viên nộp đơn và hồ sơ đăng ký.', 'Phòng Đào tạo xem xét điều kiện và năng lực học tập.', 'Đánh giá môn học và kế hoạch học tập.', 'Thông báo kết quả và lập danh sách học sinh được phép học.'],
      keywords: ['chương trình thứ 2', 'đăng ký học', 'học thêm'],
    },
    'Nghỉ học tạm thời': {
      description: 'Thủ tục xin nghỉ học tạm thời vì lý do cá nhân, sức khỏe hoặc hoàn cảnh gia đình.',
      requiredDocs: ['Đơn xin nghỉ học tạm thời', 'Giấy xác nhận sức khỏe/hoàn cảnh gia đình (nếu có)', 'CCCD/CMND', 'Bảng điểm hoặc hồ sơ học tập liên quan'],
      steps: ['Sinh viên nộp hồ sơ xin nghỉ học tạm thời.', 'Phòng Đào tạo xem xét lý do và thời gian nghỉ.', 'Xác nhận tình trạng học tập.', 'Cấp quyết định và hướng dẫn tiếp tục học sau khi trở lại.'],
      keywords: ['nghỉ học', 'tạm thời', 'xin nghỉ'],
    },
    'Mở lớp theo yêu cầu (cho sinh viên năm cuối)': {
      description: 'Thủ tục yêu cầu mở lớp học phần nhằm hỗ trợ sinh viên năm cuối đủ điều kiện tốt nghiệp.',
      requiredDocs: ['Đơn đề nghị mở lớp', 'Danh sách sinh viên đủ điều kiện', 'Kế hoạch học tập cá nhân', 'Thông tin học phần cần mở'],
      steps: ['Sinh viên hoặc khóa nộp yêu cầu mở lớp.', 'Phòng Đào tạo thẩm định số lượng và điều kiện tổ chức lớp.', 'Tổ chức đăng ký và mở lớp theo quy định.', 'Thông báo thời gian học và danh sách sinh viên được tham gia.'],
      keywords: ['mở lớp', 'nhóm học', 'sinh viên năm cuối'],
    },
    'Ghép lớp': {
      description: 'Thủ tục ghép lớp khi sinh viên cần chuyển sang lớp học phù hợp với kế hoạch đào tạo.',
      requiredDocs: ['Đơn đề nghị ghép lớp', 'Bảng điểm / kế hoạch học tập hiện tại', 'CCCD/CMND', 'Xác nhận của khoa/giảng viên (nếu có)'],
      steps: ['Sinh viên nộp đơn đề nghị ghép lớp.', 'Phòng Đào tạo kiểm tra điều kiện và khả năng phù hợp.', 'Xét lớp dự kiến và điều chỉnh lịch học.', 'Ra quyết định và cập nhật hệ thống.'],
      keywords: ['ghép lớp', 'đổi lớp'],
    },
    'Rút bớt học phần': {
      description: 'Thủ tục rút bớt học phần trong kỳ học theo quy định của chương trình đào tạo.',
      requiredDocs: ['Đơn đề nghị rút bớt học phần', 'Kế hoạch học tập và danh sách đăng ký hiện tại', 'CCCD/CMND', 'Xác nhận của cố vấn học tập (nếu áp dụng)'],
      steps: ['Sinh viên gửi đơn rút bớt học phần.', 'Phòng Đào tạo xác nhận thời hạn và số tín chỉ còn lại.', 'Kiểm tra ảnh hưởng đến kế hoạch học tập.', 'Cập nhật lịch đăng ký và xác nhận kết quả.'],
      keywords: ['rút học phần', 'đăng ký môn', 'học phần'],
    },
    'Xác nhận học phần tương đương, học phần thay thế': {
      description: 'Xác nhận học phần tương đương hoặc thay thế để sinh viên được miễn học phần khi có chứng nhận phù hợp.',
      requiredDocs: ['Đơn đề nghị xác nhận tương đương/thay thế', 'Bảng điểm hoặc chứng chỉ học phần đã học', 'Syllabus / đề cương học phần', 'CCCD/CMND'],
      steps: ['Sinh viên nộp đơn và minh chứng học phần đã hoàn thành.', 'Phòng Đào tạo đối chiếu nội dung, tín chỉ và chương trình đào tạo.', 'Xét và xác nhận học phần tương đương/thay thế.', 'Cập nhật dữ liệu và thông báo kết quả.'],
      keywords: ['học phần tương đương', 'thay thế', 'xác nhận học phần'],
    },
    'Xác nhận học phần tự chọn không tham gia tính điểm': {
      description: 'Thủ tục xác nhận học phần tự chọn không tham gia tính điểm theo quy chế đào tạo.',
      requiredDocs: ['Đơn đề nghị xác nhận học phần tự chọn', 'Kế hoạch học tập và danh sách học phần đã đăng ký', 'CCCD/CMND', 'Thông tin học phần tự chọn'],
      steps: ['Sinh viên nộp yêu cầu xác nhận học phần tự chọn.', 'Phòng Đào tạo kiểm tra điều kiện và phù hợp với chương trình.', 'Xác nhận học phần không tính điểm.', 'Thông báo kết quả cho sinh viên.'],
      keywords: ['học phần tự chọn', 'không tính điểm'],
    },
    'Đi thực tập sản xuất (TTSX), thực tập tốt nghiệp / doanh nghiệp (TTTN / TTDN)': {
      description: 'Thủ tục đăng ký, xét duyệt và điều chỉnh địa điểm thực tập sản xuất hoặc thực tập doanh nghiệp theo kế hoạch đào tạo.',
      requiredDocs: ['Đơn đăng ký thực tập', 'Giấy giới thiệu hoặc thông tin doanh nghiệp', 'Kế hoạch thực tập', 'CCCD/CMND', 'Bảng điểm và kết quả học tập'],
      steps: ['Sinh viên đăng ký và nộp hồ sơ thực tập.', 'Phòng Đào tạo kiểm tra điều kiện và kế hoạch thực tập.', 'Xét duyệt địa điểm và thời gian thực tập.', 'Cập nhật danh sách và hướng dẫn thực tập.'],
      keywords: ['thực tập sản xuất', 'thực tập doanh nghiệp', 'TTSX'],
    },
    'Đổi địa điểm thực tập sản xuất, thực tập tốt nghiệp / doanh nghiệp': {
      description: 'Hồ sơ và quy trình xin đổi địa điểm thực tập sản xuất hoặc thực tập doanh nghiệp khi có lý do chính đáng.',
      requiredDocs: ['Đơn đề nghị đổi địa điểm thực tập', 'Lý do đổi địa điểm', 'Thông tin địa điểm cũ và mới', 'CCCD/CMND'],
      steps: ['Sinh viên nộp đơn đổi địa điểm thực tập.', 'Phòng Đào tạo xem xét điều kiện và lý do.', 'Tư vấn và phê duyệt địa điểm thay thế.', 'Thông báo quyết định và cập nhật hồ sơ.'],
      keywords: ['đổi địa điểm thực tập', 'thực tập doanh nghiệp'],
    },
    'Làm đồ án tốt nghiệp / khóa luận tốt nghiệp (ĐATN / KLTN)': {
      description: 'Thủ tục đăng ký và thực hiện đồ án tốt nghiệp hoặc khóa luận tốt nghiệp theo quy định của khoa và nhà trường.',
      requiredDocs: ['Đơn đăng ký ĐATN/KLTN', 'Kế hoạch thực hiện đề tài', 'Thẻ sinh viên/CCCD', 'Bảng điểm và điều kiện học tập'],
      steps: ['Sinh viên đăng ký đề tài và đề xuất hướng nghiên cứu.', 'Khoa/Phòng Đào tạo xét duyệt đề tài và giảng viên hướng dẫn.', 'Phê duyệt tiến độ và thực hiện đồ án.', 'Bảo vệ và công nhận kết quả.'],
      keywords: ['đồ án tốt nghiệp', 'khóa luận', 'ĐATN'],
    },
    'Bảo vệ đồ án tốt nghiệp / khóa luận tốt nghiệp': {
      description: 'Thủ tục đăng ký hưởng ứng và tổ chức bảo vệ đồ án hoặc khóa luận tốt nghiệp.',
      requiredDocs: ['Đơn đăng ký bảo vệ', 'Bản thuyết minh / báo cáo đồ án', 'Phiếu xác nhận hoàn thành của giảng viên hướng dẫn', 'CCCD/CMND'],
      steps: ['Sinh viên nộp hồ sơ bảo vệ và bản báo cáo.', 'Phòng Đào tạo xác nhận điều kiện bảo vệ.', 'Lập lịch hội đồng bảo vệ và thông báo.', 'Bảo vệ và công nhận kết quả tốt nghiệp.'],
      keywords: ['bảo vệ đồ án', 'khóa luận', 'tốt nghiệp'],
    },
    'Cấp lại bảng điểm': {
      description: 'Cấp lại bảng điểm cho sinh viên khi mất, hỏng hoặc cần cập nhật thông tin học tập.',
      requiredDocs: ['Đơn đề nghị cấp lại bảng điểm', 'CCCD/CMND', 'Thẻ sinh viên', 'Thông tin về khóa học hoặc lớp'],
      steps: ['Sinh viên nộp đơn và minh chứng.', 'Phòng Đào tạo đối chiếu dữ liệu trong hệ thống.', 'In bảng điểm chính thức theo dạng mẫu.', 'Giao bảng điểm cho sinh viên hoặc chuyển qua hệ thống.'],
      keywords: ['cấp lại bảng điểm', 'transcript'],
    },
    'Cấp giấy chứng nhận đã bảo vệ đồ án tốt nghiệp': {
      description: 'Thủ tục cấp giấy chứng nhận đã bảo vệ đồ án tốt nghiệp cho sinh viên đã hoàn thành bảo vệ.',
      requiredDocs: ['Đơn đề nghị cấp giấy chứng nhận', 'Bản sao quyết định bảo vệ hoặc kết quả bảo vệ', 'CCCD/CMND', 'Bảng điểm / hồ sơ sinh viên'],
      steps: ['Sinh viên gửi yêu cầu cấp giấy chứng nhận.', 'Phòng Đào tạo kiểm tra hồ sơ bảo vệ.', 'Duyệt và lập giấy chứng nhận.', 'Trả kết quả cho sinh viên.'],
      keywords: ['giấy chứng nhận bảo vệ', 'đồ án tốt nghiệp'],
    },
    'Cấp bản sao bằng tốt nghiệp đại học, cao đẳng thay bằng đã mất': {
      description: 'Cấp bản sao bằng tốt nghiệp hoặc bằng cao đẳng thay cho bằng đã mất, hỏng hoặc không còn nguyên vẹn.',
      requiredDocs: ['Đơn đề nghị cấp bản sao bằng', 'Bản chính/giấy tờ xác thực bằng đã mất', 'CCCD/CMND', 'Giấy xác nhận sự việc mất bằng (nếu có)'],
      steps: ['Sinh viên nộp hồ sơ yêu cầu cấp bản sao bằng.', 'Phòng Đào tạo đối chiếu hồ sơ và dữ liệu học tập.', 'Xét duyệt theo quy định về bản sao, sao lục và bằng thay.', 'Cấp giấy xác nhận hoặc bản sao và lưu hồ sơ.'],
      keywords: ['bằng tốt nghiệp', 'bản sao bằng', 'thay bằng'],
    },
    'Cấp lại mật khẩu đăng ký học phần': {
      description: 'Hỗ trợ cấp lại mật khẩu đăng ký học phần khi sinh viên quên mật khẩu hoặc không truy cập được hệ thống.',
      requiredDocs: ['Đơn đề nghị cấp lại mật khẩu', 'CCCD/CMND', 'Mã số sinh viên', 'Thông tin tài khoản đăng ký học phần'],
      steps: ['Sinh viên nộp yêu cầu cấp lại mật khẩu.', 'Phòng Đào tạo xác minh thông tin tài khoản.', 'Yêu cầu hoặc cấp lại tài khoản đăng ký học phần.', 'Thông báo kết quả và hướng dẫn sử dụng.'],
      keywords: ['mật khẩu đăng ký học phần', 'quên mật khẩu'],
    },
    'Hiệu chỉnh thông tin hồ sơ': {
      description: 'Thủ tục hiệu chỉnh thông tin hồ sơ cá nhân, học tập hoặc kết quả học tập khi có sai sót cần cập nhật.',
      requiredDocs: ['Đơn đề nghị hiệu chỉnh hồ sơ', 'Bản sao giấy tờ cần chỉnh sửa', 'CCCD/CMND', 'Hồ sơ gốc hoặc minh chứng thay đổi'],
      steps: ['Sinh viên nộp đơn và minh chứng thay đổi.', 'Phòng Đào tạo kiểm tra dữ liệu hiện tại.', 'Xác nhận sự kiện cần điều chỉnh.', 'Cập nhật hồ sơ và thông báo.'],
      keywords: ['hiệu chỉnh hồ sơ', 'sửa thông tin'],
    },
    'Xác nhận thông tin sinh viên theo yêu cầu': {
      description: 'Cấp giấy xác nhận thông tin sinh viên để sử dụng cho các mục đích cá nhân, học tập, hoặc xin hỗ trợ.',
      requiredDocs: ['Đơn đề nghị xác nhận thông tin', 'CCCD/CMND', 'Thẻ sinh viên', 'Giấy tờ hoặc văn bản yêu cầu xác nhận'],
      steps: ['Sinh viên nộp đơn và yêu cầu xác nhận.', 'Phòng CTSV kiểm tra thông tin trong hồ sơ.', 'Xác nhận trạng thái sinh viên và thông tin cần ghi nhận.', 'Phát giấy xác nhận hoặc gửi kết quả.'],
      keywords: ['xác nhận sinh viên', 'thông tin sinh viên'],
    },
    'Xác nhận làm thẻ xe buýt': {
      description: 'Hỗ trợ sinh viên xác nhận đủ điều kiện để làm thẻ xe buýt hoặc hỗ trợ đi lại theo chính sách của trường.',
      requiredDocs: ['Đơn đề nghị xác nhận', 'CCCD/CMND', 'Thẻ sinh viên', 'Thông tin đính kèm cần thiết cho thẻ xe buýt'],
      steps: ['Sinh viên nộp đơn và hồ sơ.', 'Phòng CTSV đối chiếu thông tin sinh viên.', 'Xác nhận điều kiện làm thẻ xe buýt.', 'Giao giấy xác nhận và hướng dẫn tiếp tục.'],
      keywords: ['thẻ xe buýt', 'xác nhận đi lại'],
    },
    'Xác nhận chế độ chính sách tại địa phương': {
      description: 'Xác nhận chế độ chính sách theo nơi cư trú hoặc địa phương để sinh viên được hưởng hỗ trợ theo quy định.',
      requiredDocs: ['Đơn đề nghị xác nhận chính sách', 'CCCD/CMND', 'Giấy tờ xác nhận địa phương', 'Thẻ sinh viên hoặc Hồ sơ sinh viên'],
      steps: ['Sinh viên nộp đơn yêu cầu xác nhận chính sách.', 'Phòng CTSV kiểm tra điều kiện sinh viên và địa phương.', 'Xác nhận chế độ hỗ trợ theo quy định.', 'Trả giấy xác nhận cho sinh viên.'],
      keywords: ['chính sách địa phương', 'xác nhận chính sách'],
    },
    'Cấp giấy giới thiệu': {
      description: 'Cấp giấy giới thiệu cho sinh viên khi cần xác nhận và giới thiệu tới cơ quan, địa phương hoặc đối tác liên quan.',
      requiredDocs: ['Đơn đề nghị cấp giấy giới thiệu', 'CCCD/CMND', 'Thẻ sinh viên', 'Lý do và nơi cần giấy giới thiệu'],
      steps: ['Sinh viên nộp hồ sơ và đơn đề nghị.', 'Phòng CTSV xem xét nhu cầu và thông tin cá nhân.', 'Lập giấy giới thiệu.', 'Cấp kết quả và hướng dẫn sử dụng.'],
      keywords: ['giấy giới thiệu', 'xác nhận đi làm'],
    },
    'Vay vốn ngân hàng chính sách': {
      description: 'Hỗ trợ sinh viên thực hiện thủ tục vay vốn ngân hàng chính sách theo chính sách tín dụng cho sinh viên.',
      requiredDocs: ['Đơn đề nghị vay vốn', 'CCCD/CMND', 'Thẻ sinh viên', 'Giấy tờ xác nhận hoàn cảnh tài chính hoặc hộ khẩu'],
      steps: ['Sinh viên nộp hồ sơ vay vốn.', 'Phòng CTSV xác minh điều kiện và hoàn cảnh.', 'Tư vấn và hỗ trợ hoàn thiện hồ sơ.', 'Kết nối với ngân hàng hoặc cung cấp giấy xác nhận.'],
      keywords: ['vay vốn', 'ngân hàng chính sách'],
    },
    'Xác nhận là Sinh viên không vi phạm kỷ luật': {
      description: 'Cấp giấy xác nhận sinh viên không vi phạm kỷ luật phục vụ cho các mục đích liên quan đến học tập, việc làm hoặc hỗ trợ khác.',
      requiredDocs: ['Đơn đề nghị xác nhận', 'CCCD/CMND', 'Thẻ sinh viên', 'Các giấy tờ liên quan nếu có'],
      steps: ['Sinh viên nộp đơn và hồ sơ.', 'Phòng CTSV kiểm tra hồ sơ kỷ luật của sinh viên.', 'Xác nhận tình trạng không vi phạm kỷ luật.', 'Cấp giấy xác nhận.'],
      keywords: ['không vi phạm kỷ luật', 'xác nhận kỷ luật'],
    },
    'Xác nhận là Sinh viên đã từng học tại trường': {
      description: 'Cấp giấy xác nhận sinh viên đã từng học tập tại trường khi có nhu cầu sử dụng hồ sơ, chứng nhận hoặc giải quyết công việc.',
      requiredDocs: ['Đơn đề nghị xác nhận', 'CCCD/CMND', 'Thẻ sinh viên hoặc hồ sơ cũ', 'Thông tin khóa học / năm học liên quan'],
      steps: ['Sinh viên nộp yêu cầu xác nhận.', 'Phòng CTSV kiểm tra hồ sơ lưu trữ.', 'Xác nhận thời gian và trạng thái học tập.', 'Phát giấy xác nhận.'],
      keywords: ['đã từng học', 'xác nhận học tập'],
    },
    'Đề nghị miễn giảm học phí, hỗ trợ chi phí học tập, xét trợ cấp xã hội': {
      description: 'Thủ tục xét miễn giảm học phí, hỗ trợ chi phí học tập hoặc trợ cấp xã hội dành cho sinh viên có hoàn cảnh khó khăn.',
      requiredDocs: ['Đơn đề nghị hỗ trợ', 'Giấy xác nhận hộ nghèo/cận nghèo hoặc hoàn cảnh khó khăn', 'CCCD/CMND', 'Hộ khẩu gia đình', 'Bảng điểm hoặc minh chứng học tập'],
      steps: ['Sinh viên nộp hồ sơ theo từng đối tượng hỗ trợ.', 'Phòng CTSV kiểm tra điều kiện và hồ sơ.', 'Xét duyệt theo tiêu chí chính sách.', 'Trình duyệt và thông báo kết quả hỗ trợ.'],
      keywords: ['miễn giảm học phí', 'trợ cấp xã hội', 'hỗ trợ chi phí học tập'],
    },
    'Đề nghị giải quyết chế độ bảo hiểm thân thể': {
      description: 'Hỗ trợ sinh viên đề nghị giải quyết chế độ bảo hiểm thân thể và các chế độ liên quan theo quy định.',
      requiredDocs: ['Đơn đề nghị giải quyết chế độ bảo hiểm thân thể', 'CCCD/CMND', 'Giấy xác nhận bệnh/hoàn cảnh (nếu có)', 'Thẻ sinh viên'],
      steps: ['Sinh viên nộp đơn và hồ sơ liên quan.', 'Phòng CTSV kiểm tra điều kiện và hồ sơ.', 'Thẩm định theo quy định bảo hiểm và hỗ trợ.', 'Thông báo kết quả giải quyết.'],
      keywords: ['bảo hiểm thân thể', 'hỗ trợ bảo hiểm'],
    },
    'Đề nghị cấp lại thẻ sinh viên': {
      description: 'Thủ tục cấp lại thẻ sinh viên khi thẻ bị mất, hỏng hoặc hết thời hạn sử dụng.',
      requiredDocs: ['Đơn đề nghị cấp lại thẻ sinh viên', 'CCCD/CMND', 'Ảnh 3x4 mới', 'Biên lai hoặc giấy tờ chứng nhận mất/hỏng thẻ'],
      steps: ['Sinh viên nộp đơn và các giấy tờ liên quan.', 'Phòng CTSV kiểm tra hồ sơ và xác minh.', 'Xác nhận cấp lại thẻ.', 'Ban hành thẻ và giao cho sinh viên.'],
      keywords: ['cấp lại thẻ sinh viên', 'mất thẻ'],
    },
    'Xác nhận điểm rèn luyện': {
      description: 'Thủ tục xác nhận điểm rèn luyện cho sinh viên phục vụ học tập, xét học bổng và các chế độ hỗ trợ.',
      requiredDocs: ['Đơn đề nghị xác nhận điểm rèn luyện', 'CCCD/CMND', 'Thẻ sinh viên', 'Bảng điểm rèn luyện hoặc hồ sơ hoạt động sinh viên'],
      steps: ['Sinh viên gửi yêu cầu kiểm tra và xác nhận điểm rèn luyện.', 'Phòng CTSV đối chiếu hồ sơ hoạt động và rèn luyện.', 'Xem xét và đánh giá theo tiêu chí.', 'Cấp giấy xác nhận điểm rèn luyện.'],
      keywords: ['điểm rèn luyện', 'xác nhận rèn luyện'],
    },
    'Xin hoãn thi kết thúc học phần': {
      description: 'Thủ tục xin hoãn thi kết thúc học phần khi sinh viên có lý do chính đáng hoặc không thể dự thi đúng lịch.',
      requiredDocs: ['Đơn xin hoãn thi', 'CCCD/CMND', 'Giấy xác nhận lý do hoãn thi', 'Danh sách môn học và thời khóa biểu'],
      steps: ['Sinh viên nộp đơn xin hoãn thi trong thời hạn quy định.', 'Phòng Đào tạo kiểm tra lý do và hồ sơ.', 'Xét cho phép hoãn thi hoặc yêu cầu bổ sung hồ sơ.', 'Giao lịch thi bù mới và cập nhật hệ thống.'],
      keywords: ['hoãn thi', 'thi kết thúc học phần'],
    },
    'Xin thi bù do hoãn thi kết thúc học phần': {
      description: 'Thủ tục đăng ký thi bù cho sinh viên đã được phép hoãn thi kết thúc học phần.',
      requiredDocs: ['Đơn xin thi bù', 'Quyết định hoãn thi hoặc giấy xác nhận phê duyệt', 'CCCD/CMND', 'Danh sách môn học cần thi bù'],
      steps: ['Sinh viên nộp đơn xin thi bù sau khi được chấp thuận hoãn thi.', 'Phòng Đào tạo xác nhận lịch và điều kiện dự thi.', 'Lập lịch thi bù mới.', 'Thông báo và tổ chức thi bù.'],
      keywords: ['thi bù', 'hoãn thi'],
    },
    'Thanh toán tiền hỗ trợ thực tập tốt nghiệp': {
      description: 'Thủ tục đề nghị và thanh toán hỗ trợ thực tập tốt nghiệp cho sinh viên theo quy định của nhà trường.',
      requiredDocs: ['Giấy đề nghị thanh toán tiền hỗ trợ thực tập tốt nghiệp', 'Quyết định cho phép sinh viên đi thực tập tốt nghiệp', 'Công lệnh thực tập có xác nhận nơi thực tập', 'Thẻ sinh viên hoặc CCCD bản phô tô của lớp trưởng'],
      steps: ['Sinh viên hoặc lớp trưởng nộp hồ sơ tại bộ phận một cửa.', 'Bộ phận một cửa kiểm tra và chuyển hồ sơ cho Phòng Kế hoạch tài chính.', 'Phòng Kế hoạch tài chính kiểm tra chứng từ và chi tiền cho người học.', 'Người nhận tiền mang giấy hẹn và giấy tờ tùy thân để đối chiếu và nhận kết quả.'],
      keywords: ['hỗ trợ thực tập tốt nghiệp', 'thanh toán thực tập'],
    },
    'Thanh toán tiền Tết Nguyên đán cho sinh viên': {
      description: 'Thủ tục thanh toán tiền Tết Nguyên đán cho sinh viên theo chính sách hỗ trợ của trường.',
      requiredDocs: ['Giấy đề nghị thanh toán', 'Danh sách lớp có xác nhận của phòng CTSV', 'Thẻ sinh viên hoặc CCCD của lớp trưởng'],
      steps: ['Nộp hồ sơ tại bộ phận một cửa.', 'Bộ phận một cửa kiểm tra và chuyển lên Phòng Kế hoạch tài chính.', 'Phòng Kế hoạch tài chính rà soát danh sách và chi tiền cho người học.', 'Người học mang giấy hẹn và giấy tờ tùy thân để nhận tiền và xác nhận kết quả.'],
      keywords: ['tiền Tết', 'hỗ trợ Tết Nguyên đán'],
    },
    'Thanh toán tiền học phí (đóng dư) cho người học': {
      description: 'Thủ tục xin hoàn trả hoặc thanh toán phần học phí còn thiếu cho người học.',
      requiredDocs: ['Đơn xin hoàn học phí', 'Biên lai thu học phí bản gốc hoặc sao kê giao dịch', 'Thẻ sinh viên hoặc CCCD bản phô tô'],
      steps: ['Người học nộp hồ sơ tại bộ phận một cửa.', 'Bộ phận một cửa kiểm tra và chuyển cho Phòng Kế hoạch tài chính.', 'Phòng Kế hoạch tài chính đối chiếu chứng từ và xác định số tiền thanh toán hoặc hoàn trả.', 'Người học mang giấy hẹn và giấy tờ tùy thân để nhận tiền và xác nhận kết quả.'],
      keywords: ['thanh toán học phí', 'đóng dư', 'hoàn trả học phí'],
    },
  };

  servicesData.push(...officialProcedures.map(([name, departmentId, category, processingTime, itemId]) => {
    const meta = officialProcedureMeta[name] ?? {
      description: `Thủ tục một cửa HUMG. Hướng dẫn chi tiết: https://humg.edu.vn/mot-cua/Pages/home.aspx?ItemID=${itemId}`,
      requiredDocs: ['Theo hướng dẫn chi tiết của thủ tục'],
      steps: ['Nộp hồ sơ', 'Bộ phận tiếp nhận xử lý', 'Nhận kết quả'],
      keywords: [name, 'thủ tục một cửa', 'HUMG'],
    };

    return {
      name,
      slug: `thu-tuc-${itemId}`,
      category,
      departmentId,
      description: meta.description,
      requiredDocs: meta.requiredDocs,
      steps: meta.steps,
      processingTime,
      submissionType: 'Trực tiếp/Online',
      keywords: meta.keywords ?? [name, 'thủ tục một cửa', 'HUMG'],
    };
  }));

  const services = [];
  for (const s of servicesData) {
    services.push(await prisma.service.create({ data: s }));
  }

  const allStudents = [student, ...demoStudents];
  const demoStatuses = ['SUBMITTED', 'RECEIVED', 'PROCESSING', 'NEED_SUPPLEMENT', 'APPROVED', 'COMPLETED'];
  const demoPdfFiles = [
    '/uploads/don-xac-nhan-sinh-vien.pdf',
    '/uploads/don-xin-hoan-hoc.pdf',
    '/uploads/giay-xac-nhan-hoc-tap.pdf',
  ];

  for (let index = 0; index < 18; index += 1) {
    const owner = allStudents[index % allStudents.length];
    const assignedTo = index % 3 === 0 ? staffDaotao : staffCTSV;
    const status = demoStatuses[index % demoStatuses.length];
    const attachments = index % 3 === 0 ? [demoPdfFiles[index % demoPdfFiles.length]] : [];

    await prisma.application.create({
      data: {
        code: `HD2026${String(index + 2).padStart(5, '0')}`,
        studentId: owner.id,
        serviceId: services[(index + 1) % services.length].id,
        status,
        attachments,
        formData: { purpose: 'Hồ sơ dữ liệu mẫu', semester: 'HK2/2025-2026' },
        assignedToId: assignedTo.id,
        statusHistory: {
          create: [{
            status: 'SUBMITTED',
            note: 'Sinh viên gửi hồ sơ và đính kèm minh chứng.',
            changedById: owner.id,
          }],
        },
      },
    });
  }

  for (let index = 0; index < 10; index += 1) {
    await prisma.supportTicket.create({
      data: {
        code: `TK2026${String(index + 2).padStart(5, '0')}`,
        title: ['Cần hỗ trợ xác nhận hồ sơ', 'Không tra cứu được học phí', 'Xin cập nhật thông tin cá nhân'][index % 3],
        content: 'Nội dung yêu cầu hỗ trợ mẫu để kiểm thử quy trình tiếp nhận và phân công.',
        category: ['CONG_TAC_SINH_VIEN', 'TAI_CHINH', 'HOC_VU'][index % 3],
        status: ['OPEN', 'IN_PROGRESS', 'WAITING', 'RESOLVED'][index % 4],
        studentId: allStudents[index % allStudents.length].id,
        departmentId: [ctsv.id, taichinh.id, daotao.id][index % 3],
        assignedToId: index % 2 ? staffCTSV.id : staffDaotao.id,
      },
    });
  }

  await prisma.fAQ.createMany({
    data: [
      { question: 'Khi nào được xin hoãn học?', answer: 'Sinh viên có thể xin hoãn học khi có lý do chính đáng như ốm đau, hoàn cảnh gia đình khó khăn. Cần nộp đơn trước 2 tuần so với ngày bắt đầu học kỳ.', departmentId: ctsv.id, keywords: ['hoãn học'] },
      { question: 'Hồ sơ xin hoãn học cần những gì?', answer: 'Cần có: Đơn xin hoãn học, CCCD/CMND, giấy xác nhận lý do (nếu có).', departmentId: ctsv.id, keywords: ['hoãn học', 'hồ sơ'] },
      { question: 'Thời gian xử lý bao lâu?', answer: 'Thông thường 3-5 ngày làm việc kể từ khi hồ sơ được tiếp nhận đầy đủ.', departmentId: ctsv.id, keywords: ['thời gian'] },
      { question: 'Tôi có thể nộp online không?', answer: 'Có, hầu hết thủ tục đều hỗ trợ nộp online qua Cổng dịch vụ sinh viên HUMG.', departmentId: ctsv.id, keywords: ['online', 'nộp hồ sơ'] },
      { question: 'Làm sao tra cứu học phí?', answer: 'Đăng nhập cổng dịch vụ, chọn Dịch vụ Tài chính > Tra cứu học phí, hoặc liên hệ Phòng Tài chính.', departmentId: taichinh.id, keywords: ['học phí'] },
    ],
  });

  await prisma.announcement.createMany({
    data: [
      { title: 'Thông báo lịch nghỉ lễ 30/4 - 1/5', content: 'Trường nghỉ lễ từ ngày 30/4 đến 01/5. Các phòng ban trực online.', departmentId: ctsv.id, tags: ['nghỉ lễ'], isPinned: true },
      { title: 'Thông báo đóng học phí HK2', content: 'Sinh viên vui lòng đóng học phí trước ngày 15/3. Tra cứu tại Phòng Tài chính.', departmentId: taichinh.id, tags: ['học phí'], isPinned: true },
      { title: 'Mở đăng ký môn học HK2', content: 'Thời gian đăng ký: 01/02 - 10/02. Truy cập hệ thống đăng ký.', departmentId: daotao.id, tags: ['học vụ', 'đăng ký môn'] },
      { title: 'Hướng dẫn sử dụng Cổng dịch vụ sinh viên', content: 'Sinh viên có thể nộp hồ sơ, theo dõi tiến trình và nhận thông báo qua cổng mới.', departmentId: ctsv.id, tags: ['hướng dẫn'], isPinned: false },
    ],
  });

  const app = await prisma.application.create({
    data: {
      code: 'HD202600001',
      studentId: student.id,
      serviceId: services[0].id,
      status: 'PROCESSING',
      attachments: ['/uploads/don-xac-nhan-sinh-vien.pdf', '/uploads/giay-xac-nhan-hoc-tap.pdf'],
      formData: { purpose: 'Hoãn học do sức khỏe', semester: 'HK2/2025-2026' },
      assignedToId: staffCTSV.id,
      statusHistory: {
        create: [
          { status: 'SUBMITTED', note: 'Sinh viên gửi hồ sơ', changedById: student.id },
          { status: 'RECEIVED', note: 'Đã tiếp nhận', changedById: staffCTSV.id },
          { status: 'PROCESSING', note: 'Đang kiểm tra hồ sơ', changedById: staffCTSV.id },
        ],
      },
    },
  });

  await prisma.supportTicket.create({
    data: {
      code: 'TK202600001',
      title: 'Không nhận được thông báo học phí',
      content: 'Em đã đóng học phí nhưng hệ thống vẫn hiển thị chưa thanh toán.',
      category: 'TAI_CHINH',
      status: 'OPEN',
      studentId: student.id,
      departmentId: taichinh.id,
    },
  });

  await prisma.question.create({
    data: {
      title: 'Thủ tục xin bảo lưu cần giấy tờ gì?',
      content: 'Em muốn hỏi về thủ tục xin bảo lưu kết quả học tập. Em cần chuẩn bị những giấy tờ gì?',
      authorId: student.id,
    },
  });

  await prisma.post.create({
    data: {
      title: 'Wifi ký túc xá chậm',
      content: 'Wifi tại ký túc xá B gần đây rất chậm, mong phòng CNTT hỗ trợ.',
      category: 'CO_SO_VAT_CHAT',
      authorId: student.id,
      departmentId: cntt.id,
    },
  });

  await prisma.notification.create({
    data: {
      userId: student.id,
      title: 'Hồ sơ đã được tiếp nhận',
      message: 'Hồ sơ HD202600001 của bạn đã được tiếp nhận và đang xử lý.',
      type: 'APPLICATION',
      link: `/ho-so/${app.id}`,
    },
  });

  console.log('✅ Seed completed!');
  console.log('\n📋 Tài khoản demo:');
  console.log('  Admin:    admin@humg.edu.vn / 123456');
  console.log('  Nhân viên: nv.ctsv@humg.edu.vn / 123456');
  console.log('  Quản lý phòng: ql.ctsv@humg.edu.vn / 123456');
  console.log('  Sinh viên: sv001@humg.edu.vn / 123456');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

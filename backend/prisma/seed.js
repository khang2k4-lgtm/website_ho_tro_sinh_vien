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
      role: 'STAFF_CARE',
      departmentId: ctsv.id,
      phone: '0907654321',
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
    ['Xin hoãn thi kết thúc học phần', daotao.id, 'HOC_VU', '2 ngày', 36],
    ['Xin thi bù do hoãn thi kết thúc học phần', daotao.id, 'HOC_VU', '2 ngày', 37],
    ['Thanh toán tiền hỗ trợ thực tập tốt nghiệp', kehoachtaichinh.id, 'TAI_CHINH', '3 ngày', 38],
    ['Mẫu Giấy thanh toán ra trường', kehoachtaichinh.id, 'TAI_CHINH', 'Chưa xác định', 39],
    ['Thanh toán tiền Tết Nguyên đán cho sinh viên', kehoachtaichinh.id, 'TAI_CHINH', '02 ngày', 40],
    ['Thanh toán tiền học phí (đóng dư) cho người học', kehoachtaichinh.id, 'TAI_CHINH', '2 ngày', 41],
  ];

  servicesData.push(...officialProcedures.map(([name, departmentId, category, processingTime, itemId]) => ({
    name,
    slug: `thu-tuc-${itemId}`,
    category,
    departmentId,
    description: `Thủ tục một cửa HUMG. Hướng dẫn chi tiết: https://humg.edu.vn/mot-cua/Pages/home.aspx?ItemID=${itemId}`,
    requiredDocs: ['Theo hướng dẫn chi tiết của thủ tục'],
    steps: ['Nộp hồ sơ', 'Bộ phận tiếp nhận xử lý', 'Nhận kết quả'],
    processingTime,
    submissionType: 'Trực tiếp/Online',
    keywords: [name, 'thủ tục một cửa', 'HUMG'],
  })));

  const services = [];
  for (const s of servicesData) {
    services.push(await prisma.service.create({ data: s }));
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
  console.log('  Chăm sóc: chamsoc@humg.edu.vn / 123456');
  console.log('  Sinh viên: sv001@humg.edu.vn / 123456');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

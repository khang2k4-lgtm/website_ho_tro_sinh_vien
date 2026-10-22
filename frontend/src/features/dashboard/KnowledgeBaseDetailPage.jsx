import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Building2,
  Check,
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  FileArchive,
  FileText,
  GraduationCap,
  Landmark,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './KnowledgeBaseDetailPage.css';

const INITIAL_PROCESSES = [
  {
    code: 'QT-01',
    title: 'Quy trình tiếp nhận & thẩm định hồ sơ cấp lại thẻ sinh viên',
    department: 'Phòng Công tác Chính trị - Sinh viên',
    group: 'student',
    type: 'iso',
    iso: 'ISO-2026 · v2.1',
    sla: '02 giờ',
    updated: '14/10/2026',
    status: 'Hoạt động',
    owner: 'Phòng CTSV',
    standard: 'ISO 9001:2015',
    steps: [
      'Sinh viên nộp đơn online trên Cổng HUMG Portal kèm file scan CCCD.',
      'Cán bộ Quầy 1 kiểm tra tính hợp lệ trong 02 giờ làm việc.',
      'Chuyển dữ liệu sang Bộ phận In phôi thẻ (thời gian xử lý: 12 giờ).',
      'Trưởng phòng ký duyệt và bàn giao bản cứng về Quầy Một cửa trả cho sinh viên.',
    ],
    forms: [
      { name: 'BM-01_Don_xin_cap_lai_the_SV.docx', content: 'MẪU BM-01 - ĐƠN XIN CẤP LẠI THẺ SINH VIÊN\n\nHọ và tên: ____________________\nMã số sinh viên: _______________\nLớp: __________________________\nLý do cấp lại: _________________\nNgày ...... tháng ...... năm ......\nSinh viên ký tên: ______________' },
      { name: 'BM-02_Phieu_xac_nhan_dieu_kien.pdf', content: 'MẪU BM-02 - PHIẾU XÁC NHẬN ĐIỀU KIỆN CẤP LẠI THẺ\n\nMã hồ sơ: _____________________\nSinh viên: _____________________\nĐã đối chiếu thông tin: _________\nKết quả thẩm định: _____________\nCán bộ xác nhận: _______________' },
    ],
  },
  {
    code: 'QT-02',
    title: 'Hướng dẫn ký số CA & phê duyệt văn bản hành chính tập trung',
    department: 'Ban Giám hiệu',
    group: 'digital',
    type: 'guide',
    iso: 'ISO-2026 · v1.0',
    sla: '04 giờ',
    updated: '12/10/2026',
    status: 'Cần xem xét',
    owner: 'Trưởng phòng KHTC',
    standard: 'ISO 9001:2015',
    steps: [
      'Kiểm tra thể thức, tệp đính kèm và danh sách người nhận văn bản.',
      'Chọn chứng thư số được phân quyền, xác nhận thời hạn hiệu lực của chứng thư.',
      'Thực hiện ký số trên hệ thống văn bản tập trung và kiểm tra chữ ký sau khi ký.',
      'Chuyển văn bản đã ký đến đơn vị nhận, lưu bản điện tử vào kho hồ sơ.',
    ],
    forms: [
      { name: 'BM-03_Phieu_trinh_ky_so.docx', content: 'MẪU BM-03 - PHIẾU TRÌNH KÝ SỐ\n\nTên văn bản: ___________________\nĐơn vị trình: __________________\nNgười ký: ______________________\nThời hạn xử lý: ________________' },
    ],
  },
  {
    code: 'QT-05',
    title: 'Quy trình xử lý hồ sơ xin hoãn học tập vì lý do sức khỏe',
    department: 'Phòng Đào tạo Đại học',
    group: 'academic',
    type: 'iso',
    iso: 'ISO-2025 · v3.0',
    sla: '24 giờ',
    updated: '01/10/2026',
    status: 'Hoạt động',
    owner: 'Phòng Đào tạo ĐH',
    standard: 'ISO 9001:2015',
    steps: [
      'Sinh viên kê khai đơn xin hoãn học tập và đính kèm giấy tờ y tế liên quan.',
      'Cán bộ tiếp nhận kiểm tra điều kiện, đối chiếu thời gian học tập và công nợ.',
      'Chuyển hồ sơ đến đơn vị chuyên môn thẩm định trong 01 ngày làm việc.',
      'Thông báo kết quả phê duyệt và hướng dẫn sinh viên hoàn thành thủ tục tiếp theo.',
    ],
    forms: [
      { name: 'BM-05_Don_xin_hoan_hoc_tap.docx', content: 'MẪU BM-05 - ĐƠN XIN HOÃN HỌC TẬP\n\nHọ và tên: ____________________\nMã số sinh viên: _______________\nLớp: __________________________\nLý do: _________________________\nThời gian xin hoãn: ____________' },
      { name: 'BM-06_Phieu_tham_dinh_ho_so.pdf', content: 'MẪU BM-06 - PHIẾU THẨM ĐỊNH HỒ SƠ\n\nMã hồ sơ: _____________________\nGiấy tờ kèm theo: ______________\nKết quả thẩm định: _____________' },
    ],
  },
  {
    code: 'QT-08',
    title: 'Quy trình cấp giấy xác nhận sinh viên và xác nhận vay vốn',
    department: 'Bộ phận Một cửa',
    group: 'student',
    type: 'iso',
    iso: 'ISO-2026 · v1.4',
    sla: '08 giờ',
    updated: '28/09/2026',
    status: 'Hoạt động',
    owner: 'Bộ phận Một cửa',
    standard: 'ISO 9001:2015',
    steps: [
      'Sinh viên chọn loại giấy xác nhận và điền thông tin người nhận.',
      'Hệ thống kiểm tra tình trạng học tập và các điều kiện liên quan.',
      'Cán bộ đối chiếu hồ sơ, trình lãnh đạo đơn vị ký xác nhận.',
      'Thông báo kết quả và hướng dẫn nhận giấy trực tiếp hoặc bản điện tử.',
    ],
    forms: [
      { name: 'BM-08_Phieu_de_nghi_xac_nhan.docx', content: 'MẪU BM-08 - PHIẾU ĐỀ NGHỊ XÁC NHẬN SINH VIÊN\n\nHọ và tên: ____________________\nMã số sinh viên: _______________\nNội dung xác nhận: _____________' },
    ],
  },
  {
    code: 'HD-12',
    title: 'Hướng dẫn hoàn trả học phí và đối soát giao dịch',
    department: 'Phòng Kế hoạch - Tài chính',
    group: 'finance',
    type: 'guide',
    iso: 'ISO-2026 · v1.2',
    sla: '03 ngày',
    updated: '22/09/2026',
    status: 'Hoạt động',
    owner: 'Phòng KHTC',
    standard: 'Quy định tài chính',
    steps: [
      'Tiếp nhận yêu cầu hoàn trả và minh chứng giao dịch của sinh viên.',
      'Đối soát khoản thu với dữ liệu ngân hàng và hệ thống kế toán.',
      'Xác nhận điều kiện hoàn trả theo quy định học phí hiện hành.',
      'Thực hiện hoàn trả và cập nhật biên nhận, trạng thái hồ sơ.',
    ],
    forms: [
      { name: 'BM-12_De_nghi_hoan_tra_hoc_phi.docx', content: 'MẪU BM-12 - ĐỀ NGHỊ HOÀN TRẢ HỌC PHÍ\n\nHọ và tên: ____________________\nMSSV: _________________________\nSố tiền đề nghị: _______________\nLý do: _________________________' },
    ],
  },
  {
    code: 'QT-14',
    title: 'Quy trình xét học bổng khuyến khích học tập',
    department: 'Phòng Công tác Chính trị - Sinh viên',
    group: 'student',
    type: 'iso',
    iso: 'ISO-2026 · v2.0',
    sla: '05 ngày',
    updated: '18/09/2026',
    status: 'Hoạt động',
    owner: 'Phòng CTSV',
    standard: 'ISO 9001:2015',
    steps: [
      'Phòng CTSV công bố đợt xét học bổng và tiêu chí áp dụng.',
      'Phòng Đào tạo cung cấp dữ liệu kết quả học tập theo học kỳ.',
      'Hội đồng xét duyệt kiểm tra điều kiện và lập danh sách đề nghị.',
      'Công bố kết quả, tiếp nhận phản hồi và chuyển danh sách chi trả.',
    ],
    forms: [
      { name: 'BM-14_Phieu_ra_soat_hoc_bong.xlsx', content: 'MẪU BM-14 - PHIẾU RÀ SOÁT HỌC BỔNG\n\nMSSV | Họ tên | Điểm trung bình | Điểm rèn luyện | Kết quả' },
    ],
  },
  {
    code: 'HD-17',
    title: 'Hướng dẫn tiếp nhận và phân loại hồ sơ trực tuyến',
    department: 'Bộ phận Một cửa',
    group: 'operations',
    type: 'guide',
    iso: 'ISO-2026 · v1.0',
    sla: '02 giờ',
    updated: '15/09/2026',
    status: 'Hoạt động',
    owner: 'Bộ phận Một cửa',
    standard: 'Quy trình nội bộ',
    steps: [
      'Mở danh sách hồ sơ mới và kiểm tra thông tin người nộp.',
      'Đối chiếu thành phần hồ sơ với hướng dẫn dịch vụ tương ứng.',
      'Phân loại hồ sơ đủ điều kiện xử lý hoặc yêu cầu bổ sung giấy tờ.',
      'Chuyển hồ sơ tới phòng ban phụ trách và ghi nhận thời điểm tiếp nhận.',
    ],
    forms: [
      { name: 'BM-17_Checklist_tiep_nhan.docx', content: 'MẪU BM-17 - CHECKLIST TIẾP NHẬN HỒ SƠ\n\nMã hồ sơ: _____________________\nĐủ thông tin: _________________\nĐủ giấy tờ: ___________________\nPhòng ban tiếp nhận: ___________' },
    ],
  },
];

const CATEGORIES = [
  { id: 'academic', title: 'Khối Đào tạo & Học vụ', icon: GraduationCap, color: 'blue', items: ['Quy trình hoãn thi, hoãn học', 'Hướng dẫn cấp bảng điểm'], count: 18 },
  { id: 'student', title: 'Khối Công tác sinh viên', icon: Building2, color: 'purple', items: ['Quy trình cấp giấy xác nhận', 'Quy trình xét học bổng KKHT'], count: 24 },
  { id: 'finance', title: 'Khối Tài chính & Học phí', icon: Landmark, color: 'green', items: ['Quy trình hoàn trả học phí', 'Hướng dẫn xác nhận nợ phí'], count: 12 },
  { id: 'digital', title: 'Khối Văn bản & Ký số', icon: ShieldCheck, color: 'cyan', items: ['Hướng dẫn ký số CA', 'Quy trình phê duyệt văn bản'], count: 9 },
  { id: 'operations', title: 'Tiếp nhận & Một cửa', icon: FileArchive, color: 'orange', items: ['Checklist tiếp nhận hồ sơ', 'Quy trình phân luồng'], count: 9 },
];

const FILTER_GROUPS = [
  ['ALL', 'Tất cả nhóm'],
  ['academic', 'Đào tạo & Học vụ'],
  ['student', 'Công tác sinh viên'],
  ['finance', 'Tài chính & Học phí'],
  ['digital', 'Văn bản & Ký số'],
  ['operations', 'Tiếp nhận & Một cửa'],
];

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createZip(files) {
  const encoder = new TextEncoder();
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  const u16 = (value) => [value & 0xff, (value >>> 8) & 0xff];
  const u32 = (value) => [value & 0xff, (value >>> 8) & 0xff, (value >>> 16) & 0xff, (value >>> 24) & 0xff];
  const bytes = (...parts) => new Uint8Array(parts.flat());

  for (const file of files) {
    const name = encoder.encode(file.name);
    const content = encoder.encode(file.content);
    const checksum = crc32(content);
    const localHeader = bytes(
      u32(0x04034b50), u16(20), u16(0x0800), u16(0), u16(0), u16(0),
      u32(checksum), u32(content.length), u32(content.length), u16(name.length), u16(0),
      [...name],
    );
    localParts.push(localHeader, content);
    centralParts.push(bytes(
      u32(0x02014b50), u16(20), u16(20), u16(0x0800), u16(0), u16(0), u16(0),
      u32(checksum), u32(content.length), u32(content.length), u16(name.length), u16(0),
      u16(0), u16(0), u16(0), u32(0), u32(offset), [...name],
    ));
    offset += localHeader.length + content.length;
  }

  const centralDirectory = bytes(...centralParts.map((part) => Array.from(part)));
  const end = bytes(
    u32(0x06054b50), u16(0), u16(0), u16(files.length), u16(files.length),
    u32(centralDirectory.length), u32(offset), u16(0),
  );
  return new Blob([...localParts, centralDirectory, end], { type: 'application/zip' });
}

export default function KnowledgeBaseDetailPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const [processes, setProcesses] = useState(INITIAL_PROCESSES);
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [groupFilter, setGroupFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [toast, setToast] = useState('');
  const [newProcess, setNewProcess] = useState({ title: '', department: '', group: 'student', sla: '' });

  const filteredProcesses = useMemo(() => {
    const normalizedQuery = submittedQuery.trim().toLocaleLowerCase('vi');
    return processes.filter((process) => {
      const matchesQuery = !normalizedQuery
        || `${process.code} ${process.title} ${process.department} ${process.owner} ${process.steps.join(' ')}`
          .toLocaleLowerCase('vi')
          .includes(normalizedQuery);
      return matchesQuery
        && (departmentFilter === 'ALL' || process.department === departmentFilter)
        && (groupFilter === 'ALL' || process.group === groupFilter)
        && (typeFilter === 'ALL' || process.type === typeFilter);
    });
  }, [departmentFilter, groupFilter, processes, submittedQuery, typeFilter]);

  const showToast = (text) => {
    setToast(text);
    window.setTimeout(() => setToast(''), 3500);
  };

  const downloadTemplates = () => {
    const files = processes.flatMap((process) => process.forms);
    const uniqueFiles = [...new Map(files.map((file) => [file.name, file])).values()];
    const blob = createZip([
      { name: 'README.txt', content: 'BỘ BIỂU MẪU CẨM NANG HUMG\n\nCác tệp trong gói là biểu mẫu mẫu dùng cho mục đích trình diễn. Định dạng DOCX/PDF/XLSX trong tên tệp không đại diện cho tài liệu Office/PDF chính thức.\n' },
      ...uniqueFiles,
    ]);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bo-bieu-mau-cam-nang-humg.zip';
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadForm = (form) => {
    const blob = new Blob([form.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${form.name}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const openProcess = (process) => setSelectedProcess(process);

  const createProcess = (event) => {
    event.preventDefault();
    const title = newProcess.title.trim();
    if (!title || !newProcess.department.trim()) return;
    const process = {
      code: `QT-${String(processes.length + 1).padStart(2, '0')}`,
      title,
      department: newProcess.department.trim(),
      group: newProcess.group,
      type: 'guide',
      iso: 'Bản nháp',
      sla: newProcess.sla.trim() || 'Chưa thiết lập',
      updated: new Date().toLocaleDateString('vi-VN'),
      status: 'Bản nháp',
      owner: newProcess.department.trim(),
      standard: 'Chưa thiết lập',
      steps: ['Bản nháp quy trình mới. Bổ sung các bước nghiệp vụ trước khi ban hành.'],
      forms: [],
    };
    setProcesses((current) => [process, ...current]);
    setSubmittedQuery('');
    setQuery('');
    setDepartmentFilter('ALL');
    setGroupFilter('ALL');
    setTypeFilter('ALL');
    setShowCreate(false);
    setNewProcess({ title: '', department: '', group: 'student', sla: '' });
    showToast(`Đã tạo bản nháp ${process.code}; tài liệu chưa được ban hành.`);
  };

  const updateCategoryFilter = (categoryId) => {
    setGroupFilter((current) => current === categoryId ? 'ALL' : categoryId);
    setSubmittedQuery('');
    setQuery('');
  };

  const departmentOptions = [...new Set(processes.map((process) => process.department))];

  return (
    <main className="dashboard-page knowledge-detail-page">
      <header className="knowledge-detail-header">
        <div>
          <Link className="knowledge-back-link" to="/dashboard"><ArrowLeft size={16} /> Quay lại Dashboard</Link>
          <span className="dashboard-kicker">QUẢN LÝ PHÒNG BAN / CƠ SỞ DỮ LIỆU &amp; TRA CỨU</span>
          <h1 className="page-title">Cẩm nang &amp; Quy trình nghiệp vụ nội bộ</h1>
          <p className="page-subtitle">Tra cứu chuẩn quy trình ISO, hướng dẫn thao tác phần mềm, biểu mẫu và quy định xử lý hồ sơ.</p>
        </div>
      </header>

      <div className="knowledge-demo-banner"><BookOpen size={16} /> Kho tài liệu và quy trình hiện là dữ liệu mẫu phục vụ trình diễn; chưa kết nối kho văn bản chính thức.</div>

      <form className="knowledge-search-panel" onSubmit={(event) => { event.preventDefault(); setSubmittedQuery(query); }}>
        <label className="knowledge-main-search">
          <Search size={20} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Nhập tên quy trình, mã tài liệu (VD: QT-CTSV-01), từ khóa nghiệp vụ..."
            aria-label="Tìm kiếm quy trình và tài liệu"
          />
        </label>
        <div className="knowledge-filters">
          <label><span>Phòng ban</span><select value={departmentFilter} onChange={(event) => setDepartmentFilter(event.target.value)}><option value="ALL">Tất cả phòng ban</option>{departmentOptions.map((department) => <option key={department}>{department}</option>)}</select></label>
          <label><span>Nhóm nghiệp vụ</span><select value={groupFilter} onChange={(event) => setGroupFilter(event.target.value)}>{FILTER_GROUPS.map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label>
          <label><span>Loại tài liệu</span><select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}><option value="ALL">Tất cả loại</option><option value="iso">Quy trình ISO</option><option value="guide">Hướng dẫn nghiệp vụ</option></select></label>
        </div>
        <div className="knowledge-search-actions">
          <button className="btn btn-primary" type="submit"><Search size={16} /> Tìm kiếm</button>
          {isAdmin && <button className="btn btn-outline" type="button" onClick={() => setShowCreate(true)}><Plus size={16} /> Thêm quy trình mới</button>}
          <button className="btn btn-outline" type="button" onClick={downloadTemplates}><Download size={16} /> Tải bộ biểu mẫu (ZIP)</button>
        </div>
      </form>

      <section className="knowledge-stats" aria-label="Thống kê kho tài liệu">
        <article><span className="knowledge-stat-icon blue"><BookOpen size={19} /></span><div><span>Tổng tài liệu</span><strong>72 <small>tài liệu</small></strong></div></article>
        <article><span className="knowledge-stat-icon purple"><Sparkles size={19} /></span><div><span>Quy trình mới</span><strong>6 <small>quy trình</small></strong></div></article>
        <article><span className="knowledge-stat-icon amber"><Clock3 size={19} /></span><div><span>Yêu cầu cập nhật</span><strong>4 <small>cần kiểm tra</small></strong></div></article>
        <article><span className="knowledge-stat-icon green"><Eye size={19} /></span><div><span>Truy cập hôm nay</span><strong>146 <small>lượt xem</small></strong></div></article>
      </section>

      <section className="knowledge-categories-section">
        <div className="knowledge-section-heading"><div><h2>Phân loại theo nhóm nghiệp vụ</h2><p>Chọn nhóm để lọc các quy trình và biểu mẫu.</p></div></div>
        <div className="knowledge-category-grid">
          {CATEGORIES.map(({ id, title, icon: Icon, color, items, count }) => (
            <button type="button" key={id} className={`knowledge-category-card ${groupFilter === id ? 'selected' : ''}`} onClick={() => updateCategoryFilter(id)}>
              <span className={`knowledge-category-icon ${color}`}><Icon size={20} /></span>
              <strong>{title}</strong>
              <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
              <span className="knowledge-category-count">{count} tài liệu <span aria-hidden="true">→</span></span>
            </button>
          ))}
        </div>
      </section>

      <section className="knowledge-process-panel">
        <div className="knowledge-section-heading">
          <div><h2>Danh mục quy trình &amp; tiêu chuẩn xử lý</h2><p>{filteredProcesses.length} quy trình phù hợp với điều kiện tra cứu.</p></div>
        </div>
        <div className="knowledge-process-table-wrap">
          <table className="knowledge-process-table">
            <thead><tr><th>Mã QT</th><th>Tên quy trình / tài liệu hướng dẫn</th><th>Phòng ban áp dụng</th><th>Mẫu ISO</th><th>Chuẩn SLA</th><th>Cập nhật</th><th>Thao tác</th></tr></thead>
            <tbody>
              {filteredProcesses.map((process) => (
                <tr key={process.code}>
                  <td><strong className="knowledge-process-code">{process.code}</strong></td>
                  <td><strong>{process.title}</strong><small>{process.owner}</small></td>
                  <td>{process.department}</td>
                  <td><span className="knowledge-iso-tag">{process.iso}</span></td>
                  <td><span className="knowledge-sla"><Clock3 size={14} />{process.sla}</span></td>
                  <td><strong>{process.updated}</strong><span className={`knowledge-doc-status ${process.status === 'Hoạt động' ? 'active' : process.status === 'Bản nháp' ? 'draft' : 'review'}`}><i />{process.status}</span></td>
                  <td>
                    <div className="knowledge-row-actions">
                      <button type="button" className="btn btn-primary btn-sm" onClick={() => openProcess(process)}><BookOpen size={14} /> Xem quy trình</button>
                      {process.forms.length > 0
                        ? <button type="button" className="btn btn-outline btn-sm" onClick={() => downloadForm(process.forms[0])}><Download size={14} /> Tải biểu mẫu</button>
                        : <button type="button" className="btn btn-outline btn-sm" onClick={() => showToast('Tài liệu mẫu này chưa có biểu mẫu đính kèm.')}><FileText size={14} /> Biểu mẫu</button>}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProcesses.length === 0 && <tr><td colSpan="7" className="knowledge-empty">Không tìm thấy tài liệu phù hợp. Thử thay đổi từ khóa hoặc bộ lọc.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      {toast && <div className="knowledge-toast" role="status"><Check size={17} />{toast}</div>}

      {selectedProcess && (
        <div className="knowledge-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedProcess(null); }}>
          <section className="knowledge-modal" role="dialog" aria-modal="true" aria-labelledby="knowledge-modal-title">
            <header>
              <div><span className="dashboard-kicker">CHI TIẾT QUY TRÌNH · {selectedProcess.code}</span><h2 id="knowledge-modal-title">{selectedProcess.title}</h2></div>
              <button type="button" aria-label="Đóng" onClick={() => setSelectedProcess(null)}><X size={19} /></button>
            </header>
            <div className="knowledge-modal-content">
              <section className="knowledge-modal-overview">
                <h3><FileText size={17} /> Thông tin chung</h3>
                <div><span>Chuẩn áp dụng</span><strong>{selectedProcess.standard}</strong></div>
                <div><span>SLA hoàn thành</span><strong>{selectedProcess.sla}</strong></div>
                <div><span>Đơn vị chủ trì</span><strong>{selectedProcess.owner}</strong></div>
                <div><span>Cập nhật</span><strong>{selectedProcess.updated} · {selectedProcess.iso}</strong></div>
              </section>
              <section className="knowledge-flow-section">
                <h3><BookOpen size={17} /> Các bước thực hiện</h3>
                <ol className="knowledge-flow-steps">
                  {selectedProcess.steps.map((step, index) => <li key={`${selectedProcess.code}-${index}`}><span>{index + 1}</span><p>{step}</p></li>)}
                </ol>
              </section>
              <section className="knowledge-forms-section">
                <h3><FileArchive size={17} /> Biểu mẫu đính kèm</h3>
                {selectedProcess.forms.length
                  ? <div className="knowledge-form-list">{selectedProcess.forms.map((form) => <button type="button" key={form.name} onClick={() => downloadForm(form)}><FileText size={17} /><span>{form.name}</span><Download size={15} /></button>)}</div>
                  : <p className="knowledge-no-forms">Chưa có biểu mẫu đính kèm.</p>}
              </section>
            </div>
            <footer><button type="button" className="btn btn-outline" onClick={() => setSelectedProcess(null)}>Đóng</button>{selectedProcess.forms.length > 0 && <button type="button" className="btn btn-primary" onClick={() => downloadTemplates()}><Download size={16} /> Tải bộ biểu mẫu</button>}</footer>
          </section>
        </div>
      )}

      {showCreate && (
        <div className="knowledge-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowCreate(false); }}>
          <form className="knowledge-create-modal" onSubmit={createProcess}>
            <header><div><span className="dashboard-kicker">QUẢN TRỊ CẨM NANG</span><h2>Thêm quy trình mới</h2></div><button type="button" aria-label="Đóng" onClick={() => setShowCreate(false)}><X size={19} /></button></header>
            <div className="knowledge-create-fields">
              <label><span>Tên quy trình *</span><input className="input" required value={newProcess.title} onChange={(event) => setNewProcess((current) => ({ ...current, title: event.target.value }))} /></label>
              <label><span>Phòng ban áp dụng *</span><input className="input" required value={newProcess.department} onChange={(event) => setNewProcess((current) => ({ ...current, department: event.target.value }))} /></label>
              <label><span>Nhóm nghiệp vụ</span><select className="select" value={newProcess.group} onChange={(event) => setNewProcess((current) => ({ ...current, group: event.target.value }))}>{FILTER_GROUPS.filter(([id]) => id !== 'ALL').map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label>
              <label><span>Chuẩn SLA</span><input className="input" placeholder="Ví dụ: 24 giờ" value={newProcess.sla} onChange={(event) => setNewProcess((current) => ({ ...current, sla: event.target.value }))} /></label>
              <p className="knowledge-create-note"><CheckCircle2 size={16} /> Quy trình mới được tạo dưới dạng bản nháp cục bộ để minh họa, chưa phát hành hoặc lưu vào máy chủ.</p>
            </div>
            <footer><button type="button" className="btn btn-outline" onClick={() => setShowCreate(false)}>Hủy</button><button type="submit" className="btn btn-primary"><Plus size={16} /> Tạo bản nháp</button></footer>
          </form>
        </div>
      )}
    </main>
  );
}

import { useMemo, useState } from 'react';
import {
  Archive,
  ArrowDownToLine,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Database,
  Download,
  Eye,
  FileArchive,
  FileCheck2,
  FileText,
  Folder,
  HardDrive,
  History,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import './ArchiveSearchPage.css';

const ARCHIVED_RECORDS = [
  {
    code: 'HS-1892',
    student: 'Nguyễn Văn Tâm',
    studentId: '21190012',
    service: 'Chuyển đổi hình thức học',
    cabinet: 'Kho Đào tạo ĐH',
    department: 'Đào tạo & Học vụ',
    archiveCategory: 'Đào tạo & Học vụ',
    approvedAt: '12/10/2026',
    year: '2026',
    approver: 'ThS. Nguyễn Văn B',
    approverRole: 'Trưởng phòng',
    archiveCode: 'ARC-2026-OCT-0821',
    size: '2.4 MB',
    fileType: 'PDF / CA',
    filename: 'Don_xin_chuyen_hinh_thuc_hoc_Signed_CA.pdf',
    timeline: [
      '10/10/2026 08:30: Sinh viên nộp đơn trực tuyến qua Cổng HUMG Portal.',
      '10/10/2026 10:15: Cán bộ Nguyễn Văn A (Quầy 1) tiếp nhận và đối chiếu hồ sơ.',
      '11/10/2026 14:20: Phòng Đào tạo ĐH thẩm định chuyên môn đạt yêu cầu.',
      '12/10/2026 09:00: Trưởng phòng Nguyễn Văn B ký số CA và hoàn tất thủ tục.',
      '12/10/2026 09:05: Hệ thống đóng gói hồ sơ vào kho lưu trữ số (mô phỏng).',
    ],
  },
  {
    code: 'HS-1850',
    student: 'Trần Thị Mai',
    studentId: '20190045',
    service: 'Cấp lại bảng điểm',
    cabinet: 'Kho Học vụ',
    department: 'Đào tạo & Học vụ',
    archiveCategory: 'Đào tạo & Học vụ',
    approvedAt: '08/10/2026',
    year: '2026',
    approver: 'Phạm Thu Hà',
    approverRole: 'Chuyên viên CTSV',
    archiveCode: 'ARC-2026-OCT-0744',
    size: '1.8 MB',
    fileType: 'PDF / CA',
    filename: 'Bang_diem_hoc_tap_Signed_CA.pdf',
    timeline: [
      '06/10/2026 09:10: Sinh viên nộp yêu cầu cấp lại bảng điểm.',
      '06/10/2026 13:45: Cán bộ Phạm Thu Hà kiểm tra thông tin sinh viên.',
      '07/10/2026 15:20: Phòng Đào tạo xác nhận dữ liệu kết quả học tập.',
      '08/10/2026 10:05: Hồ sơ được phê duyệt và đưa vào danh sách lưu trữ.',
    ],
  },
  {
    code: 'HS-1720',
    student: 'Lê Hoàng Nam',
    studentId: '22190102',
    service: 'Giấy xác nhận SV (NVQS)',
    cabinet: 'Kho CTSV',
    department: 'Công tác sinh viên',
    archiveCategory: 'Công tác sinh viên',
    approvedAt: '28/09/2026',
    year: '2026',
    approver: 'Đỗ Mai Linh',
    approverRole: 'Cán bộ Một cửa',
    archiveCode: 'ARC-2026-SEP-0310',
    size: '1.2 MB',
    fileType: 'PDF / CA',
    filename: 'Giay_xac_nhan_sinh_vien_Signed_CA.pdf',
    timeline: [
      '26/09/2026 08:15: Sinh viên gửi đề nghị cấp giấy xác nhận.',
      '26/09/2026 11:00: Cán bộ Một cửa kiểm tra trạng thái học tập.',
      '28/09/2026 09:30: Phòng CTSV phê duyệt và phát hành văn bản.',
      '28/09/2026 09:40: Hồ sơ được ghi nhận trong kho lưu trữ số (mô phỏng).',
    ],
  },
  {
    code: 'HS-1658',
    student: 'Phạm Đức Long',
    studentId: '21190087',
    service: 'Xét học bổng khuyến khích học tập',
    cabinet: 'Kho CTSV',
    department: 'Công tác sinh viên',
    archiveCategory: 'Công tác sinh viên',
    approvedAt: '18/12/2025',
    year: '2025',
    approver: 'Nguyễn Thị Hạnh',
    approverRole: 'Chuyên viên CTSV',
    archiveCode: 'ARC-2025-DEC-1920',
    size: '3.1 MB',
    fileType: 'PDF / CA',
    filename: 'Quyet_dinh_hoc_bong_Signed_CA.pdf',
    timeline: [
      '12/12/2025 08:00: Hồ sơ xét học bổng được tiếp nhận.',
      '15/12/2025 14:10: Hội đồng xét duyệt thông qua danh sách.',
      '18/12/2025 10:30: Quyết định được ký số và phát hành.',
      '18/12/2025 10:45: Hồ sơ được đưa vào kho lưu trữ (mô phỏng).',
    ],
  },
  {
    code: 'HS-1602',
    student: 'Vũ Ngọc Hà',
    studentId: '20190061',
    service: 'Xác nhận hoàn thành học phí',
    cabinet: 'Kho Tài chính',
    department: 'Tài chính & Học phí',
    archiveCategory: 'Văn bản ký số',
    approvedAt: '04/11/2024',
    year: '2024',
    approver: 'Trần Minh Đức',
    approverRole: 'Cán bộ tài chính',
    archiveCode: 'ARC-2024-NOV-0412',
    size: '980 KB',
    fileType: 'PDF / CA',
    filename: 'Xac_nhan_hoc_phi_Signed_CA.pdf',
    timeline: [
      '01/11/2024 09:00: Sinh viên gửi yêu cầu xác nhận học phí.',
      '01/11/2024 11:25: Bộ phận Tài chính đối soát công nợ.',
      '04/11/2024 08:40: Văn bản được phê duyệt và ký số.',
      '04/11/2024 08:55: Hệ thống cập nhật mã lưu trữ (mô phỏng).',
    ],
  },
];

const CATEGORY_CARDS = [
  { name: 'Công tác sinh viên', title: 'Kho hồ sơ Công tác Sinh viên', description: 'Giấy xác nhận, học bổng, vay vốn', count: '210 hồ sơ', size: '42 GB', icon: Folder },
  { name: 'Đào tạo & Học vụ', title: 'Kho hồ sơ Đào tạo & Học vụ', description: 'Bảng điểm, hoãn thi, chuyển lớp', count: '182 hồ sơ', size: '35 GB', icon: Folder },
  { name: 'Văn bản ký số', title: 'Kho văn bản ký số tập trung', description: 'Quyết định, báo cáo, biên bản', count: '70 hồ sơ', size: '14 GB', icon: FileCheck2 },
];

function downloadFile(name, contents, mimeType = 'text/plain;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([contents], { type: mimeType }));
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
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
      u32(checksum), u32(content.length), u32(content.length), u16(name.length), u16(0), [...name],
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

export default function ArchiveSearchPage() {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [yearFilter, setYearFilter] = useState('ALL');
  const [serviceFilter, setServiceFilter] = useState('ALL');
  const [approverFilter, setApproverFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [modalTab, setModalTab] = useState('history');
  const [toast, setToast] = useState('');

  const filteredRecords = useMemo(() => {
    const needle = submittedQuery.trim().toLocaleLowerCase('vi');
    return ARCHIVED_RECORDS.filter((record) => {
      const matchesQuery = !needle
        || `${record.code} ${record.student} ${record.studentId} ${record.archiveCode} ${record.service}`
          .toLocaleLowerCase('vi')
          .includes(needle);
      return matchesQuery
        && (yearFilter === 'ALL' || record.year === yearFilter)
        && (serviceFilter === 'ALL' || record.service === serviceFilter)
        && (categoryFilter === 'ALL' || record.archiveCategory === categoryFilter)
        && (approverFilter === 'ALL' || record.approver === approverFilter);
    });
  }, [approverFilter, categoryFilter, serviceFilter, submittedQuery, yearFilter]);

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 3500);
  };

  const resetFilters = () => {
    setQuery('');
    setSubmittedQuery('');
    setYearFilter('ALL');
    setServiceFilter('ALL');
    setApproverFilter('ALL');
    setCategoryFilter('ALL');
  };

  const exportRecords = () => {
    const rows = [
      ['Mã hồ sơ', 'Sinh viên', 'MSSV', 'Dịch vụ', 'Tủ hồ sơ', 'Ngày duyệt', 'Cán bộ duyệt', 'Mã lưu trữ', 'Dung lượng'],
      ...filteredRecords.map((record) => [
        record.code, record.student, record.studentId, record.service, record.cabinet,
        record.approvedAt, record.approver, record.archiveCode, record.size,
      ]),
    ];
    const csv = `\uFEFF${rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\r\n')}`;
    downloadFile('danh-sach-kho-ho-so-demo.csv', csv, 'text/csv;charset=utf-8');
  };

  const downloadArchive = () => {
    const files = filteredRecords.map((record) => ({
      name: `${record.archiveCode}-README.txt`,
      content: [
        'HUMG PORTAL - HỒ SƠ LƯU TRỮ MẪU',
        'Đây là dữ liệu mô phỏng; không chứa văn bản đã ký số hay chữ ký CA thật.',
        `Mã hồ sơ: ${record.code}`,
        `Sinh viên: ${record.student} (${record.studentId})`,
        `Dịch vụ: ${record.service}`,
        `Ngày duyệt: ${record.approvedAt}`,
        `Cán bộ duyệt: ${record.approver} - ${record.approverRole}`,
        `Mã lưu trữ: ${record.archiveCode}`,
      ].join('\n'),
    }));
    if (files.length === 0) {
      showToast('Không có hồ sơ phù hợp để đưa vào gói tải xuống.');
      return;
    }
    const readme = {
      name: 'README.txt',
      content: 'GÓI HỒ SƠ LƯU TRỮ DEMO\n\nCác tệp trong gói là thông tin mô phỏng dạng văn bản. Đây không phải bản gốc, PDF chính thức hay tài liệu có chữ ký số CA.\n',
    };
    const url = URL.createObjectURL(createZip([readme, ...files]));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'goi-ho-so-luu-tru-demo.zip';
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const downloadRecord = (record) => {
    const receipt = [
      'HUMG PORTAL - PHIẾU THÔNG TIN HỒ SƠ LƯU TRỮ (DEMO)',
      'Tệp này chỉ là dữ liệu minh họa, không phải văn bản PDF đã ký số hoặc bản gốc.',
      `Mã hồ sơ: ${record.code}`,
      `Sinh viên: ${record.student} - MSSV ${record.studentId}`,
      `Dịch vụ: ${record.service}`,
      `Ngày phê duyệt: ${record.approvedAt}`,
      `Mã lưu trữ: ${record.archiveCode}`,
      `Tệp tham chiếu: ${record.filename}`,
      `Trạng thái chữ ký: Dữ liệu minh họa, chưa xác thực CA.`,
    ].join('\n');
    downloadFile(`${record.archiveCode}-thong-tin-demo.txt`, receipt);
  };

  const openRecord = (record, tab) => {
    setSelectedRecord(record);
    setModalTab(tab);
  };

  return (
    <main className="dashboard-page archive-search-page">
      <header className="archive-page-header">
        <div>
          <Link className="archive-back-link" to="/dashboard"><ArrowLeft size={16} /> Quay lại Dashboard</Link>
          <span className="dashboard-kicker">QUẢN LÝ HỒ SƠ &amp; THỦ TỤC / KHO LƯU TRỮ</span>
          <h1 className="page-title">Kho lưu trữ hồ sơ &amp; Lịch sử duyệt</h1>
          <p className="page-subtitle">Tra cứu hồ sơ đã phê duyệt, lưu trữ điện tử và lịch sử xử lý từng bước của cán bộ.</p>
        </div>
      </header>

      <div className="archive-demo-note" role="note">
        <ShieldCheck size={17} />
        <span>Dữ liệu và thông tin chữ ký số trên trang là dữ liệu mẫu để trình diễn; không đại diện hồ sơ lưu trữ hoặc chứng thư CA thật.</span>
      </div>

      <section className="archive-search-panel" aria-label="Tìm kiếm kho lưu trữ">
        <form className="archive-search-form" onSubmit={(event) => { event.preventDefault(); setSubmittedQuery(query); }}>
          <label className="archive-search-input">
            <Search size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Nhập mã hồ sơ, MSSV, tên sinh viên hoặc mã lưu trữ..."
              aria-label="Tìm hồ sơ lưu trữ"
            />
          </label>
          <div className="archive-filter-row">
            <label><span>Năm lưu trữ</span><select value={yearFilter} onChange={(event) => setYearFilter(event.target.value)}><option value="ALL">Tất cả (2024-2026)</option><option value="2026">2026</option><option value="2025">2025</option><option value="2024">2024</option></select></label>
            <label><span>Loại dịch vụ</span><select value={serviceFilter} onChange={(event) => setServiceFilter(event.target.value)}><option value="ALL">Tất cả dịch vụ</option>{[...new Set(ARCHIVED_RECORDS.map((record) => record.service))].map((service) => <option value={service} key={service}>{service}</option>)}</select></label>
            <label><span>Cán bộ duyệt</span><select value={approverFilter} onChange={(event) => setApproverFilter(event.target.value)}><option value="ALL">Tất cả cán bộ</option>{[...new Set(ARCHIVED_RECORDS.map((record) => record.approver))].map((approver) => <option value={approver} key={approver}>{approver}</option>)}</select></label>
          </div>
          <div className="archive-toolbar-actions">
            <button className="btn btn-primary" type="submit"><Search size={16} /> Tìm kiếm</button>
            <button className="btn btn-outline" type="button" onClick={resetFilters}>Đặt lại</button>
            <button className="btn btn-outline" type="button" onClick={exportRecords}><Download size={16} /> Xuất danh sách (CSV)</button>
            <button className="btn btn-outline" type="button" onClick={downloadArchive}><FileArchive size={16} /> Tải gói hồ sơ (ZIP)</button>
          </div>
        </form>
      </section>

      <section className="archive-stats" aria-label="Thống kê kho lưu trữ">
        <article><span className="archive-stat-icon blue"><Archive size={19} /></span><div><span>Đã duyệt</span><strong>462 <small>hồ sơ</small></strong></div></article>
        <article><span className="archive-stat-icon amber"><Database size={19} /></span><div><span>Lưu trữ theo năm</span><strong>7 <small>năm dữ liệu</small></strong></div></article>
        <article><span className="archive-stat-icon cyan"><Clock3 size={19} /></span><div><span>Chờ lưu trữ</span><strong>11 <small>hồ sơ</small></strong></div></article>
        <article><span className="archive-stat-icon green"><HardDrive size={19} /></span><div><span>Tổng bộ nhớ</span><strong>91 <small>GB</small></strong></div></article>
      </section>

      <section className="archive-category-section">
        <div className="archive-section-heading"><div><h2>Thư mục lưu trữ</h2><p>Chọn nhóm hồ sơ để lọc nhanh danh sách bên dưới.</p></div></div>
        <div className="archive-category-grid">
          {CATEGORY_CARDS.map(({ name, title, description, count, size, icon: Icon }) => (
            <button className={`archive-category-card ${categoryFilter === name ? 'selected' : ''}`} key={name} type="button" onClick={() => setCategoryFilter((current) => current === name ? 'ALL' : name)}>
              <span className="archive-category-icon"><Icon size={19} /></span>
              <strong>{title}</strong>
              <span>{description}</span>
              <small>{count} <i>·</i> {size} <ArrowLeft size={14} /></small>
            </button>
          ))}
        </div>
      </section>

      <section className="archive-table-panel">
        <div className="archive-table-heading">
          <div><h2>Tra cứu hồ sơ &amp; lịch sử duyệt</h2><p>{filteredRecords.length} hồ sơ trong dữ liệu mẫu phù hợp với điều kiện lọc.</p></div>
          <span className="archive-data-chip"><CheckCircle2 size={15} /> Đã phê duyệt</span>
        </div>
        <div className="archive-table-scroll">
          <table className="archive-table">
            <thead><tr><th>Mã hồ sơ</th><th>Sinh viên &amp; MSSV</th><th>Dịch vụ / tủ hồ sơ</th><th>Ngày duyệt</th><th>Cán bộ phê duyệt</th><th>Mã lưu trữ (dung lượng)</th><th>Thao tác</th></tr></thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.code}>
                  <td><strong className="archive-code">{record.code}</strong></td>
                  <td><strong>{record.student}</strong><small>{record.studentId}</small></td>
                  <td><strong>{record.service}</strong><small>{record.cabinet}</small></td>
                  <td>{record.approvedAt}</td>
                  <td><strong>{record.approver}</strong><small>{record.approverRole}</small></td>
                  <td><strong className="archive-id">{record.archiveCode}</strong><small>{record.size} · {record.fileType}</small></td>
                  <td><div className="archive-row-actions"><button className="btn btn-outline" type="button" onClick={() => openRecord(record, 'file')}><Eye size={14} /> Xem file</button><button className="btn btn-outline" type="button" onClick={() => openRecord(record, 'history')}><History size={14} /> Nhật ký</button></div></td>
                </tr>
              ))}
              {filteredRecords.length === 0 && <tr><td className="archive-empty" colSpan="7">Không tìm thấy hồ sơ lưu trữ phù hợp. Hãy thử điều chỉnh từ khóa hoặc bộ lọc.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="archive-table-footer"><span>Đang hiển thị {filteredRecords.length} / {ARCHIVED_RECORDS.length} hồ sơ mẫu</span><span><FileText size={14} /> Bản xem trước không thay thế hồ sơ gốc</span></div>
      </section>

      {selectedRecord && (
        <div className="archive-modal-backdrop" onClick={() => setSelectedRecord(null)}>
          <section className="archive-modal" role="dialog" aria-modal="true" aria-labelledby="archive-modal-title" onClick={(event) => event.stopPropagation()}>
            <header className="archive-modal-header">
              <div><span className="dashboard-kicker">HỒ SƠ LƯU TRỮ / {selectedRecord.archiveCode}</span><h2 id="archive-modal-title">Chi tiết hồ sơ #{selectedRecord.code}</h2><p>{selectedRecord.student} · MSSV {selectedRecord.studentId}</p></div>
              <button className="archive-modal-close" type="button" onClick={() => setSelectedRecord(null)} aria-label="Đóng"><X size={19} /></button>
            </header>
            <div className="archive-modal-body">
              <div className="archive-demo-note compact"><ShieldCheck size={16} /><span>Thông tin xem trước và tệp tải xuống chỉ là minh họa, không phải bản gốc đã ký số CA.</span></div>
              <div className="archive-record-meta">
                <div><span>Mã lưu trữ</span><strong>{selectedRecord.archiveCode}</strong></div>
                <div><span>Dung lượng</span><strong>{selectedRecord.size}</strong></div>
                <div><span>Chữ ký CA</span><strong className="archive-signature"><CheckCircle2 size={15} /> Trạng thái mẫu</strong></div>
              </div>
              <div className="archive-modal-tabs" role="tablist" aria-label="Chi tiết hồ sơ">
                <button type="button" role="tab" aria-selected={modalTab === 'history'} className={modalTab === 'history' ? 'active' : ''} onClick={() => setModalTab('history')}><History size={15} /> Lịch sử duyệt</button>
                <button type="button" role="tab" aria-selected={modalTab === 'file'} className={modalTab === 'file' ? 'active' : ''} onClick={() => setModalTab('file')}><FileText size={15} /> Tệp lưu trữ</button>
              </div>
              {modalTab === 'history' ? (
                <div className="archive-timeline">
                  <h3><Clock3 size={17} /> Lịch sử thao tác và bước duyệt</h3>
                  <ol>{selectedRecord.timeline.map((entry) => <li key={entry}><span className="archive-timeline-dot" /><p>{entry}</p></li>)}</ol>
                </div>
              ) : (
                <div className="archive-file-preview">
                  <div className="archive-file-preview-toolbar"><span><FileText size={16} /> {selectedRecord.filename}</span><span>PDF · Bản xem trước demo</span></div>
                  <div className="archive-document">
                    <span>HUMG · CỔNG DỊCH VỤ SINH VIÊN</span>
                    <h3>{selectedRecord.service.toLocaleUpperCase('vi')}</h3>
                    <p>Mã hồ sơ: {selectedRecord.code}</p>
                    <p>Họ tên sinh viên: {selectedRecord.student}</p>
                    <p>Mã sinh viên: {selectedRecord.studentId}</p>
                    <p>Ngày phê duyệt: {selectedRecord.approvedAt}</p>
                    <p className="archive-document-stamp">BẢN XEM TRƯỚC DỮ LIỆU MẪU<br />KHÔNG CÓ GIÁ TRỊ PHÁP LÝ</p>
                  </div>
                </div>
              )}
            </div>
            <footer className="archive-modal-footer">
              <button className="btn btn-outline" type="button" onClick={() => setSelectedRecord(null)}>Đóng</button>
              <button className="btn btn-primary" type="button" onClick={() => { downloadRecord(selectedRecord); showToast('Đã tải phiếu thông tin demo; không phải bản gốc đã ký số.'); }}><ArrowDownToLine size={16} /> Tải thông tin (demo)</button>
            </footer>
          </section>
        </div>
      )}

      {toast && <div className="archive-toast" role="status"><CheckCircle2 size={17} />{toast}</div>}
    </main>
  );
}

import { useState } from 'react';
import { ArrowLeft, Check, ChevronDown, ChevronLeft, ChevronRight, Download, FileText, RotateCw, Search, X, ZoomIn, ZoomOut } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './IntakeReviewPage.css';

const seedApplications = [
  { code: 'HS-2998', student: 'Nguyễn Hoàng Phúc', studentId: '21190121', className: 'DCCTKT67', faculty: 'Kinh tế', email: 'phuc.nh@student.humg.edu.vn', phone: '0911.234.567', service: 'Xác nhận sinh viên', reason: 'Bổ sung hồ sơ thực tập', submitted: '14/10/2026 - 08:12' },
  { code: 'HS-3000', student: 'Trần Minh Anh', studentId: '22190083', className: 'DCCTĐC66', faculty: 'Mỏ - Địa chất', email: 'anh.tm@student.humg.edu.vn', phone: '0902.345.678', service: 'Cấp giấy xác nhận', reason: 'Xác nhận thông tin sinh viên', submitted: '14/10/2026 - 08:21' },
  { code: 'HS-3001', student: 'Đặng Phương Lan', studentId: '21190034', className: 'DCCTCT67', faculty: 'Mỏ - Địa chất', email: 'lan.dp@student.humg.edu.vn', phone: '0987.654.321', service: 'Tuyển sinh / Nhập học', reason: 'Xác nhận nhập học lại', submitted: '14/10/2026 - 08:30' },
  { code: 'HS-3004', student: 'Lê Huy Anh', studentId: '21190042', className: 'DCCTKT66', faculty: 'Kinh tế', email: 'anh.lh@student.humg.edu.vn', phone: '0912.345.678', service: 'Cấp giấy xác nhận', reason: 'Xác nhận đang học để bổ sung hồ sơ', submitted: '14/10/2026 - 09:15' },
  { code: 'HS-3006', student: 'Mai Khánh Linh', studentId: '22190017', className: 'DCCTĐC67', faculty: 'Mỏ - Địa chất', email: 'linh.mk@student.humg.edu.vn', phone: '0988.123.456', service: 'Hỗ trợ vay vốn', reason: 'Xác nhận hồ sơ vay vốn sinh viên', submitted: '14/10/2026 - 09:42' },
  { code: 'HS-3008', student: 'Vũ Minh Tuấn', studentId: '20190076', className: 'DCCTKT64', faculty: 'Kinh tế', email: 'tuan.vm@student.humg.edu.vn', phone: '0904.567.123', service: 'Hồ sơ học bổng', reason: 'Đề nghị xét học bổng khuyến khích học tập', submitted: '14/10/2026 - 10:05' },
];

const applications = Array.from({ length: 19 }, (_, index) => (
  seedApplications[index] || {
    ...seedApplications[index % seedApplications.length],
    code: `HS-${3001 + index * 2}`,
    submitted: `${13 - Math.floor(index / 5)}/10/2026 - 10:30`,
  }
));

const documents = [
  { name: 'CCCD_MatTruoc.jpg', title: 'CCCD / CMND bản chính', kind: 'identity' },
  { name: 'Don_dang_ky_nhap_hoc.pdf', title: 'Đơn đăng ký nhập học', kind: 'application' },
  { name: 'Giay_kham_suc_khoe.pdf', title: 'Giấy khám sức khỏe', kind: 'health' },
];

const checklistItems = [
  'Ảnh scan gốc rõ nét, đủ 2 mặt',
  'Đã nộp đầy đủ học phí',
  'Sổ đoàn viên (chưa nộp)',
];

function DocumentPreview({ document, zoom, rotation }) {
  return (
    <div className="intake-preview-viewport">
      <article className={`intake-document-preview ${document.kind}`} style={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }}>
        {document.kind === 'identity' ? (
          <div className="intake-id-card">
            <div className="intake-id-emblem">✦</div>
            <div className="intake-id-heading">CĂN CƯỚC CÔNG DÂN</div>
            <div className="intake-id-line strong">ĐẶNG PHƯƠNG LAN</div>
            <div className="intake-id-line">Số định danh: 0012 1190 034</div>
            <div className="intake-id-line">Ngày sinh: 12/04/2003</div>
            <div className="intake-id-line">Quê quán: Hà Nội</div>
            <div className="intake-id-photo">ẢNH</div>
            <small>BẢN XEM TRƯỚC TỆP MẪU</small>
          </div>
        ) : (
          <div className="intake-paper">
            <span>TRƯỜNG ĐẠI HỌC MỎ - ĐỊA CHẤT</span>
            <strong>{document.kind === 'health' ? 'GIẤY KHÁM SỨC KHỎE' : 'ĐƠN ĐĂNG KÝ NHẬP HỌC'}</strong>
            <p>Kính gửi: Phòng Công tác sinh viên</p>
            <p>Họ và tên: Đặng Phương Lan</p>
            <p>Mã sinh viên: 21190034</p>
            <p>Nội dung: {document.title}</p>
            <div className="intake-paper-lines" />
            <small>BẢN XEM TRƯỚC TỆP MẪU</small>
          </div>
        )}
      </article>
    </div>
  );
}

function DecisionDialog({ decision, onClose, onSubmit }) {
  const [reason, setReason] = useState('');
  const labels = {
    supplement: ['Yêu cầu bổ sung giấy tờ', 'Ghi rõ giấy tờ hoặc thông tin sinh viên cần bổ sung.'],
    reject: ['Từ chối tiếp nhận hồ sơ', 'Nhập lý do từ chối để thông báo cho sinh viên.'],
    accept: ['Xác nhận tiếp nhận hồ sơ', 'Hồ sơ sẽ được ghi nhận và chuyển đến đơn vị thụ lý đã chọn.'],
  };
  const [title, description] = labels[decision];
  const requiresReason = decision !== 'accept';
  return (
    <div className="intake-dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="intake-dialog" role="dialog" aria-modal="true" aria-labelledby="intake-dialog-title">
        <button className="intake-icon-button intake-dialog-close" type="button" onClick={onClose} aria-label="Đóng"><X size={18} /></button>
        <span className="intake-eyebrow">XỬ LÝ HỒ SƠ</span>
        <h2 id="intake-dialog-title">{title}</h2>
        <p>{description}</p>
        {requiresReason && <label className="intake-dialog-label">Nội dung
          <textarea rows="4" value={reason} onChange={(event) => setReason(event.target.value)} placeholder={decision === 'supplement' ? 'Ví dụ: Vui lòng bổ sung sổ đoàn viên...' : 'Nhập lý do từ chối...'} />
        </label>}
        <div className="intake-dialog-actions">
          <button type="button" className="intake-button secondary" onClick={onClose}>Hủy</button>
          <button type="button" className={`intake-button ${decision === 'reject' ? 'danger' : 'primary'}`} disabled={requiresReason && !reason.trim()} onClick={() => onSubmit(reason.trim())}>
            <Check size={16} /> Xác nhận
          </button>
        </div>
      </section>
    </div>
  );
}

export default function IntakeReviewPage() {
  const { index: indexParam } = useParams();
  const navigate = useNavigate();
  const parsedIndex = Number(indexParam);
  const currentIndex = Number.isInteger(parsedIndex) ? Math.min(Math.max(parsedIndex, 1), applications.length) : 3;
  const application = applications[currentIndex - 1];
  const [department, setDepartment] = useState('Phòng Công tác SV');
  const [assignee, setAssignee] = useState('Trọng A');
  const [checkedItems, setCheckedItems] = useState([true, true, false]);
  const [documentIndex, setDocumentIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [decision, setDecision] = useState('');
  const [notice, setNotice] = useState('');
  const selectedDocument = documents[documentIndex];

  const goToApplication = (index) => navigate(`/dashboard/ho-so-cho-tiep-nhan/tiep-nhan/${index}`);
  const downloadPreview = () => {
    const previewText = `Tệp xem trước minh họa: ${selectedDocument.name}\nHồ sơ: ${application.code}\nSinh viên: ${application.student}\n`;
    const blob = new Blob([previewText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${selectedDocument.name}.preview.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="dashboard-page intake-review-page">
      <nav className="intake-top-navigation" aria-label="Điều hướng hồ sơ">
        <Link to="/dashboard/ho-so-cho-tiep-nhan" className="intake-back-link"><ArrowLeft size={16} /> Quay lại Danh sách chờ tiếp nhận</Link>
        <strong>HỒ SƠ {currentIndex} / 19 CHỜ TIẾP NHẬN</strong>
        <div className="intake-pagination">
          <button type="button" disabled={currentIndex <= 1} onClick={() => goToApplication(currentIndex - 1)}><ChevronLeft size={15} /> HS Trước</button>
          <button type="button" disabled={currentIndex >= applications.length} onClick={() => goToApplication(currentIndex + 1)}>HS Tiếp <ChevronRight size={15} /></button>
        </div>
      </nav>

      <header className="intake-case-header">
        <div>
          <span className="intake-eyebrow">NHÂN VIÊN · QUẢN LÝ HỒ SƠ · BÀN TIẾP NHẬN &amp; THẨM ĐỊNH</span>
          <h1>{application.code} <span className="intake-status-badge">● MỚI TẠO</span></h1>
          <p>Ngày gửi: {application.submitted}</p>
        </div>
        {notice && <div className="intake-notice" role="status">{notice}<button type="button" onClick={() => setNotice('')} aria-label="Đóng thông báo"><X size={15} /></button></div>}
      </header>

      <div className="intake-workspace">
        <aside className="card intake-panel intake-student-panel">
          <div className="intake-panel-title"><span className="intake-panel-icon blue"><Search size={18} /></span><div><h2>Thông tin sinh viên</h2><p>Thông tin người đề nghị</p></div></div>
          <div className="intake-student-identity"><span className="intake-avatar">{application.student.split(' ').slice(-1)[0].charAt(0)}</span><div><strong>{application.student}</strong><small>MSSV: {application.studentId}</small></div></div>
          <dl className="intake-details-list">
            <div><dt>Lớp</dt><dd>{application.className}</dd></div>
            <div><dt>Khoa</dt><dd>{application.faculty}</dd></div>
            <div><dt>Email</dt><dd>{application.email}</dd></div>
            <div><dt>Số điện thoại</dt><dd>{application.phone}</dd></div>
          </dl>
          <div className="intake-subsection">
            <h3>Thông tin đơn đề nghị</h3>
            <dl className="intake-details-list">
              <div><dt>Dịch vụ</dt><dd>{application.service}</dd></div>
              <div><dt>Lý do</dt><dd>{application.reason}</dd></div>
              <div><dt>Phí thủ tục</dt><dd>0 VNĐ (Miễn phí)</dd></div>
            </dl>
          </div>
          <div className="intake-subsection">
            <h3>Lịch sử tương tác</h3>
            <div className="intake-history-entry"><span /> <p><strong>{application.submitted}</strong><br />Sinh viên tạo đơn mới.</p></div>
          </div>
        </aside>

        <section className="card intake-panel intake-documents-panel">
          <div className="intake-panel-title"><span className="intake-panel-icon violet"><FileText size={18} /></span><div><h2>Khung xem trước văn bản</h2><p>Kiểm tra tệp đính kèm trước khi xử lý</p></div></div>
          <label className="intake-document-select"><span>Tệp đang xem</span><select value={documentIndex} onChange={(event) => setDocumentIndex(Number(event.target.value))}>{documents.map((item, index) => <option key={item.name} value={index}>Tệp {index + 1}: {item.name}</option>)}</select><ChevronDown size={16} /></label>
          <div className="intake-document-toolbar">
            <div><button className="intake-icon-button" type="button" onClick={() => setZoom((value) => Math.min(1.35, value + .1))} aria-label="Phóng to"><ZoomIn size={17} /></button><button className="intake-icon-button" type="button" onClick={() => setZoom((value) => Math.max(.7, value - .1))} aria-label="Thu nhỏ"><ZoomOut size={17} /></button><button className="intake-icon-button" type="button" onClick={() => setRotation((value) => (value + 90) % 360)} aria-label="Xoay"><RotateCw size={17} /></button></div>
            <button className="intake-icon-button" type="button" onClick={downloadPreview} aria-label="Tải bản xem trước"><Download size={17} /></button>
          </div>
          <DocumentPreview document={selectedDocument} zoom={zoom} rotation={rotation} />
          <div className="intake-attachment-list">
            <div className="intake-attachment-heading"><h3>Danh sách tệp đính kèm</h3><span>{documents.length}</span></div>
            {documents.map((item, index) => (
              <button type="button" key={item.name} className={`intake-attachment-row ${documentIndex === index ? 'selected' : ''}`} onClick={() => setDocumentIndex(index)}>
                <span className={`intake-file-status ${index < 2 ? 'complete' : 'missing'}`}>{index < 2 ? <Check size={13} /> : <X size={13} />}</span><span><strong>{index + 1}. {item.title}</strong><small>{item.name}</small></span><ChevronRight size={15} />
              </button>
            ))}
          </div>
        </section>

        <aside className="card intake-panel intake-decision-panel">
          <div className="intake-panel-title"><span className="intake-panel-icon amber"><Check size={18} /></span><div><h2>Quyết định tiếp nhận</h2><p>Phân luồng và kiểm tra hồ sơ</p></div></div>
          <label className="intake-field-label">1. Phòng ban thụ lý tiếp theo
            <select value={department} onChange={(event) => setDepartment(event.target.value)}>
              <option>Phòng Công tác SV</option><option>Phòng Đào tạo</option><option>Phòng Tài chính</option><option>Bộ phận Một cửa</option>
            </select>
          </label>
          <label className="intake-field-label">2. Cán bộ phụ trách thẩm định
            <select value={assignee} onChange={(event) => setAssignee(event.target.value)}>
              <option>Trọng A</option><option>Nguyễn Văn A</option><option>Phạm Thu Hà</option><option>Tự động phân luồng</option>
            </select>
          </label>
          <fieldset className="intake-checklist">
            <legend>3. Checklist kiểm tra mẫu</legend>
            {checklistItems.map((item, index) => (
              <label key={item} className={checkedItems[index] ? 'checked' : 'unchecked'}>
                <input type="checkbox" checked={checkedItems[index]} onChange={() => setCheckedItems((values) => values.map((value, itemIndex) => itemIndex === index ? !value : value))} />
                <span className="intake-custom-checkbox">{checkedItems[index] && <Check size={12} />}</span>{item}
              </label>
            ))}
          </fieldset>
          <div className="intake-decision-actions">
            <h3>4. Nút hành động chính</h3>
            <button className="intake-button primary full" type="button" onClick={() => {
              if (!checkedItems.every(Boolean)) {
                setNotice('Checklist còn mục chưa hoàn tất. Hãy kiểm tra hồ sơ hoặc yêu cầu sinh viên bổ sung giấy tờ.');
                return;
              }
              setDecision('accept');
            }}><Check size={17} /> Tiếp nhận &amp; phân luồng</button>
            <button className="intake-button warning full" type="button" onClick={() => setDecision('supplement')}>Yêu cầu bổ sung giấy tờ</button>
            <button className="intake-button danger full" type="button" onClick={() => setDecision('reject')}><X size={17} /> Từ chối tiếp nhận</button>
            <p className="intake-demo-note">Thao tác chỉ lưu trạng thái xem trước trên trang này.</p>
          </div>
        </aside>
      </div>
      <footer className="intake-footer-note">Thông tin sinh viên, hồ sơ và tệp đính kèm đang là dữ liệu minh họa; trang chưa kết nối API tiếp nhận hồ sơ.</footer>
      {decision && <DecisionDialog decision={decision} onClose={() => setDecision('')} onSubmit={(reason) => {
        const decisionText = decision === 'accept' ? `Đã ghi nhận tiếp nhận ${application.code} và chuyển tới ${department} (${assignee}).` : decision === 'supplement' ? `Đã ghi nhận yêu cầu bổ sung: ${reason}` : `Đã ghi nhận từ chối hồ sơ: ${reason}`;
        setNotice(`${decisionText} (bản xem trước).`);
        setDecision('');
      }} />}
    </div>
  );
}

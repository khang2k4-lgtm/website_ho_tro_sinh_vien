import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckCircle2,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Mail,
  Phone,
  RotateCw,
  Save,
  UserRound,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { STAFF_ROLES, STATUS_LABELS, formatDate } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';

const FORM_FIELD_LABELS = {
  fullName: 'Họ và tên',
  studentId: 'Mã số sinh viên',
  faculty: 'Khoa / Chuyên ngành',
  className: 'Lớp',
  email: 'Email',
  phone: 'Số điện thoại',
  purpose: 'Nội dung yêu cầu',
  reason: 'Lý do',
  note: 'Ghi chú',
};

function formatFieldLabel(key) {
  return FORM_FIELD_LABELS[key] || key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]/g, ' ')
    .replace(/^./, (letter) => letter.toUpperCase());
}

function formatFieldValue(value) {
  if (Array.isArray(value)) return value.join(', ');
  if (value && typeof value === 'object') return JSON.stringify(value);
  return String(value ?? '');
}

export default function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [app, setApp] = useState(null);
  const [loadError, setLoadError] = useState({ id: '', message: '' });
  const [rating, setRating] = useState({ score: 5, comment: '' });
  const [response, setResponse] = useState('');
  const [nextStatus, setNextStatus] = useState('PROCESSING');
  const [saving, setSaving] = useState(false);
  const [pdfZoom, setPdfZoom] = useState(100);
  const [pdfRotation, setPdfRotation] = useState(0);
  const isStaff = STAFF_ROLES.includes(user?.role);

  useEffect(() => {
    let active = true;
    api.get(`/applications/${id}`)
      .then((r) => {
        if (!active) return;
        setApp(r.data);
        setNextStatus(r.data.status === 'SUBMITTED' ? 'RECEIVED' : r.data.status);
      })
      .catch((err) => {
        if (active) setLoadError({ id, message: err.response?.data?.message || 'Không thể tải thông tin yêu cầu.' });
      });
    return () => {
      active = false;
    };
  }, [id]);

  const updateApplication = async (status = app.status) => {
    if (!response.trim() && status === app.status) return;
    setSaving(true);
    try {
      const { data } = await api.patch(`/applications/${id}/status`, {
        status,
        note: response.trim() || `Cập nhật: ${STATUS_LABELS[status]?.label}`,
      });
      setApp((current) => ({ ...current, ...data }));
      setResponse('');
      setNextStatus(status);
    } catch (err) {
      alert(err.response?.data?.message || 'Không thể cập nhật yêu cầu');
    } finally {
      setSaving(false);
    }
  };

  const submitRating = async () => {
    await api.post('/ratings', { score: rating.score, comment: rating.comment, applicationId: id, serviceId: app.serviceId });
    api.get(`/applications/${id}`).then((r) => setApp(r.data));
  };

  if (loadError.id === id && loadError.message) {
    return (
      <div className="application-detail-page">
        <div className="application-detail-state">
          <p role="alert">{loadError.message}</p>
          <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> Quay lại
          </button>
        </div>
      </div>
    );
  }

  if (!app || app.id !== id) return <div className="loading container">Đang tải thông tin yêu cầu...</div>;

  const status = STATUS_LABELS[app.status];
  const attachments = Array.isArray(app.attachments) ? app.attachments : [];
  const pdfFiles = attachments.filter((file) => file?.toLowerCase().endsWith('.pdf'));
  const formData = app.formData && typeof app.formData === 'object' ? app.formData : {};
  const requestFields = Object.entries(formData);
  const studentName = app.student?.fullName || 'Sinh viên';
  const studentInitial = studentName.trim().charAt(0).toLocaleUpperCase('vi-VN') || 'S';

  return (
    <div className={`application-detail-page ${isStaff ? 'staff-detail-page' : ''}`}>
      <div className="application-detail-topbar">
        <button type="button" className="back-link" onClick={() => navigate(isStaff ? '/dashboard/ho-so' : '/tai-khoan/ho-so')}>
          <ArrowLeft size={17} /> Quay lại
        </button>

        <div className="application-detail-title-wrap">
          <span className="dashboard-kicker">{isStaff ? 'HỒ SƠ ĐANG XỬ LÝ' : 'TRANG SINH VIÊN / HỒ SƠ CỦA TÔI'}</span>
          <h1>Chi tiết yêu cầu <strong>#{app.code}</strong></h1>
        </div>

        <span className={`badge ${status?.class}`}>{status?.label}</span>
      </div>

      <div className="application-detail-content">
        <div className="application-main-column">
          <section className="detail-panel student-summary">
            <div className="detail-panel-title">
              <div className="student-avatar">{studentInitial}</div>
              <div>
                <span className="detail-eyebrow">SINH VIÊN</span>
                <h2>{studentName}</h2>
                <p>MSSV: {app.student?.studentId || 'Chưa cập nhật'} · {app.student?.email || 'Chưa cập nhật email'}</p>
              </div>
            </div>
          </section>

          <section className="detail-panel">
            <div className="detail-panel-title">
              <FileText size={19} />
              <h2>Thông tin yêu cầu</h2>
            </div>

            <div className="request-meta">
              <div>
                <FileText size={15} aria-hidden="true" />
                <span>Dịch vụ</span>
                <strong>{app.service?.name}</strong>
              </div>
              <div>
                <CalendarDays size={15} aria-hidden="true" />
                <span>Ngày gửi</span>
                <strong>{formatDate(app.createdAt)}</strong>
              </div>
              <div>
                <Building2 size={15} aria-hidden="true" />
                <span>Phòng ban</span>
                <strong>{app.service?.department?.name || 'Chưa phân phòng ban'}</strong>
              </div>
            </div>

            <div className="request-content">
              <span className="detail-eyebrow">NỘI DUNG YÊU CẦU</span>
              {requestFields.length > 0 ? (
                <dl className="request-fields">
                  {requestFields.map(([key, value]) => (
                    <div className="request-field" key={key}>
                      <dt>{formatFieldLabel(key)}</dt>
                      <dd>{formatFieldValue(value) || '—'}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="request-empty">Sinh viên chưa cung cấp nội dung kê khai.</p>
              )}
              {app.note && !formData.note && (
                <p className="student-note"><strong>Ghi chú sinh viên:</strong> {app.note}</p>
              )}
            </div>
          </section>

          {attachments.length > 0 && (
            <section className="detail-panel attachment-panel">
              <div className="detail-panel-title">
                <FileText size={19} />
                <h2>Hồ sơ đính kèm</h2>
                <span className="attachment-count">{attachments.length} tệp</span>
              </div>

              {pdfFiles.length > 0 && (
                <div className="pdf-preview-wrapper">
                  <div className="pdf-preview-header">
                    <span className="pdf-file-title">
                      <FileText size={16} />
                      {pdfFiles[0].split('/').pop()?.split('?')[0]}
                    </span>
                    <span>{pdfFiles.length} file PDF</span>
                  </div>
                  <div className="pdf-toolbar" role="toolbar" aria-label="Công cụ xem PDF">
                    <div className="pdf-zoom-controls">
                      <button
                        type="button"
                        className="pdf-tool-button"
                        aria-label="Thu nhỏ PDF"
                        title="Thu nhỏ"
                        disabled={pdfZoom <= 75}
                        onClick={() => setPdfZoom((zoom) => Math.max(75, zoom - 25))}
                      >
                        <ZoomOut size={17} />
                      </button>
                      <span aria-live="polite">{pdfZoom}%</span>
                      <button
                        type="button"
                        className="pdf-tool-button"
                        aria-label="Phóng to PDF"
                        title="Phóng to"
                        disabled={pdfZoom >= 150}
                        onClick={() => setPdfZoom((zoom) => Math.min(150, zoom + 25))}
                      >
                        <ZoomIn size={17} />
                      </button>
                    </div>
                    <button
                      type="button"
                      className="pdf-tool-button pdf-rotate-button"
                      onClick={() => setPdfRotation((rotation) => (rotation + 90) % 360)}
                    >
                      <RotateCw size={16} /> Xoay
                    </button>
                    <div className="pdf-toolbar-actions">
                      <a href={pdfFiles[0]} target="_blank" rel="noreferrer" className="pdf-tool-button" aria-label="Mở PDF ở tab mới" title="Mở ở tab mới">
                        <ExternalLink size={16} />
                      </a>
                      <a href={pdfFiles[0]} download className="pdf-tool-button" aria-label="Tải PDF về" title="Tải về">
                        <Download size={16} />
                      </a>
                    </div>
                  </div>
                  <div className="pdf-viewport">
                    <iframe
                      className={`pdf-preview ${pdfRotation % 180 !== 0 ? 'is-rotated' : ''}`}
                      title={`Xem trước ${pdfFiles[0].split('/').pop()?.split('?')[0]}`}
                      src={pdfFiles[0]}
                      style={{ zoom: pdfZoom / 100, transform: `rotate(${pdfRotation}deg)` }}
                    />
                  </div>
                </div>
              )}

              {attachments.filter((file) => file !== pdfFiles[0]).map((file) => (
                <div className="attachment-row" key={file}>
                  <span><FileText size={17} />{file.split('/').pop()?.split('?')[0]}</span>
                  <div>
                    <a href={file} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
                      <Eye size={14} /> Xem
                    </a>
                    <a href={file} download className="btn btn-outline btn-sm">
                      <Download size={14} /> Tải xuống
                    </a>
                  </div>
                </div>
              ))}
            </section>
          )}

          <section className="detail-panel">
            <div className="detail-panel-title">
              <CheckCircle2 size={19} />
              <h2>Tiến độ xử lý</h2>
            </div>

            <div className="status-steps">
              {['RECEIVED', 'PROCESSING', 'COMPLETED'].map((step, index) => (
                <div
                  className={`status-step ${app.status === step ? 'current' : ''} ${['RECEIVED', 'PROCESSING', 'COMPLETED'].indexOf(app.status) > index ? 'done' : ''}`}
                  key={step}
                >
                  <span>{index + 1}</span>
                  <strong>{STATUS_LABELS[step].label}</strong>
                </div>
              ))}
            </div>

            <div className="timeline compact-timeline">
              {app.statusHistory?.map((history) => (
                <div key={history.id} className="timeline-item">
                  <strong>{STATUS_LABELS[history.status]?.label}</strong>
                  <p>{history.note}</p>
                  <small>{history.changedBy?.fullName} · {formatDate(history.createdAt)}</small>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="application-side-column">
          {isStaff ? (
            <section className="detail-panel response-panel">
              <div className="detail-panel-title">
                <h2>Xử lý yêu cầu</h2>
                <span className="badge badge-info">{app.assignedTo?.fullName || 'Chưa phân công'}</span>
              </div>

              <label className="label" htmlFor="response">Phản hồi cho sinh viên</label>
              <textarea
                id="response"
                className="textarea response-textarea"
                placeholder="Nhập nội dung phản hồi cho sinh viên..."
                value={response}
                onChange={(event) => setResponse(event.target.value)}
              />

              <label className="label" htmlFor="next-status">Cập nhật trạng thái</label>
              <select
                id="next-status"
                className="select"
                value={nextStatus}
                onChange={(event) => setNextStatus(event.target.value)}
              >
                {Object.keys(STATUS_LABELS)
                  .filter((value) => value !== 'SUBMITTED')
                  .map((value) => (
                    <option value={value} key={value}>{STATUS_LABELS[value].label}</option>
                  ))}
              </select>

              <div className="response-actions">
                <button type="button" className="btn btn-primary" disabled={saving || !response.trim()} onClick={() => updateApplication(app.status)}>
                  <Save size={16} /> {saving ? 'Đang lưu...' : 'Lưu phản hồi'}
                </button>
                <button type="button" className="btn btn-outline" disabled={saving} onClick={() => updateApplication(nextStatus)}>
                  Cập nhật trạng thái
                </button>
              </div>
            </section>
          ) : (
            app.status === 'COMPLETED' && !app.rating && (
              <section className="detail-panel">
                <div className="card-header">Đánh giá dịch vụ</div>
                <div className="card-body">
                  <div className="form-group">
                    <label className="label">Mức độ hài lòng (1-5)</label>
                    <input type="range" min="1" max="5" value={rating.score} onChange={(e) => setRating({ ...rating, score: +e.target.value })} />
                    <span> {rating.score}/5</span>
                  </div>
                  <div className="form-group">
                    <textarea className="textarea" placeholder="Nhận xét..." value={rating.comment} onChange={(e) => setRating({ ...rating, comment: e.target.value })} />
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={submitRating}>Gửi đánh giá</button>
                </div>
              </section>
            )
          )}

          <section className="detail-panel contact-panel">
            <div className="detail-panel-title">
              <UserRound size={18} />
              <h2>Thông tin sinh viên</h2>
            </div>
            <div className="contact-detail">
              <strong>{studentName}</strong>
              <p><Mail size={15} />{app.student?.email || 'Chưa cập nhật email'}</p>
              <p><Phone size={15} />{app.student?.phone || 'Chưa cập nhật số điện thoại'}</p>
              <p><Building2 size={15} />{app.student?.faculty || 'Chưa cập nhật chuyên ngành'} · {app.student?.className || 'Chưa cập nhật lớp'}</p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

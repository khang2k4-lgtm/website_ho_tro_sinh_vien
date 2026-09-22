import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, Download, Eye, FileText, Save } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { STAFF_ROLES, STATUS_LABELS, formatDate } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';

export default function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [app, setApp] = useState(null);
  const [rating, setRating] = useState({ score: 5, comment: '' });
  const [response, setResponse] = useState('');
  const [nextStatus, setNextStatus] = useState('PROCESSING');
  const [saving, setSaving] = useState(false);
  const isStaff = STAFF_ROLES.includes(user?.role);

  useEffect(() => {
    api.get(`/applications/${id}`).then((r) => setApp(r.data));
  }, [id]);

  useEffect(() => {
    if (app) setNextStatus(app.status === 'SUBMITTED' ? 'RECEIVED' : app.status);
  }, [app]);

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

  if (!app) return <div className="loading container">Đang tải...</div>;

  const status = STATUS_LABELS[app.status];
  const attachments = Array.isArray(app.attachments) ? app.attachments : [];
  const pdfFiles = attachments.filter((file) => file?.toLowerCase().endsWith('.pdf'));

  return (
    <div className={`application-detail-page ${isStaff ? 'staff-detail-page' : ''}`}>
      <div className="application-detail-topbar">
        <button type="button" className="back-link" onClick={() => navigate(isStaff ? '/dashboard/ho-so' : '/tai-khoan/ho-so')}>
          <ArrowLeft size={17} /> Quay lại
        </button>

        <div className="application-detail-title-wrap">
          <span className="dashboard-kicker">{isStaff ? 'WORK QUEUE' : 'HỒ SƠ CỦA TÔI'}</span>
          <h1>Chi tiết yêu cầu <strong>#{app.code}</strong></h1>
        </div>

        <span className={`badge ${status?.class}`}>{status?.label}</span>
      </div>

      <div className="application-detail-content">
        <div className="application-main-column">
          <section className="detail-panel student-summary">
            <div className="detail-panel-title">
              <div className="student-avatar">{app.student?.fullName?.charAt(0)}</div>
              <div>
                <span className="detail-eyebrow">SINH VIÊN</span>
                <h2>{app.student?.fullName}</h2>
                <p>MSSV: {app.student?.studentId} · {app.student?.email}</p>
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
                <span>Dịch vụ</span>
                <strong>{app.service?.name}</strong>
              </div>
              <div>
                <span>Ngày gửi</span>
                <strong>{formatDate(app.createdAt)}</strong>
              </div>
              <div>
                <span>Phòng ban</span>
                <strong>{app.service?.department?.name}</strong>
              </div>
            </div>

            <div className="request-content">
              <span className="detail-eyebrow">NỘI DUNG YÊU CẦU</span>
              {Object.entries(app.formData || {}).map(([key, value]) => (
                <p key={key}><strong>{key}:</strong> {String(value)}</p>
              ))}
              {app.note && <p><strong>Ghi chú sinh viên:</strong> {app.note}</p>}
            </div>
          </section>

          {attachments.length > 0 && (
            <section className="detail-panel attachment-panel">
              <div className="detail-panel-title">
                <FileText size={19} />
                <h2>Hồ sơ đính kèm</h2>
              </div>

              {pdfFiles.length > 0 && (
                <div className="pdf-preview-wrapper">
                  <div className="pdf-preview-header">
                    <span>Đơn xác nhận sinh viên</span>
                    <span>{pdfFiles.length} file PDF</span>
                  </div>
                  <iframe
                    className="pdf-preview"
                    title="Preview hồ sơ PDF"
                    src={pdfFiles[0]}
                  />
                </div>
              )}

              {attachments.map((file) => (
                <div className="attachment-row" key={file}>
                  <span><FileText size={17} />{file.split('/').pop()}</span>
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
            <span className="detail-eyebrow">THÔNG TIN SINH VIÊN</span>
            <p><strong>{app.student?.fullName}</strong></p>
            <p>{app.student?.email}</p>
            <p>{app.student?.phone || 'Chưa cập nhật số điện thoại'}</p>
            <p>{app.student?.faculty || 'Chưa cập nhật khoa'} · {app.student?.className || 'Chưa cập nhật lớp'}</p>
          </section>
        </aside>
      </div>
    </div>
  );
}

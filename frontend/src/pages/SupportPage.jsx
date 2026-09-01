import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { CATEGORIES, TICKET_STATUS, formatDate } from '../utils/constants';

const ticketCats = {
  HOC_VU: 'Học vụ',
  TAI_CHINH: 'Tài chính',
  CONG_TAC_SINH_VIEN: 'Công tác sinh viên',
  CO_SO_VAT_CHAT: 'Cơ sở vật chất',
  CNTT: 'CNTT',
  KHAC: 'Khác',
};

export default function SupportPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', content: '', category: 'HOC_VU' });
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    api.get('/tickets').then((r) => setTickets(r.data)).catch(() => setTickets([]));
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/dang-nhap');
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/tickets', form);
      navigate(`/ho-tro/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Gửi yêu cầu thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <h1 className="page-title">Hỗ trợ</h1>
      <p className="page-subtitle">Gửi ticket trực tuyến và theo dõi phản hồi từ phòng ban.</p>
      <div className="grid grid-2">
        <div className="card">
          <div className="card-header">Yêu cầu hỗ trợ</div>
          <div className="card-body">
            {!user ? (
              <p>Vui lòng <Link to="/dang-nhap" style={{ color: 'var(--primary)', fontWeight: 600 }}>đăng nhập</Link> để gửi ticket.</p>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>}
                <div className="form-group"><label className="label">Tiêu đề</label><input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
                <div className="form-group">
                  <label className="label">Danh mục</label>
                  <select className="select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {Object.entries(ticketCats).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                  </select>
                </div>
                <div className="form-group"><label className="label">Nội dung</label><textarea className="textarea" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required /></div>
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Đang gửi...' : 'Gửi yêu cầu'}</button>
              </form>
            )}
          </div>
        </div>
        <div>
          <div className="card" style={{ marginBottom: '1rem' }}>
            <div className="card-header">Liên hệ</div>
            <div className="card-body">
              <p>Hotline: 024.3838.1234</p>
              <p>Email: ctsv@humg.edu.vn</p>
              <p>Giờ làm việc: 8:00 - 17:00 (T2-T6)</p>
            </div>
          </div>
          {tickets.length > 0 && (
            <div className="card">
              <div className="card-header">Ticket của bạn</div>
              <div className="card-body" style={{ display: 'grid', gap: '0.75rem' }}>
                {tickets.map((t) => (
                  <Link key={t.id} to={`/ho-tro/${t.id}`}>
                    <strong>{t.title}</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.code} · {CATEGORIES[t.category] || t.category} · {formatDate(t.createdAt)}</div>
                    <span className={`badge ${TICKET_STATUS[t.status]?.class}`}>{TICKET_STATUS[t.status]?.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

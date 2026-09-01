import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { STATUS_LABELS } from '../utils/constants';

export default function AccountPage() {
  const { user, logout, updateUser } = useAuth();
  const [apps, setApps] = useState([]);
  const [form, setForm] = useState({ phone: '', faculty: '', className: '', major: '' });
  const [saved, setSaved] = useState('');

  useEffect(() => {
    if (!user) return;
    // The profile form is an editable copy of the authenticated user record.
    // oxlint-disable-next-line react(set-state-in-effect)
    setForm({ phone: user.phone || '', faculty: user.faculty || '', className: user.className || '', major: user.major || '' });
    api.get('/applications').then((res) => setApps(res.data.slice(0, 3))).catch(() => setApps([]));
  }, [user]);

  if (!user) return <Navigate to="/dang-nhap" replace />;

  const save = async (e) => {
    e.preventDefault();
    const { data } = await api.put('/auth/profile', { fullName: user.fullName, ...form });
    updateUser(data);
    setSaved('Đã lưu thông tin');
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: 900 }}>
      <h1 className="page-title">Tài khoản của tôi</h1>
      <div className="grid grid-2">
        <div className="card">
          <div className="card-header">Thông tin cá nhân</div>
          <form className="card-body" onSubmit={save}>
            <p><strong>Họ tên:</strong> {user.fullName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>MSSV:</strong> {user.studentId || 'Chưa cập nhật'}</p>
            <div className="form-group"><label className="label">SĐT</label><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            <div className="form-group"><label className="label">Khoa</label><input className="input" value={form.faculty} onChange={(e) => setForm({ ...form, faculty: e.target.value })} /></div>
            <div className="form-group"><label className="label">Ngành</label><input className="input" value={form.major} onChange={(e) => setForm({ ...form, major: e.target.value })} /></div>
            <div className="form-group"><label className="label">Lớp</label><input className="input" value={form.className} onChange={(e) => setForm({ ...form, className: e.target.value })} /></div>
            {saved && <p style={{ color: 'var(--success)' }}>{saved}</p>}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-primary btn-sm" type="submit">Lưu</button>
              <button className="btn btn-danger btn-sm" type="button" onClick={logout}>Đăng xuất</button>
            </div>
          </form>
        </div>
        <div className="card">
          <div className="card-header">Hồ sơ gần đây</div>
          <div className="card-body">
            {apps.length === 0 ? <div className="empty-state">Chưa có hồ sơ nào.</div> : (
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {apps.map((app) => (
                  <Link key={app.id} to={`/ho-so/${app.id}`} style={{ display: 'block', padding: '.75rem 1rem', border: '1px solid var(--border)', borderRadius: 10 }}>
                    <strong>{app.service?.name}</strong>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{app.code}</div>
                    <span className={`badge ${STATUS_LABELS[app.status]?.class || 'badge-neutral'}`}>{STATUS_LABELS[app.status]?.label || app.status}</span>
                  </Link>
                ))}
                <Link to="/tai-khoan/ho-so" className="btn btn-outline btn-sm">Xem tất cả hồ sơ</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

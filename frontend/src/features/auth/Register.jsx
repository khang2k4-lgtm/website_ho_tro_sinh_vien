import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ email: '', password: '', fullName: '', studentId: '', faculty: '', major: '', className: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(form);
      navigate('/tai-khoan');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 520, padding: '3rem 1.5rem' }}>
      <div className="card">
        <div className="card-body">
          <h1 className="page-title" style={{ textAlign: 'center' }}>Đăng ký sinh viên</h1>
          {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.75rem', borderRadius: 8, marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label className="label">Họ tên *</label><input className="input" name="fullName" value={form.fullName} onChange={handleChange} required /></div>
            <div className="form-group"><label className="label">Email *</label><input className="input" type="email" name="email" value={form.email} onChange={handleChange} required /></div>
            <div className="form-group"><label className="label">Mật khẩu *</label><input className="input" type="password" name="password" value={form.password} onChange={handleChange} required minLength={6} /></div>
            <div className="form-group"><label className="label">MSSV</label><input className="input" name="studentId" value={form.studentId} onChange={handleChange} /></div>
            <div className="grid grid-2">
              <div className="form-group"><label className="label">Khoa</label><input className="input" name="faculty" value={form.faculty} onChange={handleChange} /></div>
              <div className="form-group"><label className="label">Lớp</label><input className="input" name="className" value={form.className} onChange={handleChange} /></div>
            </div>
            <div className="form-group"><label className="label">Ngành</label><input className="input" name="major" value={form.major} onChange={handleChange} /></div>
            <div className="form-group"><label className="label">SĐT</label><input className="input" name="phone" value={form.phone} onChange={handleChange} /></div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>{loading ? 'Đang xử lý...' : 'Đăng ký'}</button>
          </form>
          <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem' }}>Đã có tài khoản? <Link to="/dang-nhap" style={{ color: 'var(--primary)', fontWeight: 600 }}>Đăng nhập</Link></p>
        </div>
      </div>
    </div>
  );
}

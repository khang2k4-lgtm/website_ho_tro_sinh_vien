import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (['ADMIN', 'STAFF', 'STAFF_CARE', 'DEPT_MANAGER'].includes(user.role)) {
        navigate('/dashboard');
      } else {
        navigate('/tai-khoan');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 440, padding: '4rem 1.5rem' }}>
      <div className="card">
        <div className="card-body">
          <h1 className="page-title" style={{ textAlign: 'center' }}>Đăng nhập</h1>
          <p className="page-subtitle" style={{ textAlign: 'center' }}>Cổng dịch vụ sinh viên HUMG</p>

          {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.75rem', borderRadius: 8, marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label">Email</label>
              <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="sv001@humg.edu.vn" />
            </div>
            <div className="form-group">
              <label className="label">Mật khẩu</label>
              <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••" />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Chưa có tài khoản? <Link to="/dang-ky" style={{ color: 'var(--primary)', fontWeight: 600 }}>Đăng ký</Link>
          </p>

          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg)', borderRadius: 8, fontSize: '0.8125rem' }}>
            <strong>Demo:</strong><br />
            Sinh viên: sv001@humg.edu.vn / 123456<br />
            Admin: admin@humg.edu.vn / 123456
          </div>
        </div>
      </div>
    </div>
  );
}

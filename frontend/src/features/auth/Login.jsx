import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { STAFF_ROLES } from '../../utils/constants';
import { KeyRound } from 'lucide-react';

const demoAccounts = [
  { label: 'Sinh viên', email: 'sv001@humg.edu.vn', password: '123456' },
  { label: 'Nhân viên', email: 'nv.ctsv@humg.edu.vn', password: '123456' },
  { label: 'Quản lý phòng', email: 'ql.ctsv@humg.edu.vn', password: '123456' },
  { label: 'Admin', email: 'admin@humg.edu.vn', password: '123456' },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const fillDemoAccount = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (STAFF_ROLES.includes(user.role)) {
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
    <section className="auth-card auth-login-card">
      <div className="auth-heading">
        <h1>Đăng nhập</h1>
        <p>Nhập thông tin tài khoản sinh viên hoặc cán bộ.</p>
      </div>

      {error && <div className="auth-alert" role="alert">{error}</div>}

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="label" htmlFor="login-email">Email</label>
          <input id="login-email" className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="name@humg.edu.vn" autoComplete="email" />
        </div>
        <div className="form-group">
          <label className="label" htmlFor="login-password">Mật khẩu</label>
          <input id="login-password" className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Nhập mật khẩu" autoComplete="current-password" />
        </div>
        <button type="submit" className="btn auth-submit" disabled={loading}>
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>

      <p className="auth-switch">
        Chưa có tài khoản? <Link to="/dang-ky">Đăng ký</Link>
      </p>

      <details className="auth-demo">
        <summary><KeyRound size={16} /> Tài khoản trải nghiệm</summary>
        <div className="auth-demo-list">
          {demoAccounts.map((account) => (
            <div className="auth-demo-account" key={account.email}>
              <div className="auth-demo-info">
                <strong>{account.label}</strong>
                <span>{account.email}</span>
              </div>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => fillDemoAccount(account)}>
                Chọn
              </button>
            </div>
          ))}
        </div>
      </details>
    </section>
  );
}

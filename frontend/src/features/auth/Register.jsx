import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserPlus } from 'lucide-react';

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
    <section className="auth-card auth-register-card">
      <div className="auth-heading">
        <h1>Tạo tài khoản</h1>
        <p>Điền thông tin để đăng ký cổng dịch vụ sinh viên.</p>
      </div>
      {error && <div className="auth-alert" role="alert">{error}</div>}
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="register-fields">
          <div className="form-group full-width">
            <label className="label" htmlFor="register-full-name">Họ và tên <span aria-hidden="true">*</span></label>
            <input id="register-full-name" className="input" name="fullName" value={form.fullName} onChange={handleChange} required autoComplete="name" />
          </div>
          <div className="form-group">
            <label className="label" htmlFor="register-email">Email <span aria-hidden="true">*</span></label>
            <input id="register-email" className="input" type="email" name="email" value={form.email} onChange={handleChange} required autoComplete="email" />
          </div>
          <div className="form-group">
            <label className="label" htmlFor="register-password">Mật khẩu <span aria-hidden="true">*</span></label>
            <input id="register-password" className="input" type="password" name="password" value={form.password} onChange={handleChange} required minLength={6} autoComplete="new-password" />
          </div>
          <div className="form-group">
            <label className="label" htmlFor="register-student-id">Mã số sinh viên</label>
            <input id="register-student-id" className="input" name="studentId" value={form.studentId} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="label" htmlFor="register-phone">Số điện thoại</label>
            <input id="register-phone" className="input" type="tel" name="phone" value={form.phone} onChange={handleChange} autoComplete="tel" />
          </div>
          <div className="form-group">
            <label className="label" htmlFor="register-faculty">Khoa</label>
            <input id="register-faculty" className="input" name="faculty" value={form.faculty} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="label" htmlFor="register-major">Ngành</label>
            <input id="register-major" className="input" name="major" value={form.major} onChange={handleChange} />
          </div>
          <div className="form-group full-width">
            <label className="label" htmlFor="register-class">Lớp</label>
            <input id="register-class" className="input" name="className" value={form.className} onChange={handleChange} autoComplete="organization-title" />
          </div>
        </div>
        <p className="auth-form-note"><span aria-hidden="true">*</span> Thông tin bắt buộc</p>
        <button type="submit" className="btn auth-submit" disabled={loading}>
          <UserPlus size={18} />{loading ? 'Đang xử lý...' : 'Tạo tài khoản'}
        </button>
      </form>
      <p className="auth-switch">Đã có tài khoản? <Link to="/dang-nhap">Đăng nhập</Link></p>
    </section>
  );
}

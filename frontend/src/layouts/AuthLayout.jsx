import { Link, Outlet } from 'react-router-dom';
import logo from '../assets/logomdc.png';
import '../features/auth/Auth.css';

export default function AuthLayout() {
  return (
    <main className="auth-page">
      <div className="auth-page-content">
        <Link className="auth-brand" to="/" aria-label="Về trang chủ HUMG">
          <span className="auth-brand-mark">
            <img src={logo} alt="" />
          </span>
          <span>
            <strong>HUMG</strong>
            <small>Cổng dịch vụ sinh viên</small>
          </span>
        </Link>
        <Outlet />
        <p className="auth-page-caption">Cổng dịch vụ sinh viên · Trường Đại học Mỏ - Địa chất</p>
      </div>
    </main>
  );
}

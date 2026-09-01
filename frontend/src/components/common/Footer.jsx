import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <h3>HUMG Portal</h3>
          <p>Cổng dịch vụ và hỗ trợ sinh viên Trường Đại học Mỏ - Địa chất</p>
        </div>
        <div>
          <h4>Liên kết</h4>
          <Link to="/dich-vu">Dịch vụ sinh viên</Link>
          <Link to="/phong-ban">Phòng ban</Link>
          <Link to="/ho-tro">Hỗ trợ</Link>
          <Link to="/faq">FAQ</Link>
        </div>
        <div>
          <h4>Hỗ trợ</h4>
          <Link to="/tra-cuu">Tra cứu thủ tục</Link>
          <Link to="/hoi-dap">Hỏi đáp</Link>
          <Link to="/bando">Bản đồ trường</Link>
        </div>
        <div>
          <h4>Liên hệ</h4>
          <p>📍Số 18 Phố Viên, Hà Nội</p>
          <p>📞 024.3838.1234</p>
          <p>📧 ctsv@humg.edu.vn</p>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          © 2026 Trường ĐH Mỏ - Địa chất. Đồ án Frontend.
        </div>
      </div>
    </footer>
  );
}

import { Link } from 'react-router-dom';
import './Footer.css';
import { Mail, MapPin, Phone } from 'lucide-react';

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
          <p><MapPin size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />Số 18 Phố Viên, Hà Nội</p>
          <p><Phone size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />024.3838.1234</p>
          <p><Mail size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />ctsv@humg.edu.vn</p>
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

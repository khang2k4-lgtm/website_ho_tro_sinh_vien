import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, X, User, LogOut, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import logo from '../../assets/logomdc.png';
import './Header.css';
import { STAFF_ROLES } from '../../utils/constants';


export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [notifCount, setNotifCount] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const isStaffArea = user && STAFF_ROLES.includes(user.role);

  useEffect(() => {
    if (user) {
      api.get('/notifications/unread-count')
        .then((r) => setNotifCount(r.data.count))
        .catch(() => { });
    }
  }, [user]);

  const navLinks = [
    { to: '/', label: 'Trang chủ' },
    { to: '/dich-vu', label: 'Dịch vụ sinh viên' },
    { to: '/phong-ban', label: 'Phòng ban' },
    { to: '/faq', label: 'FAQ' },
    { to: '/hoi-dap', label: 'Hỏi đáp' },
    { to: '/thong-bao', label: 'Thông báo' },
    { to: '/ho-tro', label: 'Hỗ trợ' },
    { to: '/bando', label: 'Bản đồ' },
    { to: '/tra-cuu', label: 'Tra cứu' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/tim-kiem?q=${encodeURIComponent(query)}`);
    setSearchOpen(false);
  };

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo">
          <div className="logo-icon">
            <img src={logo} alt="Logo HUMG" />
          </div>
          <div>
            <span className="logo-title">HUMG Portal</span>
            <span className="logo-sub">Cổng dịch vụ sinh viên</span>
          </div>
        </Link>

        {!isStaffArea && <nav className={`nav ${menuOpen ? 'open' : ''}`}>
          {navLinks.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={() => setMenuOpen(false)}>
              {l.label}
            </NavLink>
          ))}
        </nav>}

        <div className="header-actions">
          <button className="icon-btn" onClick={() => setSearchOpen(!searchOpen)} aria-label="Tìm kiếm" aria-expanded={searchOpen}>
            <Search size={20} />
          </button>

          {user ? (
            <>
              <Link to="/thong-bao-ca-nhan" className="icon-btn notif-btn" aria-label={`Thông báo${notifCount > 0 ? `, ${notifCount} chưa đọc` : ''}`}>
                <Bell size={20} />
                {notifCount > 0 && <span className="notif-badge">{notifCount}</span>}
              </Link>
              <div className="user-menu-wrap">
                <button className="avatar-btn" onClick={() => setShowUserMenu(!showUserMenu)} aria-label="Mở menu tài khoản" aria-expanded={showUserMenu}>
                  <div className="avatar">{user.fullName?.charAt(0)}</div>
                </button>
                {showUserMenu && (
                  <div className="user-dropdown">
                    <div className="user-info">
                      <strong>{user.fullName}</strong>
                      <small>{user.email}</small>
                    </div>
                    <Link to="/tai-khoan" onClick={() => setShowUserMenu(false)}><User size={16} /> Tài khoản</Link>
                    {STAFF_ROLES.includes(user.role) && (
                      <Link to="/dashboard" onClick={() => setShowUserMenu(false)}>Dashboard</Link>
                    )}
                    <button onClick={() => { logout(); navigate('/'); setShowUserMenu(false); }}>
                      <LogOut size={16} /> Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="auth-btns">
              <Link to="/ho-tro" className="header-help-link">Cần hỗ trợ? <ArrowRight size={14} /></Link>
              <Link to="/dang-nhap" className="btn btn-outline btn-sm">Đăng nhập</Link>
              <Link to="/dang-ky" className="btn btn-primary btn-sm">Đăng ký</Link>
            </div>
          )}

          {!isStaffArea && <button className="icon-btn mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'} aria-expanded={menuOpen}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>}
        </div>
      </div>

      {searchOpen && (
        <div className="search-bar">
          <div className="container">
            <form onSubmit={handleSearch}>
              <Search size={20} />
              <input
                className="input"
                placeholder="Tìm kiếm dịch vụ, thủ tục, phòng ban..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
            </form>
          </div>
        </div>
      )}
    </header>
  );
}

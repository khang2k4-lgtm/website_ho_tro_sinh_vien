import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, FileText, Ticket, Users, Building2, Settings, ScrollText, BarChart3, UserCog, ClipboardList } from 'lucide-react';
import Header from '../components/common/Header';
import { useAuth } from '../context/AuthContext';
import './DashboardLayout.css';
import { ROLE_LABELS } from '../utils/constants';

export default function DashboardLayout() {
  const { user } = useAuth();

  const links = user?.role === 'ADMIN' ? [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/dashboard/nguoi-dung', label: 'Quản lý người dùng', icon: Users },
    { to: '/dashboard/phong-ban', label: 'Quản lý phòng ban', icon: Building2 },
    { to: '/dashboard/dich-vu', label: 'Quản lý dịch vụ', icon: Settings },
    { to: '/dashboard/ho-so', label: 'Quản lý yêu cầu', icon: FileText },
    { to: '/dashboard/bao-cao', label: 'Báo cáo - thống kê', icon: BarChart3 },
    { to: '/dashboard/audit', label: 'Nhật ký hệ thống', icon: ScrollText },
  ] : user?.role === 'DEPT_MANAGER' ? [
    { to: '/dashboard', label: 'Tổng quan phòng ban', icon: LayoutDashboard },
    { to: '/dashboard/ho-so', label: 'Quản lý yêu cầu', icon: ClipboardList },
    { to: '/dashboard/tickets', label: 'Hỗ trợ sinh viên', icon: Ticket },
    { to: '/dashboard/dich-vu', label: 'Dịch vụ phòng ban', icon: Settings },
    { to: '/dashboard/bao-cao', label: 'Báo cáo phòng ban', icon: BarChart3 },
  ] : [
    { to: '/dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { to: '/dashboard/ho-so', label: 'Yêu cầu cần xử lý', icon: FileText },
    { to: '/dashboard/tickets', label: 'Phản hồi hỗ trợ', icon: Ticket },
  ];

  return (
    <div className="dashboard-layout">
      <Header />
      <div className="dashboard-body">
        <aside className="dashboard-sidebar">
          <div className="sidebar-title">{ROLE_LABELS[user?.role] || 'Khu vực nghiệp vụ'}</div>
          <nav>
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} end={to === '/dashboard'} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <Icon size={18} /> {label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

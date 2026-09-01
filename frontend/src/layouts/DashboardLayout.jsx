import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, FileText, Ticket, Users, Building2, Settings, ScrollText, BarChart3 } from 'lucide-react';
import Header from '../components/common/Header';
import { useAuth } from '../context/AuthContext';
import './DashboardLayout.css';

export default function DashboardLayout() {
  const { user } = useAuth();

  const links = [
    { to: '/dashboard', label: 'Tổng quan', icon: LayoutDashboard, roles: ['ADMIN', 'STAFF', 'STAFF_CARE', 'DEPT_MANAGER'] },
    { to: '/dashboard/ho-so', label: 'Quản lý hồ sơ', icon: FileText, roles: ['ADMIN', 'STAFF', 'STAFF_CARE', 'DEPT_MANAGER'] },
    { to: '/dashboard/tickets', label: 'Ticket hỗ trợ', icon: Ticket, roles: ['ADMIN', 'STAFF', 'STAFF_CARE', 'DEPT_MANAGER'] },
    { to: '/dashboard/phong-ban', label: 'Phòng ban', icon: Building2, roles: ['ADMIN'] },
    { to: '/dashboard/dich-vu', label: 'Dịch vụ', icon: Settings, roles: ['ADMIN', 'DEPT_MANAGER'] },
    { to: '/dashboard/nguoi-dung', label: 'Người dùng', icon: Users, roles: ['ADMIN'] },
    { to: '/dashboard/audit', label: 'Audit Log', icon: ScrollText, roles: ['ADMIN'] },
    { to: '/dashboard/bao-cao', label: 'Báo cáo', icon: BarChart3, roles: ['ADMIN', 'STAFF_CARE'] },
  ];

  const visibleLinks = links.filter((l) => l.roles.includes(user?.role));

  return (
    <div className="dashboard-layout">
      <Header />
      <div className="dashboard-body">
        <aside className="dashboard-sidebar">
          <div className="sidebar-title">Quản trị</div>
          <nav>
            {visibleLinks.map(({ to, label, icon: Icon }) => (
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

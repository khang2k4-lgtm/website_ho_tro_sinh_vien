import { NavLink, Outlet } from 'react-router-dom';
import { BarChart3, BookOpenText, Building2, CalendarDays, ClipboardList, FileText, Gauge, Inbox, LayoutDashboard, ListChecks, MessageSquareText, Printer, Rocket, ScrollText, Search, Settings, ShieldCheck, Ticket, UserCheck, UserCog, UserPlus, Users, WalletCards } from 'lucide-react';
import Header from '../components/common/Header';
import { useAuth } from '../context/AuthContext';
import './DashboardLayout.css';
import { ROLE_LABELS } from '../utils/constants';

export default function DashboardLayout() {
  const { user } = useAuth();

  const staffGroups = [
    {
      title: 'TỔNG QUAN & LỊCH TRỰC',
      links: [
        { to: '/dashboard', label: 'Bảng điều khiển cá nhân', icon: LayoutDashboard },
        { to: '/dashboard/tong-quan', label: 'Dashboard cá nhân', icon: Gauge },
        { to: '/dashboard/lich-truc', label: 'Lịch trực quầy & Hẹn gặp', icon: CalendarDays },
      ],
    },
    {
      title: 'QUẢN LÝ HỒ SƠ & THỦ TỤC',
      links: [
        { to: '/dashboard/ho-so-cho-tiep-nhan', label: 'Hồ sơ chờ tiếp nhận', icon: Inbox },
        { to: '/dashboard/ho-so-dang-xu-ly', label: 'Hồ sơ đang xử lý', icon: ClipboardList },
        { to: '/dashboard/ho-so-cho-sv-bo-sung', label: 'Hồ sơ chờ SV bổ sung', icon: FileText },
        { to: '/dashboard/kho-ho-so', label: 'Kho lưu trữ & Lịch sử duyệt', icon: ScrollText },
      ],
    },
    {
      title: 'HỖ TRỢ & TƯ VẤN SINH VIÊN',
      links: [
        { to: '/dashboard/ticket-ho-tro', label: 'Ticket hỗ trợ', icon: Ticket },
        { to: '/dashboard/chat-sinh-vien', label: 'Chat trực tiếp với Sinh viên', icon: MessageSquareText },
      ],
    },
    {
      title: 'NGHIỆP VỤ & IN ẤN / KÝ SỐ',
      links: [
        { to: '/dashboard/in-an', label: 'In ấn & Xuất bản phôi', icon: Printer },
        { to: '/dashboard/ky-so', label: 'Duyệt & Ký số tập trung', icon: ShieldCheck },
        { to: '/dashboard/le-phi', label: 'Quản lý Lệ phí & Biên lai', icon: WalletCards },
      ],
    },
    {
      title: 'CƠ SỞ DỮ LIỆU & TRA CỨU',
      links: [
        { to: '/dashboard/tra-cuu-sinh-vien', label: 'Tra cứu hồ sơ Sinh viên', icon: Search },
        { to: '/dashboard/cam-nang', label: 'Cẩm nang & Quy trình nghiệp vụ', icon: BookOpenText },
      ],
    },
    {
      title: 'BÁO CÁO & HIỆU SUẤT',
      links: [
        { to: '/dashboard/bao-cao-kpi', label: 'Báo cáo KPI cá nhân', icon: BarChart3 },
      ],
    },
    {
      title: 'CÀI ĐẶT TÀI KHOẢN',
      links: [
        { to: '/dashboard/cai-dat', label: 'Thiết lập cá nhân & Ủy quyền', icon: UserCog },
      ],
    },
  ];

  const deptGroups = [
    {
      title: 'TỔNG QUAN PHÒNG BAN',
      links: [
        { to: '/dashboard', label: 'Dashboard phòng ban', icon: LayoutDashboard },
        //{ to: '/admin/dept/task-allocation', label: 'Phân bổ công vi', icon: ListChecks },
        //{ to: '/admin/dept/progress-monitor', label: 'Kiểm tra tiến độ', icon: Gauge },
        //{ to: '/admin/dept/weekly-summary', label: 'Kết quả tuần', icon: BarChart3 },
        { to: '/dashboard/ho-so-dang-xu-ly', label: 'Hồ sơ đang xử lý', icon: ClipboardList },
        { to: '/dashboard/ticket-ho-tro', label: 'Ticket hỗ trợ sinh viên', icon: Ticket },
        { to: '/dashboard/ho-so-cho-tiep-nhan', label: 'Hồ sơ chờ tiếp nhận', icon: Inbox },
      ],
    },
    {
      title: 'NGHIỆP VỤ PHÒNG BAN',
      links: [
        { to: '/dashboard/ho-so-cho-sv-bo-sung', label: 'Yêu cầu cần bổ sung', icon: FileText },
        { to: '/dashboard/tra-cuu-sinh-vien', label: 'Tra cứu hồ sơ sinh viên', icon: Search },
        { to: '/dashboard/cam-nang', label: 'Quy trình & quy định', icon: BookOpenText },
      ],
    },
    {
      title: 'BÁO CÁO & KẾ HOẠCH',
      links: [
        //{ to: '/admin/dept/dispatch-board', label: 'Ban điều phối', icon: Building2 },
        //{ to: '/admin/dept/team-leader-tasks', label: 'Nhiệm vụ trưởng nhóm', icon: Users },
        //{ to: '/admin/dept/head-report', label: 'Báo cáo trưởng phòng', icon: FileText },
        { to: '/dashboard/bao-cao-kpi', label: 'KPI cá nhân & phòng ban', icon: BarChart3 },
        { to: '/dashboard/cai-dat', label: 'Cài đặt nhân sự & ủy quyền', icon: UserCog },
      ],
    },
  ];

  const adminGroups = [
    {
      title: 'TỔNG QUAN HỆ THỐNG',
      links: [
        { to: '/admin/system/overview', label: 'Tổng quan hệ thống', icon: LayoutDashboard },
        { to: '/admin/users/pending', label: 'Người dùng mới', icon: UserCheck },
        { to: '/dashboard/nguoi-dung', label: 'Quản lý người dùng', icon: Users },
        { to: '/admin/users/create', label: 'Tạo tài khoản', icon: UserPlus },
        { to: '/dashboard/phong-ban', label: 'Quản lý phòng ban', icon: Building2 },
        { to: '/dashboard/dich-vu', label: 'Quản lý dịch vụ', icon: Settings },
      ],
    },
    {
      title: 'VẬN HÀNH & KIỂM SOÁT',
      links: [
        { to: '/dashboard/bao-cao', label: 'Báo cáo - thống kê', icon: BarChart3 },
        { to: '/admin/system/audit-logs', label: 'Nhật ký hệ thống', icon: ScrollText },
        { to: '/dashboard/tra-cuu-sinh-vien', label: 'Tra cứu dữ liệu sinh viên', icon: Search },
      ],
    },
    {
      title: 'CẤU HÌNH HỆ THỐNG',
      links: [
        { to: '/admin/security/settings', label: 'Bảo mật', icon: ShieldCheck },
        { to: '/admin/security/roles', label: 'Phân quyền', icon: UserCog },
        { to: '/admin/system/updates', label: 'Cập nhật hệ thống', icon: Rocket },
        { to: '/dashboard/cai-dat', label: 'Cài đặt tài khoản & ủy quyền', icon: UserCog },
        { to: '/dashboard/ticket-ho-tro', label: 'Ticket hỗ trợ toàn hệ thống', icon: Ticket },
      ],
    },
  ];

  const visibleGroups = user?.role === 'ADMIN'
    ? adminGroups
    : user?.role === 'DEPT_MANAGER'
      ? deptGroups
      : staffGroups;

  return (
    <div className="dashboard-layout">
      <Header />
      <div className="dashboard-body">
        <aside className="dashboard-sidebar">
          <div className="sidebar-title">{ROLE_LABELS[user?.role] || 'Khu vực nghiệp vụ'}</div>
          <nav className="dashboard-sidebar-nav">
            {visibleGroups.map((group) => (
              <div key={group.title} className="sidebar-group">
                <div className="sidebar-group-title">{group.title}</div>
                {group.links.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === '/dashboard'}
                    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={18} /> {label}
                  </NavLink>
                ))}
              </div>
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

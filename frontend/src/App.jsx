import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import Home from './pages/Home';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import ServiceList from './features/services/ServiceList';
import ServiceDetail from './features/services/ServiceDetail';
import DepartmentList from './features/departments/DepartmentList';
import DepartmentDetail from './features/departments/DepartmentDetail';
import ApplicationForm from './features/applications/ApplicationForm';
import ApplicationDetail from './features/applications/ApplicationDetail';
import AnnouncementList from './pages/AnnouncementList';
import AnnouncementDetail from './pages/AnnouncementDetail';
import SupportPage from './pages/SupportPage';
import TicketDetail from './pages/TicketDetail';
import MapPage from './pages/MapPage';
import SearchPage from './pages/SearchPage';
import FaqPage from './pages/FaqPage';
import QnAPage from './pages/QnAPage';
import QuestionDetail from './pages/QuestionDetail';
import AccountPage from './pages/AccountPage';
import MyApplications from './pages/MyApplications';
import NotificationPage from './pages/NotificationPage';
import NotFound from './pages/NotFound';
import DashboardOverview from './features/dashboard/DashboardOverview';
import ManageApplications from './features/dashboard/ManageApplications';
import CreateUserPage from './features/dashboard/CreateUserPage';
import ManageTickets from './features/dashboard/ManageTickets';
import ManageDepartments from './features/dashboard/ManageDepartments';
import ManageServices from './features/dashboard/ManageServices';
import ManageUsers from './features/dashboard/ManageUsers';
import AuditLogs from './features/dashboard/AuditLogs';
import Reports from './features/dashboard/Reports';
import DepartmentActivityPage from './features/dashboard/DepartmentActivityPage';
import ApplicationProgressPage from './features/dashboard/ApplicationProgressPage';
import StaffScheduleDetailPage from './features/dashboard/StaffScheduleDetailPage';
import IntakeReviewPage from './features/dashboard/IntakeReviewPage';
import ReminderListPage from './features/dashboard/ReminderListPage';
import StudentLookupPage from './features/dashboard/StudentLookupPage';
import KnowledgeBaseDetailPage from './features/dashboard/KnowledgeBaseDetailPage';
import DepartmentKpiReportPage from './features/dashboard/DepartmentKpiReportPage';
import AccountDelegationPage from './features/dashboard/AccountDelegationPage';
import ArchiveSearchPage from './features/dashboard/ArchiveSearchPage';
import LiveChatWorkspacePage from './features/dashboard/LiveChatWorkspacePage';
import StudentLiveChatPage from './pages/StudentLiveChatPage';
import FeeReceiptManagementPage from './features/dashboard/FeeReceiptManagementPage';
import PrintWorkflowPage from './features/dashboard/PrintWorkflowPage';
import DigitalSigningWorkflowPage from './features/dashboard/DigitalSigningWorkflowPage';
import {
  AdminOverviewPage,
  PendingUsersPage,
  SecuritySettingsPage,
  RoleManagementPage,
  SystemUpdatesPage,
} from './features/dashboard/AdminSystemPages';
import {
  TaskAllocationPage,
  ProgressMonitorPage,
  WeeklySummaryPage,
  DispatchBoardPage,
  TeamLeaderTasksPage,
  DepartmentHeadReportPage,
} from './features/dashboard/AdminDeptPages';
import {
  OverviewAndSchedulePage,
  DepartmentManagerOverviewPage,
  CounterAndAppointmentPage,
  IntakeInboxPage,
  InProgressPage,
  PendingResubmissionPage,
  SupportTicketPage,
  LiveChatPage,
  PrintAndCardPage,
  ESignaturePage,
  FeeAndReceiptPage,
  StudentDirectoryPage,
  KnowledgeBasePage,
  PerformanceReportPage,
  AccountSettingsPage,
  RoleDetailPage,
} from './features/dashboard/StaffPortalPages';
import { STAFF_ROLES } from './utils/constants';
import { useAuth } from './context/AuthContext';

function DashboardHome() {
  const { user } = useAuth();

  if (user?.role === 'ADMIN') return <AdminOverviewPage />;
  if (user?.role === 'DEPT_MANAGER') return <DepartmentManagerOverviewPage />;
  return <DashboardOverview />;
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/dang-nhap" element={<Login />} />
          <Route path="/dang-ky" element={<Register />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/dich-vu" element={<ServiceList />} />
          <Route path="/dich-vu/:slug" element={<ServiceDetail />} />
          <Route path="/nop-ho-so/:slug" element={<ProtectedRoute><ApplicationForm /></ProtectedRoute>} />
          <Route path="/phong-ban" element={<DepartmentList />} />
          <Route path="/phong-ban/:slug" element={<DepartmentDetail />} />
          <Route path="/thong-bao" element={<AnnouncementList />} />
          <Route path="/thong-bao/:id" element={<AnnouncementDetail />} />
          <Route path="/ho-tro" element={<SupportPage />} />
          <Route path="/ho-tro/:id" element={<ProtectedRoute><TicketDetail /></ProtectedRoute>} />
          <Route path="/chat-truc-tiep" element={<ProtectedRoute roles={['STUDENT']}><StudentLiveChatPage /></ProtectedRoute>} />
          <Route path="/bando" element={<MapPage />} />
          <Route path="/tra-cuu" element={<SearchPage />} />
          <Route path="/tim-kiem" element={<SearchPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/hoi-dap" element={<QnAPage />} />
          <Route path="/hoi-dap/:id" element={<QuestionDetail />} />
          <Route path="/tai-khoan" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
          <Route path="/tai-khoan/ho-so" element={<ProtectedRoute><MyApplications /></ProtectedRoute>} />
          <Route path="/ho-so/:id" element={<ProtectedRoute><ApplicationDetail /></ProtectedRoute>} />
          <Route path="/thong-bao-ca-nhan" element={<ProtectedRoute><NotificationPage /></ProtectedRoute>} />
        </Route>
        <Route element={<ProtectedRoute roles={STAFF_ROLES}><DashboardLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/dashboard/tong-quan" element={<OverviewAndSchedulePage />} />
          <Route path="/dashboard/lich-truc" element={<CounterAndAppointmentPage />} />
          <Route path="/dashboard/lich-truc/chi-tiet" element={<ProtectedRoute roles={['STAFF']}><StaffScheduleDetailPage /></ProtectedRoute>} />
          <Route path="/dashboard/ho-so-cho-tiep-nhan" element={<IntakeInboxPage />} />
          <Route path="/dashboard/ho-so-cho-tiep-nhan/tiep-nhan/:index" element={<ProtectedRoute roles={['STAFF']}><IntakeReviewPage /></ProtectedRoute>} />
          <Route path="/dashboard/ho-so-dang-xu-ly" element={<InProgressPage />} />
          <Route path="/dashboard/ho-so-dang-xu-ly/tien-do" element={<ProtectedRoute roles={['STAFF', 'DEPT_MANAGER']}><ApplicationProgressPage /></ProtectedRoute>} />
          <Route path="/dashboard/ho-so-cho-sv-bo-sung" element={<PendingResubmissionPage />} />
          <Route path="/dashboard/ho-so-cho-sv-bo-sung/danh-sach-can-nhac" element={<ReminderListPage />} />
          <Route path="/dashboard/kho-ho-so" element={<ArchiveSearchPage />} />
          <Route path="/dashboard/kho-ho-so/tra-cuu" element={<ArchiveSearchPage />} />
          <Route path="/dashboard/ticket-ho-tro" element={<SupportTicketPage />} />
          <Route path="/dashboard/chat-sinh-vien" element={<LiveChatPage />} />
          <Route path="/dashboard/chat-sinh-vien/truc-tiep" element={<LiveChatWorkspacePage />} />
          <Route path="/dashboard/in-an" element={<PrintAndCardPage />} />
          <Route path="/dashboard/in-an/quy-trinh" element={<PrintWorkflowPage />} />
          <Route path="/dashboard/ky-so" element={<ESignaturePage />} />
          <Route path="/dashboard/ky-so/quy-trinh" element={<DigitalSigningWorkflowPage />} />
          <Route path="/dashboard/le-phi" element={<FeeAndReceiptPage />} />
          <Route path="/dashboard/le-phi/du-lieu" element={<FeeReceiptManagementPage />} />
          <Route path="/dashboard/tra-cuu-sinh-vien" element={<StudentDirectoryPage />} />
          <Route path="/dashboard/tra-cuu-sinh-vien/tra-cuu" element={<StudentLookupPage />} />
          <Route path="/dashboard/cam-nang" element={<KnowledgeBasePage />} />
          <Route path="/dashboard/cam-nang/chi-tiet" element={<KnowledgeBaseDetailPage />} />
          <Route path="/dashboard/bao-cao-kpi" element={<PerformanceReportPage />} />
          <Route path="/dashboard/bao-cao-kpi/chi-tiet" element={<DepartmentKpiReportPage />} />
          <Route path="/dashboard/cai-dat" element={<AccountSettingsPage />} />
          <Route path="/dashboard/cai-dat/chi-tiet" element={<AccountDelegationPage />} />
          <Route path="/dashboard/ho-so" element={<ManageApplications />} />
          <Route path="/dashboard/chi-tiet/:category/:slug" element={<RoleDetailPage />} />
          <Route path="/dashboard/ho-so/:id" element={<ApplicationDetail />} />
          <Route path="/dashboard/tickets" element={<ManageTickets />} />
          <Route path="/dashboard/phong-ban" element={<ManageDepartments />} />
          <Route path="/dashboard/phong-ban/hoat-dong" element={<ProtectedRoute roles={['DEPT_MANAGER']}><DepartmentActivityPage /></ProtectedRoute>} />
          <Route path="/dashboard/dich-vu" element={<ManageServices />} />
          <Route path="/dashboard/nguoi-dung" element={<ManageUsers />} />
          <Route path="/dashboard/audit" element={<AuditLogs />} />
          <Route path="/dashboard/bao-cao" element={<Reports />} />
          <Route path="/admin/system/overview" element={<ProtectedRoute roles={['ADMIN']}><AdminOverviewPage /></ProtectedRoute>} />
          <Route path="/admin/users/pending" element={<ProtectedRoute roles={['ADMIN']}><PendingUsersPage /></ProtectedRoute>} />
          <Route path="/admin/users/create" element={<ProtectedRoute roles={['ADMIN']}><CreateUserPage /></ProtectedRoute>} />
          <Route path="/admin/system/audit-logs" element={<ProtectedRoute roles={['ADMIN']}><AuditLogs /></ProtectedRoute>} />
          <Route path="/admin/security/settings" element={<ProtectedRoute roles={['ADMIN']}><SecuritySettingsPage /></ProtectedRoute>} />
          <Route path="/admin/security/roles" element={<ProtectedRoute roles={['ADMIN']}><RoleManagementPage /></ProtectedRoute>} />
          <Route path="/admin/system/updates" element={<ProtectedRoute roles={['ADMIN']}><SystemUpdatesPage /></ProtectedRoute>} />
          <Route path="/admin/dept/task-allocation" element={<ProtectedRoute roles={['DEPT_MANAGER']}><TaskAllocationPage /></ProtectedRoute>} />
          <Route path="/admin/dept/progress-monitor" element={<ProtectedRoute roles={['DEPT_MANAGER']}><ProgressMonitorPage /></ProtectedRoute>} />
          <Route path="/admin/dept/weekly-summary" element={<ProtectedRoute roles={['DEPT_MANAGER']}><WeeklySummaryPage /></ProtectedRoute>} />
          <Route path="/admin/dept/dispatch-board" element={<ProtectedRoute roles={['DEPT_MANAGER']}><DispatchBoardPage /></ProtectedRoute>} />
          <Route path="/admin/dept/team-leader-tasks" element={<ProtectedRoute roles={['DEPT_MANAGER']}><TeamLeaderTasksPage /></ProtectedRoute>} />
          <Route path="/admin/dept/head-report" element={<ProtectedRoute roles={['DEPT_MANAGER']}><DepartmentHeadReportPage /></ProtectedRoute>} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

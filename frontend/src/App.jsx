import { BrowserRouter, Route, Routes } from 'react-router-dom';
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
import ManageTickets from './features/dashboard/ManageTickets';
import ManageDepartments from './features/dashboard/ManageDepartments';
import ManageServices from './features/dashboard/ManageServices';
import ManageUsers from './features/dashboard/ManageUsers';
import AuditLogs from './features/dashboard/AuditLogs';
import Reports from './features/dashboard/Reports';

const staffRoles = ['ADMIN', 'STAFF', 'STAFF_CARE', 'DEPT_MANAGER'];

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/dang-nhap" element={<Login />} />
          <Route path="/dang-ky" element={<Register />} />
          <Route path="/dich-vu" element={<ServiceList />} />
          <Route path="/dich-vu/:slug" element={<ServiceDetail />} />
          <Route path="/nop-ho-so/:slug" element={<ProtectedRoute><ApplicationForm /></ProtectedRoute>} />
          <Route path="/phong-ban" element={<DepartmentList />} />
          <Route path="/phong-ban/:slug" element={<DepartmentDetail />} />
          <Route path="/thong-bao" element={<AnnouncementList />} />
          <Route path="/thong-bao/:id" element={<AnnouncementDetail />} />
          <Route path="/ho-tro" element={<SupportPage />} />
          <Route path="/ho-tro/:id" element={<ProtectedRoute><TicketDetail /></ProtectedRoute>} />
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

        <Route element={<ProtectedRoute roles={staffRoles}><DashboardLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<DashboardOverview />} />
          <Route path="/dashboard/ho-so" element={<ManageApplications />} />
          <Route path="/dashboard/tickets" element={<ManageTickets />} />
          <Route path="/dashboard/phong-ban" element={<ManageDepartments />} />
          <Route path="/dashboard/dich-vu" element={<ManageServices />} />
          <Route path="/dashboard/nguoi-dung" element={<ManageUsers />} />
          <Route path="/dashboard/audit" element={<AuditLogs />} />
          <Route path="/dashboard/bao-cao" element={<Reports />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { ROLE_DESCRIPTIONS } from '../../utils/constants';
import './CreateUserPage.css';

const DEFAULT_FORM = {
  fullName: '',
  email: '',
  password: '',
  role: 'STUDENT',
  studentId: '',
  departmentId: '',
};

const ACCOUNT_ROLES = [
  ['STUDENT', 'Sinh viên'],
  ['STAFF', 'Nhân viên'],
  ['DEPT_MANAGER', 'Quản lý phòng ban'],
];

export default function CreateUserPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [departments, setDepartments] = useState([]);
  const [departmentError, setDepartmentError] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const needsDepartment = form.role !== 'STUDENT';

  useEffect(() => {
    if (!needsDepartment) return;

    let active = true;
    api.get('/departments')
      .then(({ data }) => {
        if (active) {
          setDepartments(data);
          setDepartmentError('');
        }
      })
      .catch((err) => {
        if (active) {
          setDepartmentError(err.response?.data?.message || 'Không thể tải danh sách phòng ban.');
        }
      });

    return () => {
      active = false;
    };
  }, [needsDepartment]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    const payload = {
      fullName: form.fullName.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      role: form.role,
      ...(form.role === 'STUDENT' && form.studentId.trim() ? { studentId: form.studentId.trim() } : {}),
      ...(needsDepartment ? { departmentId: form.departmentId } : {}),
    };

    try {
      await api.post('/admin/users', payload);
      setForm(DEFAULT_FORM);
      setSuccess('Đã tạo tài khoản. Tài khoản mới có thể đăng nhập bằng email và mật khẩu vừa thiết lập.');
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tạo tài khoản. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="dashboard-page admin-system-page create-user-page">
      <header className="admin-page-header">
        <div>
          <span className="dashboard-kicker">QUẢN TRỊ HỆ THỐNG</span>
          <h1 className="page-title">Tạo tài khoản</h1>
          <p className="page-subtitle">Tạo tài khoản mới và cấp quyền truy cập theo nhiệm vụ.</p>
        </div>
        <Link className="btn btn-outline" to="/dashboard/nguoi-dung">
          <ArrowLeft size={16} /> Quản lý người dùng
        </Link>
      </header>

      <div className="create-user-layout">
        <form className="admin-panel create-user-form" onSubmit={handleSubmit}>
          <div className="create-user-form-heading">
            <span className="create-user-icon"><UserPlus size={20} /></span>
            <div>
              <h2>Thông tin tài khoản</h2>
              <p>Các trường có dấu * là bắt buộc.</p>
            </div>
          </div>

          {error && <div className="create-user-alert error" role="alert">{error}</div>}
          {success && <div className="create-user-alert success" role="status"><CheckCircle2 size={17} />{success}</div>}

          <div className="create-user-fields">
            <div className="form-group">
              <label className="label" htmlFor="create-user-name">Họ và tên *</label>
              <input
                className="input"
                id="create-user-name"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                autoComplete="name"
                required
                maxLength={100}
              />
            </div>

            <div className="form-group">
              <label className="label" htmlFor="create-user-email">Email đăng nhập *</label>
              <input
                className="input"
                id="create-user-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
                maxLength={254}
              />
            </div>

            <div className="form-group">
              <label className="label" htmlFor="create-user-password">Mật khẩu khởi tạo *</label>
              <input
                className="input"
                id="create-user-password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
                minLength={6}
              />
              <small className="create-user-hint">Ít nhất 6 ký tự.</small>
            </div>

            <div className="form-group">
              <label className="label" htmlFor="create-user-role">Vai trò *</label>
              <select className="select" id="create-user-role" name="role" value={form.role} onChange={handleChange} required>
                {ACCOUNT_ROLES.map(([role, label]) => <option key={role} value={role}>{label}</option>)}
              </select>
              <small className="create-user-hint">{ROLE_DESCRIPTIONS[form.role]}</small>
            </div>

            {form.role === 'STUDENT' && (
              <div className="form-group">
                <label className="label" htmlFor="create-user-student-id">Mã số sinh viên</label>
                <input className="input" id="create-user-student-id" name="studentId" value={form.studentId} onChange={handleChange} maxLength={30} />
              </div>
            )}

            {needsDepartment && (
              <div className="form-group">
                <label className="label" htmlFor="create-user-department">Phòng ban *</label>
                <select
                  className="select"
                  id="create-user-department"
                  name="departmentId"
                  value={form.departmentId}
                  onChange={handleChange}
                  required
                  disabled={Boolean(departmentError) || departments.length === 0}
                >
                  <option value="">Chọn phòng ban</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>{department.name}</option>
                  ))}
                </select>
                {departmentError ? (
                  <small className="create-user-field-error" role="alert">{departmentError}</small>
                ) : departments.length === 0 ? (
                  <small className="create-user-hint">Chưa có phòng ban đang hoạt động để chọn.</small>
                ) : null}
              </div>
            )}
          </div>

          <div className="create-user-actions">
            <Link className="btn btn-outline" to="/dashboard/nguoi-dung">Hủy</Link>
            <button className="btn btn-primary" type="submit" disabled={saving || (needsDepartment && (Boolean(departmentError) || departments.length === 0))}>
              <UserPlus size={16} />{saving ? 'Đang tạo...' : 'Tạo tài khoản'}
            </button>
          </div>
        </form>

        <aside className="admin-panel create-user-guide">
          <h2>Quyền truy cập</h2>
          <p>Chọn vai trò phù hợp. Nhân viên và quản lý phòng ban cần được gán vào một phòng ban.</p>
          <ul>
            <li><strong>Sinh viên</strong><span>Nộp hồ sơ, theo dõi yêu cầu và sử dụng dịch vụ dành cho sinh viên.</span></li>
            <li><strong>Nhân viên</strong><span>Tiếp nhận, xử lý hồ sơ thuộc phòng ban được phân công.</span></li>
            <li><strong>Quản lý phòng ban</strong><span>Điều phối công việc và xem thông tin hoạt động của phòng ban.</span></li>
          </ul>
        </aside>
      </div>
    </main>
  );
}

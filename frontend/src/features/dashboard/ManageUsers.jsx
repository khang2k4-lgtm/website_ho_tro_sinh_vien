import { useEffect, useState } from 'react';
import api from '../../services/api';
import { ROLE_LABELS, ROLE_OPTIONS, ROLE_DESCRIPTIONS } from '../../utils/constants';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);

  const load = () => api.get('/admin/users').then((r) => setUsers(r.data)).catch(() => setUsers([]));
  useEffect(() => { load(); }, []);

  const toggle = async (u) => {
    await api.patch(`/admin/users/${u.id}`, { isActive: !u.isActive, role: u.role, departmentId: u.departmentId });
    load();
  };

  const updateRole = async (u, role) => {
    await api.patch(`/admin/users/${u.id}`, { isActive: u.isActive, role, departmentId: u.departmentId });
    load();
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <div className="page-toolbar"><div><h1 className="page-title">Quản lý người dùng</h1><p className="page-subtitle">Phân quyền theo 4 nhóm tài khoản của hệ thống.</p></div><span className="badge badge-info">{users.length} tài khoản</span></div>
      <div className="grid grid-4" style={{ marginBottom: '1.5rem' }}>
        {ROLE_OPTIONS.map(([role, label]) => <div className="stat-card" key={role}><div className="label">{label}</div><div className="value">{users.filter((u) => u.role === role).length}</div><small style={{ color: 'var(--text-muted)' }}>{ROLE_DESCRIPTIONS[role]}</small></div>)}
      </div>
      <div className="card"><div className="card-body" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead><tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}><th style={{ padding: '0.75rem' }}>Họ tên</th><th>Email</th><th>Vai trò</th><th>Phòng ban</th><th>Trạng thái</th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.75rem' }}>{u.fullName}</td>
                <td>{u.email}</td>
                <td><select className="select" value={u.role} onChange={(e) => updateRole(u, e.target.value)} aria-label={`Vai trò của ${u.fullName}`} style={{ minWidth: 170 }}>{ROLE_OPTIONS.map(([role, label]) => <option key={role} value={role}>{label}</option>)}</select></td>
                <td>{u.department?.name || 'Toàn hệ thống'}</td>
                <td><button className={`btn btn-sm ${u.isActive ? 'btn-outline' : 'btn-danger'}`} onClick={() => toggle(u)}>{u.isActive ? 'Đang hoạt động' : 'Đã khóa'}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div></div>
    </div>
  );
}

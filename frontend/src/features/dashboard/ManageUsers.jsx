import { useEffect, useState } from 'react';
import api from '../../services/api';
import { ROLE_LABELS } from '../../utils/constants';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);

  const load = () => api.get('/admin/users').then((r) => setUsers(r.data)).catch(() => setUsers([]));
  useEffect(() => { load(); }, []);

  const toggle = async (u) => {
    await api.patch(`/admin/users/${u.id}`, { isActive: !u.isActive, role: u.role, departmentId: u.departmentId });
    load();
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <h1 className="page-title">Người dùng</h1>
      <div className="card"><div className="card-body" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead><tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}><th style={{ padding: '0.75rem' }}>Họ tên</th><th>Email</th><th>Vai trò</th><th>Trạng thái</th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.75rem' }}>{u.fullName}</td>
                <td>{u.email}</td>
                <td>{ROLE_LABELS[u.role]}</td>
                <td><button className={`btn btn-sm ${u.isActive ? 'btn-outline' : 'btn-danger'}`} onClick={() => toggle(u)}>{u.isActive ? 'Đang hoạt động' : 'Đã khóa'}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div></div>
    </div>
  );
}

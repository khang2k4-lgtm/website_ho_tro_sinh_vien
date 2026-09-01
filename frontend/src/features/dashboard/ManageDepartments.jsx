import { useEffect, useState } from 'react';
import api from '../../services/api';
import { slugify } from '../../utils/constants';

export default function ManageDepartments() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', phone: '', email: '', address: '' });
  const [editingId, setEditingId] = useState(null);
  const [editingSlug, setEditingSlug] = useState('');

  const load = () => api.get('/departments').then((r) => setItems(r.data)).catch(() => setItems([]));
  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setForm({ name: '', description: '', phone: '', email: '', address: '' });
    setEditingId(null);
    setEditingSlug('');
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      // Giữ đường dẫn cũ khi sửa để tránh trùng slug và không làm hỏng liên kết đã có.
      const data = { ...form, slug: editingSlug || slugify(form.name) };
      if (editingId) await api.put(`/departments/${editingId}`, data);
      else await api.post('/departments', data);
      resetForm();
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Không thể lưu phòng ban');
    }
  };

  const edit = (department) => {
    setEditingId(department.id);
    setEditingSlug(department.slug);
    setForm({
      name: department.name || '', description: department.description || '',
      phone: department.phone || '', email: department.email || '', address: department.address || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async (department) => {
    if (!window.confirm(`Xóa phòng ban “${department.name}”? Phòng ban sẽ bị ẩn khỏi hệ thống.`)) return;
    try {
      await api.delete(`/departments/${department.id}`);
      if (editingId === department.id) resetForm();
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Không thể xóa phòng ban');
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <h1 className="page-title">Phòng ban</h1>
      <form className="card" onSubmit={submit} style={{ marginBottom: '1.5rem' }}>
        <div className="card-header">{editingId ? 'Sửa phòng ban' : 'Thêm phòng ban'}</div>
        <div className="card-body grid grid-2">
          <div className="form-group"><label className="label">Tên</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
          <div className="form-group"><label className="label">Điện thoại</label><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}><label className="label">Mô tả</label><input className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div className="form-group"><label className="label">Email</label><input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div className="form-group"><label className="label">Địa chỉ</label><input className="input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-primary" type="submit">{editingId ? 'Lưu thay đổi' : 'Tạo'}</button>
            {editingId && <button className="btn btn-outline" type="button" onClick={resetForm}>Hủy</button>}
          </div>
        </div>
      </form>
      <div className="grid grid-2">
        {items.map((d) => (
          <div key={d.id} className="card"><div className="card-body">
            <strong>{d.name}</strong>
            <p style={{ color: 'var(--text-muted)' }}>{d._count?.services || 0} dịch vụ</p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button className="btn btn-outline btn-sm" onClick={() => edit(d)}>Sửa</button>
              <button className="btn btn-danger btn-sm" onClick={() => remove(d)}>Xóa</button>
            </div>
          </div></div>
        ))}
      </div>
    </div>
  );
}

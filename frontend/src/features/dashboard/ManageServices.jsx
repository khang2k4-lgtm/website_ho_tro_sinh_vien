import { useEffect, useState } from 'react';
import api from '../../services/api';
import { CATEGORIES, slugify } from '../../utils/constants';
import { Edit3, EyeOff, Plus, Search, X } from 'lucide-react';

export default function ManageServices() {
  const [items, setItems] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', category: 'HOC_VU', departmentId: '', processingTime: '3-5 ngày', submissionType: 'Online' });

  const load = () => {
    api.get('/services').then((r) => setItems(r.data)).catch(() => setItems([]));
    api.get('/departments').then((r) => setDepartments(r.data)).catch(() => setDepartments([]));
  };
  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm({ name: '', category: 'HOC_VU', departmentId: '', processingTime: '3-5 ngày', submissionType: 'Online' });
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        ...form,
        slug: editingId ? undefined : slugify(form.name),
        description: form.name,
        requiredDocs: ['Đơn đề nghị', 'CCCD'],
        steps: ['Nộp hồ sơ', 'Xét duyệt', 'Nhận kết quả'],
        keywords: [form.name.toLowerCase()],
      };
      if (editingId) await api.put(`/services/${editingId}`, data);
      else await api.post('/services', data);
      resetForm();
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Không thể lưu dịch vụ');
    } finally {
      setSaving(false);
    }
  };

  const edit = (service) => {
    setEditingId(service.id);
    setForm({ name: service.name || '', category: service.category || 'HOC_VU', departmentId: service.departmentId || '', processingTime: service.processingTime || '3-5 ngày', submissionType: service.submissionType || 'Online' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async (service) => {
    if (!window.confirm(`Ẩn dịch vụ “${service.name}”?`)) return;
    try {
      await api.delete(`/services/${service.id}`);
      if (editingId === service.id) resetForm();
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Không thể ẩn dịch vụ');
    }
  };

  const visibleItems = items.filter((service) => service.name.toLowerCase().includes(search.toLowerCase()) || service.department?.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <div className="page-toolbar"><div><h1 className="page-title">Dịch vụ</h1><p className="page-subtitle">Quản lý danh mục thủ tục sinh viên đang cung cấp.</p></div><button className="btn btn-outline" type="button" onClick={() => document.querySelector('#service-form')?.scrollIntoView({ behavior: 'smooth' })}><Plus size={16} />Thêm dịch vụ</button></div>
      <form id="service-form" className="card" onSubmit={save} style={{ marginBottom: '1.5rem' }}>
        <div className="card-header">{editingId ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ'}</div>
        <div className="card-body grid grid-2">
          <div className="form-group"><label className="label">Tên</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
          <div className="form-group">
            <label className="label">Phòng ban</label>
            <select className="select" value={form.departmentId} onChange={(e) => setForm({ ...form, departmentId: e.target.value })} required>
              <option value="">Chọn phòng</option>
              {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="label">Danh mục</label>
            <select className="select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {Object.entries(CATEGORIES).filter(([k]) => k !== 'CO_SO_VAT_CHAT').map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div className="action-row" style={{ gridColumn: '1 / -1' }}><button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Đang lưu...' : editingId ? 'Lưu thay đổi' : 'Tạo dịch vụ'}</button>{editingId && <button className="btn btn-outline" type="button" onClick={resetForm}><X size={16} />Hủy</button>}</div>
        </div>
      </form>
      <div className="page-toolbar"><label className="field-search" style={{ maxWidth: 420 }}><Search size={18} /><input className="input" aria-label="Tìm dịch vụ" placeholder="Tìm theo tên hoặc phòng ban" value={search} onChange={(e) => setSearch(e.target.value)} /></label><span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{visibleItems.length} dịch vụ</span></div>
      <div className="grid grid-2">
        {visibleItems.map((s) => (
          <div key={s.id} className="card"><div className="card-body"><strong>{s.name}</strong><p style={{ color: 'var(--text-muted)' }}>{s.department?.name}</p><div className="action-row" style={{ marginTop: '1rem' }}><button className="btn btn-outline btn-sm" type="button" onClick={() => edit(s)}><Edit3 size={14} />Sửa</button><button className="btn btn-danger btn-sm" type="button" onClick={() => remove(s)}><EyeOff size={14} />Ẩn</button></div></div></div>
        ))}
      </div>
      {visibleItems.length === 0 && <div className="card"><div className="empty-state">Không tìm thấy dịch vụ phù hợp.</div></div>}
    </div>
  );
}

import { useEffect, useState } from 'react';
import api from '../../services/api';
import { CATEGORIES, slugify } from '../../utils/constants';

export default function ManageServices() {
  const [items, setItems] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({ name: '', category: 'HOC_VU', departmentId: '', processingTime: '3-5 ngày', submissionType: 'Online' });

  const load = () => {
    api.get('/services').then((r) => setItems(r.data)).catch(() => setItems([]));
    api.get('/departments').then((r) => setDepartments(r.data)).catch(() => setDepartments([]));
  };
  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    await api.post('/services', {
      ...form,
      slug: slugify(form.name),
      description: form.name,
      requiredDocs: ['Đơn đề nghị', 'CCCD'],
      steps: ['Nộp hồ sơ', 'Xét duyệt', 'Nhận kết quả'],
      keywords: [form.name.toLowerCase()],
    });
    setForm({ ...form, name: '' });
    load();
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <h1 className="page-title">Dịch vụ</h1>
      <form className="card" onSubmit={create} style={{ marginBottom: '1.5rem' }}>
        <div className="card-header">Thêm dịch vụ</div>
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
          <button className="btn btn-primary" type="submit">Tạo</button>
        </div>
      </form>
      <div className="grid grid-2">
        {items.map((s) => (
          <div key={s.id} className="card"><div className="card-body"><strong>{s.name}</strong><p style={{ color: 'var(--text-muted)' }}>{s.department?.name}</p></div></div>
        ))}
      </div>
    </div>
  );
}

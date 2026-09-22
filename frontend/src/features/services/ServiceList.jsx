import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Clock3, FileCheck2, Search, ShieldCheck } from 'lucide-react';
import api from '../../services/api';
import { CATEGORIES } from '../../utils/constants';
import './ServiceList.css';

export default function ServiceList() {
  const [services, setServices] = useState([]);
  const [category, setCategory] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (departmentId) params.set('departmentId', departmentId);
    if (search) params.set('search', search);
    api.get(`/services?${params}`).then((r) => setServices(r.data));
  }, [category, departmentId, search]);

  const departments = Array.from(new Map(
    services
      .filter((service) => service.department)
      .map((service) => [service.department.id, service.department])
  ).values());

  const groupedServices = departments.map((department) => ({
    ...department,
    items: services.filter((service) => service.department?.id === department.id),
  }));

  const filteredGroups = groupedServices.filter((group) => group.items.length > 0);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="page-kicker">Trung tâm một cửa</div>
          <h1 className="page-title">Dịch vụ sinh viên</h1>
          <p className="page-subtitle">Tìm đúng thủ tục, chuẩn bị hồ sơ và gửi yêu cầu trực tuyến theo đúng đơn vị giải quyết.</p>
          <div className="page-hero-actions">
            <Link to="/tra-cuu" className="btn btn-light"><Search size={16} /> Tra cứu nhanh</Link>
            <Link to="/phong-ban" className="btn btn-ghost"><Building2 size={16} /> Xem phòng ban <ArrowRight size={15} /></Link>
          </div>
        </div>
      </section>

      <div className="container page-content">
        <div className="summary-strip">
          <div className="summary-item">
            <span className="summary-label">Tổng thủ tục</span>
            <strong>{services.length}</strong>
          </div>
          <div className="summary-item">
            <span className="summary-label">Học vụ</span>
            <strong>{services.filter((s) => s.category === 'HOC_VU').length}</strong>
          </div>
          <div className="summary-item">
            <span className="summary-label">Công tác SV</span>
            <strong>{services.filter((s) => s.category === 'CONG_TAC_SINH_VIEN').length}</strong>
          </div>
          <div className="summary-item">
            <span className="summary-label">Tài chính</span>
            <strong>{services.filter((s) => s.category === 'TAI_CHINH').length}</strong>
          </div>
        </div>

        <div className="filter-bar">
          <label className="field-search">
            <Search size={18} />
            <input className="input" aria-label="Tìm dịch vụ" placeholder="Tìm thủ tục, hồ sơ, phòng ban..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </label>

          <select className="select" value={category} onChange={(e) => setCategory(e.target.value)} style={{ maxWidth: 200 }}>
            <option value="">Tất cả danh mục</option>
            {Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>

          <select className="select" value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} style={{ maxWidth: 260 }}>
            <option value="">Tất cả phòng ban</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>{department.name}</option>
            ))}
          </select>
        </div>

        {filteredGroups.length === 0 ? (
          <div className="empty-state">
            <ShieldCheck size={28} />
            <p>Không tìm thấy thủ tục phù hợp với bộ lọc hiện tại.</p>
          </div>
        ) : (
          filteredGroups.map((group) => (
            <section key={group.id} className="service-group">
              <div className="service-group-header">
                <h2>{group.name}</h2>
                <span>{group.items.length} thủ tục</span>
              </div>

              <div className="grid grid-3">
                {group.items.map((s) => (
                  <Link key={s.id} to={`/dich-vu/${s.slug}`} className="service-card">
                    <div className="service-card-body">
                      <div className="service-card-topline">
                        <div className="service-card-icon"><FileCheck2 size={22} strokeWidth={2.2} /></div>
                        <span className="card-badge">{CATEGORIES[s.category]}</span>
                      </div>

                      <h3>{s.name}</h3>
                      <p className="service-summary">{s.description}</p>

                      <div className="service-meta-row">
                        <span><Building2 size={14} />{group.name}</span>
                        <span><Clock3 size={14} />{s.processingTime}</span>
                      </div>

                      <div className="service-card-footer">
                        <span>{s.submissionType}</span>
                        <span>Xem chi tiết <ArrowRight size={14} /></span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </>
  );
}

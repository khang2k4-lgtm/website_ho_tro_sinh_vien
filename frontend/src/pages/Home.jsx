import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Building2, FileText, HelpCircle, ArrowRight, Bell, MapPin } from 'lucide-react';
import api from '../services/api';
import './Home.css';

export default function Home() {
  const [query, setQuery] = useState('');
  const [guide, setGuide] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get('/departments'),
      api.get('/announcements'),
      api.get('/services'),
    ]).then(([d, a, s]) => {
      setDepartments(d.data.slice(0, 6));
      setAnnouncements(a.data.filter((x) => x.isPinned).slice(0, 3));
      setServices(s.data.slice(0, 6));
    }).catch(() => {});
  }, []);

  const handleGuideSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    try {
      const { data } = await api.get(`/search/guide?q=${encodeURIComponent(query)}`);
      setGuide(data);
    } catch {
      setGuide({ found: false, message: 'Lỗi tìm kiếm' });
    }
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-badge">Trường ĐH Mỏ - Địa chất</div>
          <h1>Bạn cần hỗ trợ vấn đề gì?</h1>
          <p>Tìm dịch vụ, thủ tục, phòng ban phù hợp — nộp hồ sơ online và theo dõi tiến trình</p>

          <form className="hero-search" onSubmit={handleGuideSearch}>
            <Search size={22} />
            <input
              placeholder='Ví dụ: "hoãn học", "thẻ sinh viên", "học phí"...'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-accent">Tìm kiếm</button>
          </form>

          {guide && (
            <div className={`guide-result ${guide.found ? 'found' : 'not-found'}`}>
              {guide.found ? (
                <>
                  <div className="guide-header">
                    <FileText size={24} />
                    <div>
                      <h3>{guide.service.name}</h3>
                      <p>Phòng phụ trách: <strong>{guide.service.department.name}</strong></p>
                    </div>
                  </div>
                  <div className="guide-details">
                    <div><strong>Hồ sơ cần:</strong> {Array.isArray(guide.service.requiredDocs) ? guide.service.requiredDocs.join(', ') : 'Xem chi tiết dịch vụ'}</div>
                    <div><strong>Thời gian:</strong> {guide.service.processingTime}</div>
                    <div><strong>Hình thức:</strong> {guide.service.submissionType}</div>
                  </div>
                  <div className="guide-actions">
                    <Link to={`/dich-vu/${guide.service.slug}`} className="btn btn-outline btn-sm">Xem hướng dẫn</Link>
                    <Link to={`/nop-ho-so/${guide.service.slug}`} className="btn btn-primary btn-sm">Nộp hồ sơ</Link>
                  </div>
                </>
              ) : (
                <p>{guide.message}</p>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="container section">
        <div className="section-header">
          <h2>Dịch vụ phổ biến</h2>
          <Link to="/dich-vu">Xem tất cả <ArrowRight size={16} /></Link>
        </div>
        <div className="grid grid-3">
          {services.map((s) => (
            <Link key={s.id} to={`/dich-vu/${s.slug}`} className="service-card">
              <FileText size={28} className="service-icon" />
              <h3>{s.name}</h3>
              <p>{s.department?.name}</p>
              <span className="service-time">{s.processingTime}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="section-header">
          <h2>Phòng ban</h2>
          <Link to="/phong-ban">Xem tất cả <ArrowRight size={16} /></Link>
        </div>
        <div className="grid grid-3">
          {departments.map((d) => (
            <Link key={d.id} to={`/phong-ban/${d.slug}`} className="dept-card">
              <Building2 size={28} />
              <h3>{d.name}</h3>
              <p>{d._count?.services || 0} dịch vụ</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="quick-links">
        <div className="container grid grid-4">
          <Link to="/tra-cuu" className="quick-link">
            <Search size={32} />
            <span>Tôi cần làm gì?</span>
          </Link>
          <Link to="/ho-tro" className="quick-link">
            <HelpCircle size={32} />
            <span>Yêu cầu hỗ trợ</span>
          </Link>
          <Link to="/bando" className="quick-link">
            <MapPin size={32} />
            <span>Bản đồ trường</span>
          </Link>
          <Link to="/thong-bao" className="quick-link">
            <Bell size={32} />
            <span>Thông báo</span>
          </Link>
        </div>
      </section>

      {announcements.length > 0 && (
        <section className="container section">
          <h2>Thông báo nổi bật</h2>
          <div className="announce-list">
            {announcements.map((a) => (
              <Link key={a.id} to={`/thong-bao/${a.id}`} className="announce-item">
                <Bell size={18} />
                <div>
                  <strong>{a.title}</strong>
                  <small>{a.department?.name}</small>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

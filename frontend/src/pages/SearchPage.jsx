import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function SearchPage() {
  const location = useLocation();
  const [results, setResults] = useState({ services: [], departments: [], faqs: [], announcements: [], posts: [] });
  const query = new URLSearchParams(location.search).get('q') || '';

  useEffect(() => {
    if (!query.trim()) {
      setResults({ services: [], departments: [], faqs: [], announcements: [], posts: [] });
      return;
    }
    api.get(`/search?q=${encodeURIComponent(query)}`)
      .then((res) => setResults(res.data))
      .catch(() => setResults({ services: [], departments: [], faqs: [], announcements: [], posts: [] }));
  }, [query]);

  const empty = !results.services.length && !results.departments.length && !results.announcements.length && !results.faqs.length;

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <h1 className="page-title">Tra cứu</h1>
      <SearchForm key={query} initialQuery={query} />

      {!query ? (
        <div className="card"><div className="card-body"><div className="empty-state">Nhập từ khóa để tra cứu dịch vụ, thủ tục và phòng ban.</div></div></div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {results.services.length > 0 && (
            <div className="card"><div className="card-header">Dịch vụ</div>
              <div className="card-body" style={{ display: 'grid', gap: '0.75rem' }}>
                {results.services.map((item) => <Link key={item.id} to={`/dich-vu/${item.slug}`}>{item.name}</Link>)}
              </div>
            </div>
          )}
          {results.departments.length > 0 && (
            <div className="card"><div className="card-header">Phòng ban</div>
              <div className="card-body" style={{ display: 'grid', gap: '0.75rem' }}>
                {results.departments.map((item) => <Link key={item.id} to={`/phong-ban/${item.slug}`}>{item.name}</Link>)}
              </div>
            </div>
          )}
          {results.announcements.length > 0 && (
            <div className="card"><div className="card-header">Thông báo</div>
              <div className="card-body" style={{ display: 'grid', gap: '0.75rem' }}>
                {results.announcements.map((item) => <Link key={item.id} to={`/thong-bao/${item.id}`}>{item.title}</Link>)}
              </div>
            </div>
          )}
          {results.faqs.length > 0 && (
            <div className="card"><div className="card-header">FAQ</div>
              <div className="card-body" style={{ display: 'grid', gap: '0.75rem' }}>
                {results.faqs.map((item) => <Link key={item.id} to="/faq">{item.question}</Link>)}
              </div>
            </div>
          )}
          {empty && <div className="card"><div className="card-body"><div className="empty-state">Không tìm thấy kết quả phù hợp.</div></div></div>}
        </div>
      )}
    </div>
  );
}

function SearchForm({ initialQuery }) {
  const navigate = useNavigate();
  const [draftQuery, setDraftQuery] = useState(initialQuery);

  const submit = (event) => {
    event.preventDefault();
    navigate(`/tim-kiem?q=${encodeURIComponent(draftQuery)}`);
  };

  return (
    <form className="hero-search" onSubmit={submit} style={{ marginBottom: '2rem', maxWidth: 700, marginLeft: 0 }}>
      <input value={draftQuery} onChange={(event) => setDraftQuery(event.target.value)} placeholder="Tìm dịch vụ, phòng ban, thông báo..." />
      <button type="submit" className="btn btn-accent">Tìm kiếm</button>
    </form>
  );
}

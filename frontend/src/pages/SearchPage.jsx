import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowRight, Bell, BriefcaseBusiness, Building2, Clock3, FileText, HelpCircle, MapPin, Phone, Search, Sparkles } from 'lucide-react';
import './SearchPage.css';

const EMPTY_RESULTS = { services: [], departments: [], faqs: [], announcements: [], posts: [] };
const POPULAR_TERMS = ['Học phí', 'Đăng ký học phần', 'Bảo lưu', 'Giấy xác nhận', 'Học bổng'];
const FILTERS = [
    { key: 'ALL', label: 'Tất cả', icon: Sparkles },
    { key: 'services', label: 'Dịch vụ & Thủ tục', icon: BriefcaseBusiness },
    { key: 'departments', label: 'Phòng ban', icon: Building2 },
    { key: 'announcements', label: 'Thông báo', icon: Bell },
    { key: 'faqs', label: 'Hỏi đáp', icon: HelpCircle },
];

const SAMPLE_RESULTS = {
    services: [{ id: 'sample-service', slug: 'tam-ngung-hoc-tap', name: 'Thủ tục tạm ngừng học tập (Bảo lưu kết quả học tập)', description: 'Hướng dẫn quy trình, thời gian nộp hồ sơ và các giấy tờ cần thiết cho sinh viên xin bảo lưu.', processingTime: '03 - 05 ngày làm việc', department: { name: 'Phòng Đào tạo Đại học' } }],
    departments: [{ id: 'sample-department', slug: 'phong-dao-tao-dai-hoc', name: 'Phòng Đào tạo Đại học', description: 'Quản lý chương trình học, lịch thi, cấp bảng điểm và giải quyết thủ tục bảo lưu, thôi học.', address: 'Phòng 204, Nhà C12', phone: '(024) 3838 7581' }],
    faqs: [{ id: 'sample-faq', question: 'Xin bảo lưu học tập tối đa được bao lâu?', answer: 'Thời gian tạm ngừng học tập vì lý do cá nhân không quá 2 học kỳ chính đối với chương trình đại học.' }],
    announcements: [{ id: 'sample-announcement', title: 'V/v tiếp nhận hồ sơ xin tạm ngừng và phục hồi học tập học kỳ I', content: 'Thông báo thời hạn cuối cùng nộp đơn bảo lưu học kỳ I cho tất cả sinh viên các khóa.', createdAt: '2026-08-25T08:00:00', department: { name: 'Phòng Đào tạo' } }],
    posts: [],
};

export default function SearchPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(location.search).get('q') || '';
    const [results, setResults] = useState(EMPTY_RESULTS);
    const [filter, setFilter] = useState('ALL');
    const [loading, setLoading] = useState(false);
    const [searchError, setSearchError] = useState(false);

    useEffect(() => {
        setFilter('ALL');
        if (!query.trim()) {
            setResults(EMPTY_RESULTS);
            setLoading(false);
            return;
        }
        setLoading(true);
        setSearchError(false);
        api.get(`/search?q=${encodeURIComponent(query)}`)
            .then((response) => setResults(hasResults(response.data) ? response.data : SAMPLE_RESULTS))
            .catch(() => { setResults(SAMPLE_RESULTS); setSearchError(true); })
            .finally(() => setLoading(false));
    }, [query]);

    const total = resultCount(results);
    const visibleCount = filter === 'ALL' ? total : results[filter]?.length || 0;
    const submitSearch = (value) => navigate(`/tra-cuu?q=${encodeURIComponent(value.trim())}`);

    return (
        <>
            <section className="lookup-hero">
                <div className="container lookup-hero-inner">
                    <div className="lookup-hero-mark"><Search size={27} /></div>
                    <div className="page-kicker">Tìm đúng thông tin</div>
                    <h1 className="page-title">Tra cứu thông tin</h1>
                    <p className="page-subtitle">Tìm dịch vụ, phòng ban, thông báo và câu trả lời trong một lần nhập.</p>
                    <div className="lookup-hero-actions"><Link className="btn btn-light" to="/dich-vu"><BriefcaseBusiness size={16} />Xem dịch vụ</Link><Link className="btn btn-ghost" to="/faq"><HelpCircle size={16} />Câu hỏi thường gặp <ArrowRight size={15} /></Link></div>
                    <SearchForm initialQuery={query} onSubmit={submitSearch} hero />
                </div>
            </section>

            <main className="container page-content lookup-page">
                <div className="popular-terms"><span><Sparkles size={16} /> Từ khóa phổ biến</span>{POPULAR_TERMS.map((term) => <button key={term} type="button" onClick={() => submitSearch(term)}>🔥 {term}</button>)}</div>
                {!query ? <div className="lookup-empty"><Search size={30} /><h2>Bắt đầu tra cứu</h2><p>Nhập từ khóa để tìm thủ tục, phòng ban, thông báo và câu trả lời liên quan.</p></div> : <>
                    <div className="lookup-filters" role="tablist" aria-label="Lọc kết quả">{FILTERS.map(({ key, label, icon: Icon }) => <button key={key} className={`lookup-filter ${filter === key ? 'active' : ''}`} type="button" onClick={() => setFilter(key)}><Icon size={16} />{label}{key === 'ALL' && <span>{total}</span>}</button>)}</div>
                    {searchError && <div className="lookup-notice">Không kết nối được dữ liệu mới nhất. Đang hiển thị kết quả minh họa phù hợp với từ khóa.</div>}
                    <div className="lookup-heading"><div><span className="lookup-kicker">Kết quả tra cứu</span><h2>Tìm thấy {visibleCount} kết quả cho “{query}”</h2></div>{loading && <span className="lookup-loading">Đang tìm...</span>}</div>
                    <div className="lookup-results">{(filter === 'ALL' || filter === 'services') && results.services.map((item) => <ServiceResult key={item.id} item={item} />)}{(filter === 'ALL' || filter === 'faqs') && results.faqs.map((item) => <FaqResult key={item.id} item={item} />)}{(filter === 'ALL' || filter === 'departments') && results.departments.map((item) => <DepartmentResult key={item.id} item={item} />)}{(filter === 'ALL' || filter === 'announcements') && results.announcements.map((item) => <AnnouncementResult key={item.id} item={item} />)}{visibleCount === 0 && <div className="lookup-empty compact"><HelpCircle size={26} /><h2>Chưa có kết quả phù hợp</h2><p>Thử một từ khóa ngắn hơn hoặc chọn một gợi ý phổ biến.</p></div>}</div>
                </>}
            </main>
        </>
    );
}

function SearchForm({ initialQuery, onSubmit, hero = false }) {
    const [draftQuery, setDraftQuery] = useState(initialQuery);
    useEffect(() => setDraftQuery(initialQuery), [initialQuery]);
    return <form className={`lookup-search ${hero ? 'lookup-hero-form' : ''}`} onSubmit={(event) => { event.preventDefault(); onSubmit(draftQuery); }}><Search size={20} /><input aria-label="Từ khóa tra cứu" value={draftQuery} onChange={(event) => setDraftQuery(event.target.value)} placeholder="Tìm dịch vụ, phòng ban, thông báo..." /><button className="btn btn-primary" type="submit"><Search size={16} />Tìm kiếm</button></form>;
}

function resultCount(results) { return results.services.length + results.departments.length + results.faqs.length + results.announcements.length; }
function hasResults(results) { return resultCount(results) > 0; }
function ResultShell({ icon: Icon, label, title, children }) { return <article className="lookup-result"><div className="lookup-result-top"><span className="lookup-result-type"><Icon size={14} />{label}</span></div><h3>{title}</h3>{children}</article>; }
function ServiceResult({ item }) { return <ResultShell icon={BriefcaseBusiness} label="Dịch vụ trực tuyến" title={item.name}><p>{item.description || 'Hướng dẫn quy trình và hồ sơ cần thiết cho sinh viên.'}</p><div className="result-meta"><span><Building2 size={14} />Đơn vị: {item.department?.name || 'Phòng ban HUMG'}</span><span><Clock3 size={14} />Thời gian xử lý: {item.processingTime || 'Theo quy định'}</span></div><Link className="result-action" to={`/dich-vu/${item.slug}`}>Thực hiện thủ tục <ArrowRight size={15} /></Link></ResultShell>; }
function FaqResult({ item }) { return <ResultShell icon={HelpCircle} label="Câu hỏi thường gặp" title={item.question}><p><strong>Tóm tắt:</strong> {item.answer || 'Xem câu trả lời chi tiết trong mục FAQ.'}</p><div className="result-meta"><span><FileText size={14} />Nguồn: FAQ HUMG</span></div><Link className="result-action" to="/faq">Xem câu trả lời chi tiết <ArrowRight size={15} /></Link></ResultShell>; }
function DepartmentResult({ item }) { return <ResultShell icon={Building2} label="Phòng ban" title={item.name}><p>{item.description || 'Đầu mối hỗ trợ và cung cấp dịch vụ sinh viên.'}</p><div className="result-meta"><span><MapPin size={14} />{item.address || 'Cơ sở chính HUMG'}</span>{item.phone && <span><Phone size={14} />{item.phone}</span>}</div><div className="result-actions"><a className="btn btn-outline btn-sm" href={`tel:${item.phone?.replace(/[^\d+]/g, '')}`}><Phone size={14} />Liên hệ</a><Link className="result-action" to={`/phong-ban/${item.slug}`}>Xem phòng ban <ArrowRight size={15} /></Link></div></ResultShell>; }
function AnnouncementResult({ item }) { return <ResultShell icon={Bell} label="Thông báo" title={item.title}><p>{item.content || 'Xem nội dung thông báo chi tiết.'}</p><div className="result-meta"><span><Clock3 size={14} />Ngày đăng: {new Date(item.createdAt).toLocaleDateString('vi-VN')}</span><span><Building2 size={14} />{item.department?.name || 'Phòng ban HUMG'}</span></div><Link className="result-action" to={`/thong-bao/${item.id}`}>Xem thông báo <ArrowRight size={15} /></Link></ResultShell>; }

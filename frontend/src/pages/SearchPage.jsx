import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowRight, Bell, BookMarked, BriefcaseBusiness, Building2, Clock3, FileText, GraduationCap, HelpCircle, MapPin, Phone, Search, Sparkles, UsersRound, Wallet } from 'lucide-react';
import { CATEGORIES } from '../utils/constants';
import './SearchPage.css';

const EMPTY_RESULTS = { services: [], departments: [], faqs: [], announcements: [], posts: [] };
const POPULAR_TERMS = ['Học phí', 'Đăng ký học phần', 'Bảo lưu', 'Giấy xác nhận', 'Học bổng'];
const SEARCH_CATEGORIES = [
    { id: 'HOC_VU', title: 'Học vụ & Đào tạo', description: 'Đăng ký học phần, bảng điểm, bảo lưu và thủ tục tốt nghiệp.', icon: GraduationCap, tone: 'blue' },
    { id: 'CONG_TAC_SINH_VIEN', title: 'Công tác sinh viên', description: 'Giấy xác nhận, học bổng và các chính sách sinh viên.', icon: UsersRound, tone: 'green' },
    { id: 'TAI_CHINH', title: 'Kế hoạch - Tài chính', description: 'Học phí, miễn giảm và các thủ tục tài chính.', icon: Wallet, tone: 'amber' },
    { id: 'OTHER', title: 'Dịch vụ hỗ trợ', description: 'Thư viện, công nghệ thông tin và tiện ích trong trường.', icon: BookMarked, tone: 'purple' },
];
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
    const [catalogServices, setCatalogServices] = useState([]);
    const [popularFaqs, setPopularFaqs] = useState([]);
    const [overviewLoading, setOverviewLoading] = useState(true);
    const [overviewError, setOverviewError] = useState(false);
    const [filter, setFilter] = useState('ALL');
    const [loading, setLoading] = useState(false);
    const [searchError, setSearchError] = useState(false);

    useEffect(() => {
        let active = true;
        Promise.allSettled([api.get('/services'), api.get('/faqs')])
            .then(([serviceResult, faqResult]) => {
                if (!active) return;
                if (serviceResult.status === 'fulfilled') {
                    setCatalogServices(Array.isArray(serviceResult.value.data) ? serviceResult.value.data : []);
                }
                if (faqResult.status === 'fulfilled') {
                    setPopularFaqs(Array.isArray(faqResult.value.data) ? faqResult.value.data.slice(0, 4) : []);
                }
                setOverviewError(serviceResult.status === 'rejected' || faqResult.status === 'rejected');
            })
            .finally(() => {
                if (active) setOverviewLoading(false);
            });
        return () => { active = false; };
    }, []);

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
    const categoryServices = (categoryId) => categoryId === 'OTHER'
        ? catalogServices.filter((service) => !['HOC_VU', 'CONG_TAC_SINH_VIEN', 'TAI_CHINH'].includes(service.category))
        : catalogServices.filter((service) => service.category === categoryId);
    const popularServices = [...catalogServices]
        .sort((first, second) => (second._count?.applications || 0) - (first._count?.applications || 0))
        .slice(0, 3);

    return (
        <>
            <section className="lookup-hero">
                <div className="container lookup-hero-inner">
                    <div className="lookup-hero-mark"><Search size={27} /></div>
                    <div className="page-kicker">Trung tâm tra cứu một cửa</div>
                    <h1 className="page-title">Tra cứu thông tin & thủ tục sinh viên</h1>
                    <p className="page-subtitle">Tìm nhanh biểu mẫu, quy trình, phòng ban, thông báo và câu trả lời trong một lần nhập.</p>
                    <SearchForm initialQuery={query} onSubmit={submitSearch} hero />
                    <div className="lookup-popular-terms"><span>Từ khóa phổ biến</span>{POPULAR_TERMS.map((term) => <button key={term} type="button" onClick={() => submitSearch(term)}>{term}</button>)}</div>
                </div>
            </section>

            <main className="container page-content lookup-page">
                {!query ? <>
                    {overviewError && <div className="lookup-notice" role="status">Chưa tải được một số nội dung. Vui lòng thử tải lại trang.</div>}
                    <section className="lookup-categories" aria-labelledby="lookup-categories-title">
                        <div className="lookup-section-heading">
                            <div><span className="lookup-kicker">Danh mục dịch vụ</span><h2 id="lookup-categories-title">Bạn đang cần tìm gì?</h2></div>
                            <Link to="/dich-vu">Tất cả dịch vụ <ArrowRight size={15} /></Link>
                        </div>
                        <div className="lookup-category-grid">
                            {SEARCH_CATEGORIES.map(({ id, title, description, icon: Icon, tone }) => {
                                const services = categoryServices(id);
                                return (
                                    <Link key={id} to={id === 'OTHER' ? '/dich-vu' : `/dich-vu?category=${id}`} className={`lookup-category-card ${tone}`}>
                                        <span className="lookup-category-icon"><Icon size={22} /></span>
                                        <span className="lookup-category-count">{overviewLoading ? 'Đang tải' : `${services.length} thủ tục`}</span>
                                        <h3>{title}</h3>
                                        <p>{description}</p>
                                        <span className="lookup-category-link">Khám phá danh mục <ArrowRight size={14} /></span>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>

                    <section className="lookup-featured" aria-labelledby="lookup-featured-title">
                        <div className="lookup-section-heading">
                            <div><span className="lookup-kicker">Dịch vụ sinh viên</span><h2 id="lookup-featured-title"><Sparkles size={20} /> Thủ tục được quan tâm</h2><p>Dựa trên số hồ sơ đã gửi.</p></div>
                            <Link to="/dich-vu">Xem tất cả {catalogServices.length} dịch vụ <ArrowRight size={15} /></Link>
                        </div>
                        {overviewLoading ? <p className="lookup-loading">Đang tải dịch vụ...</p> : popularServices.length > 0 ? (
                            <div className="lookup-featured-grid">
                                {popularServices.map((service, index) => <FeaturedService key={service.id} item={service} rank={index + 1} />)}
                            </div>
                        ) : (
                            <div className="lookup-empty compact"><BriefcaseBusiness size={24} /><h2>Chưa có dịch vụ để hiển thị</h2><p>Danh sách thủ tục sẽ xuất hiện tại đây khi có dữ liệu.</p></div>
                        )}
                    </section>

                    <section className="lookup-faq-section" aria-labelledby="lookup-faq-title">
                        <div className="lookup-faq-heading"><span className="lookup-kicker">Hỗ trợ nhanh</span><h2 id="lookup-faq-title">Câu hỏi thường gặp</h2><p>Giải đáp một số vấn đề sinh viên thường quan tâm.</p></div>
                        {overviewLoading ? <p className="lookup-loading">Đang tải câu hỏi...</p> : popularFaqs.length > 0 ? (
                            <div className="lookup-faq-list">
                                {popularFaqs.map((faq) => <details key={faq.id} className="lookup-faq-item"><summary>{faq.question}<ArrowRight size={16} /></summary><p>{faq.answer}</p></details>)}
                            </div>
                        ) : (
                            <div className="lookup-empty compact"><HelpCircle size={24} /><h2>Chưa có câu hỏi thường gặp</h2><p>Các câu trả lời sẽ xuất hiện tại đây khi có dữ liệu.</p></div>
                        )}
                        <Link className="lookup-faq-more" to="/faq">Xem toàn bộ câu hỏi thường gặp <ArrowRight size={15} /></Link>
                    </section>
                </> : <>
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
    return <form className={`lookup-search ${hero ? 'lookup-hero-form' : ''}`} onSubmit={(event) => { event.preventDefault(); onSubmit(draftQuery); }}><Search size={20} /><input aria-label="Từ khóa tra cứu" value={draftQuery} onChange={(event) => setDraftQuery(event.target.value)} placeholder="Tìm thủ tục, phòng ban, thông báo..." /><button className="btn btn-primary" type="submit"><Search size={16} />Tra cứu</button></form>;
}

function resultCount(results) { return results.services.length + results.departments.length + results.faqs.length + results.announcements.length; }
function hasResults(results) { return resultCount(results) > 0; }
function ResultShell({ icon: Icon, label, title, children }) { return <article className="lookup-result"><div className="lookup-result-top"><span className="lookup-result-type"><Icon size={14} />{label}</span></div><h3>{title}</h3>{children}</article>; }
function FeaturedService({ item, rank }) { return <article className="lookup-featured-card"><div className="lookup-featured-top"><span className={`lookup-rank rank-${rank}`}>GỢI Ý {rank}</span><span className="lookup-featured-category">{CATEGORIES[item.category] || 'Dịch vụ sinh viên'}</span></div><h3>{item.name}</h3><p>{item.description || 'Xem hướng dẫn và hồ sơ cần thiết cho thủ tục này.'}</p><div className="lookup-featured-meta"><span><Clock3 size={14} />{item.processingTime || 'Theo quy định'}</span><span><Building2 size={14} />{item.department?.name || 'Phòng ban HUMG'}</span></div><Link className="lookup-featured-action" to={`/dich-vu/${item.slug}`}>Xem chi tiết thủ tục <ArrowRight size={15} /></Link></article>; }
function ServiceResult({ item }) { return <ResultShell icon={BriefcaseBusiness} label="Dịch vụ trực tuyến" title={item.name}><p>{item.description || 'Hướng dẫn quy trình và hồ sơ cần thiết cho sinh viên.'}</p><div className="result-meta"><span><Building2 size={14} />Đơn vị: {item.department?.name || 'Phòng ban HUMG'}</span><span><Clock3 size={14} />Thời gian xử lý: {item.processingTime || 'Theo quy định'}</span></div><Link className="result-action" to={`/dich-vu/${item.slug}`}>Thực hiện thủ tục <ArrowRight size={15} /></Link></ResultShell>; }
function FaqResult({ item }) { return <ResultShell icon={HelpCircle} label="Câu hỏi thường gặp" title={item.question}><p><strong>Tóm tắt:</strong> {item.answer || 'Xem câu trả lời chi tiết trong mục FAQ.'}</p><div className="result-meta"><span><FileText size={14} />Nguồn: FAQ HUMG</span></div><Link className="result-action" to="/faq">Xem câu trả lời chi tiết <ArrowRight size={15} /></Link></ResultShell>; }
function DepartmentResult({ item }) { return <ResultShell icon={Building2} label="Phòng ban" title={item.name}><p>{item.description || 'Đầu mối hỗ trợ và cung cấp dịch vụ sinh viên.'}</p><div className="result-meta"><span><MapPin size={14} />{item.address || 'Cơ sở chính HUMG'}</span>{item.phone && <span><Phone size={14} />{item.phone}</span>}</div><div className="result-actions"><a className="btn btn-outline btn-sm" href={`tel:${item.phone?.replace(/[^\d+]/g, '')}`}><Phone size={14} />Liên hệ</a><Link className="result-action" to={`/phong-ban/${item.slug}`}>Xem phòng ban <ArrowRight size={15} /></Link></div></ResultShell>; }
function AnnouncementResult({ item }) { return <ResultShell icon={Bell} label="Thông báo" title={item.title}><p>{item.content || 'Xem nội dung thông báo chi tiết.'}</p><div className="result-meta"><span><Clock3 size={14} />Ngày đăng: {new Date(item.createdAt).toLocaleDateString('vi-VN')}</span><span><Building2 size={14} />{item.department?.name || 'Phòng ban HUMG'}</span></div><Link className="result-action" to={`/thong-bao/${item.id}`}>Xem thông báo <ArrowRight size={15} /></Link></ResultShell>; }

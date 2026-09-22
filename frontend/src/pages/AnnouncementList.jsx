import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowRight, Bell, CalendarDays, GraduationCap, Landmark, Pin, Search, WalletCards } from 'lucide-react';
import './AnnouncementList.css';

const CATEGORY_OPTIONS = [
    { key: 'ALL', label: 'Tất cả', icon: Bell },
    { key: 'DAO_TAO', label: 'Đào tạo', icon: GraduationCap },
    { key: 'TAI_CHINH', label: 'Học phí & BHYT', icon: WalletCards },
    { key: 'CONG_TAC_SINH_VIEN', label: 'Công tác SV', icon: Bell },
    { key: 'HANH_CHINH', label: 'Hành chính', icon: Landmark },
];

const SAMPLE_ANNOUNCEMENTS = [
    { id: 'sample-1', title: 'Thông báo đăng ký tín chỉ học kỳ 1 năm học 2026 - 2027', content: 'Phòng Đào tạo Đại học thông báo kế hoạch và thời gian mở hệ thống đăng ký tín chỉ cho sinh viên các khóa K65, K66, K67, K68.', department: { name: 'Phòng Đào tạo Đại học' }, tags: ['DAO_TAO'], isPinned: true, createdAt: '2026-09-05T08:00:00' },
    { id: 'sample-2', title: 'Thông báo về việc nộp học phí và BHYT khóa K68', content: 'Thông tin danh sách miễn giảm học phí, trợ cấp xã hội và thời hạn hoàn thành nghĩa vụ tài chính học kỳ 1.', department: { name: 'Phòng Tài chính - Kế toán' }, tags: ['TAI_CHINH'], isPinned: true, createdAt: '2026-09-02T08:00:00' },
    { id: 'sample-3', title: 'Thông báo xét cấp học bổng khuyến khích học tập học kỳ II', content: 'Phòng Công tác Sinh viên hướng dẫn điều kiện, hồ sơ và thời gian nộp hồ sơ xét học bổng.', department: { name: 'Phòng Công tác Sinh viên' }, tags: ['CONG_TAC_SINH_VIEN'], createdAt: '2026-09-08T08:00:00' },
    { id: 'sample-4', title: 'Lịch thi và danh sách thi kết thúc phần học giai đoạn 1', content: 'Sinh viên kiểm tra lịch thi cá nhân trên cổng thông tin và có mặt đúng giờ theo quy định.', department: { name: 'Phòng Đào tạo Đại học' }, tags: ['DAO_TAO'], createdAt: '2026-09-01T08:00:00' },
    { id: 'sample-5', title: 'Thông báo nghỉ lễ Quốc khánh 02/09 dành cho toàn thể sinh viên', content: 'Nhà trường thông báo lịch nghỉ lễ Quốc khánh và thời gian học tập trở lại.', department: { name: 'Phòng Hành chính - Tổng hợp' }, tags: ['HANH_CHINH'], createdAt: '2026-08-28T08:00:00' },
    { id: 'sample-6', title: 'Kế hoạch tổ chức lễ trao bằng tốt nghiệp đợt 2 năm 2026', content: 'Thông tin về thời gian, địa điểm và các bước xác nhận tham dự lễ trao bằng.', department: { name: 'Phòng Đào tạo Đại học' }, tags: ['DAO_TAO'], createdAt: '2026-08-25T08:00:00' },
];

function getCategory(item) {
    const tags = Array.isArray(item.tags) ? item.tags : [];
    if (tags.length) return tags[0];
    const title = `${item.title} ${item.content}`.toLowerCase();
    if (title.includes('học phí') || title.includes('bhyt') || title.includes('tài chính')) return 'TAI_CHINH';
    if (title.includes('đào tạo') || title.includes('thi ') || title.includes('tín chỉ') || title.includes('đăng ký môn') || title.includes('đăng ký tín')) return 'DAO_TAO';
    if (title.includes('nghỉ lễ') || title.includes('hành chính')) return 'HANH_CHINH';
    return 'CONG_TAC_SINH_VIEN';
}

function categoryLabel(key) {
    return CATEGORY_OPTIONS.find((category) => category.key === key)?.label || 'Công tác SV';
}

function formatAnnouncementDate(date) {
    return new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function AnnouncementList() {
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('ALL');
    const [page, setPage] = useState(1);
    const pageSize = 4;

    useEffect(() => {
        const params = search ? `?search=${encodeURIComponent(search)}` : '';
        api.get(`/announcements${params}`).then((res) => setItems(res.data.length ? res.data : SAMPLE_ANNOUNCEMENTS)).catch(() => setItems(SAMPLE_ANNOUNCEMENTS));
        setPage(1);
    }, [search]);

    const filteredItems = useMemo(() => items.filter((item) => category === 'ALL' || getCategory(item) === category), [items, category]);
    const pinnedItems = filteredItems.filter((item) => item.isPinned).slice(0, 2);
    const regularItems = filteredItems.filter((item) => !pinnedItems.some((pinned) => pinned.id === item.id));
    const pageCount = Math.max(1, Math.ceil(regularItems.length / pageSize));
    const visibleItems = regularItems.slice((page - 1) * pageSize, page * pageSize);

    return (
        <>
            <section className="announcement-hero">
                <div className="container announcement-hero-inner">
                    <div className="announcement-hero-icon"><Bell size={28} /></div>
                    <div className="page-kicker">Cập nhật chính thức từ HUMG</div>
                    <h1 className="page-title">Thông báo & tin tức sinh viên</h1>
                    <p className="page-subtitle">Theo dõi thông tin mới nhất từ các phòng, ban, khoa của Trường Đại học Mỏ - Địa chất.</p>
                    <form className="announcement-search" onSubmit={(event) => event.preventDefault()}>
                        <Search size={20} />
                        <input aria-label="Tìm thông báo" placeholder="Nhập từ khóa: học phí, lịch thi, đăng ký môn..." value={search} onChange={(event) => setSearch(event.target.value)} />
                        <button className="btn btn-primary" type="submit"><Search size={16} />Tìm kiếm</button>
                    </form>
                </div>
            </section>

            <div className="container page-content announcement-page">
                <div className="announcement-categories" role="tablist" aria-label="Danh mục thông báo">
                    {CATEGORY_OPTIONS.map(({ key, label, icon: Icon }) => <button key={key} className={`category-tab ${category === key ? 'active' : ''}`} type="button" onClick={() => { setCategory(key); setPage(1); }}><Icon size={16} />{label}{key === 'ALL' && <span>{items.length}</span>}</button>)}
                </div>

                {pinnedItems.length > 0 && <section className="announcement-section"><div className="section-heading"><div><span className="section-kicker">Ưu tiên theo dõi</span><h2><Pin size={19} /> Thông báo nổi bật</h2></div><span className="section-count">{pinnedItems.length} tin ghim</span></div><div className="pinned-grid">{pinnedItems.map((item) => <AnnouncementCard key={item.id} item={item} featured />)}</div></section>}

                <section className="announcement-section"><div className="section-heading"><div><span className="section-kicker">Cập nhật mới nhất</span><h2><Bell size={19} /> Tất cả thông báo</h2></div><span className="section-count">{filteredItems.length} tin</span></div><div className="announcement-list">{visibleItems.map((item) => <AnnouncementCard key={item.id} item={item} />)}{filteredItems.length === 0 && <div className="card"><div className="empty-state">Không tìm thấy thông báo phù hợp.</div></div>}</div>{pageCount > 1 && <div className="pagination"><button className="btn btn-outline btn-sm" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>← Trang trước</button>{Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => <button key={number} className={`page-number ${page === number ? 'active' : ''}`} onClick={() => setPage(number)}>{number}</button>)}<button className="btn btn-outline btn-sm" disabled={page === pageCount} onClick={() => setPage((current) => current + 1)}>Trang sau →</button></div>}</section>
            </div>
        </>
    );
}

function AnnouncementCard({ item, featured = false }) {
    const category = getCategory(item);
    return <Link to={`/thong-bao/${item.id}`} className={`announcement-card ${featured ? 'featured' : ''}`}>
        <div className="announcement-card-top"><span className="announcement-tag"><Bell size={13} />{categoryLabel(category)}</span>{item.isPinned && <span className="pinned-label"><Pin size={13} /> Ghim</span>}</div>
        <h3>{item.title}</h3>
        <p>{item.content}</p>
        <div className="announcement-meta"><span><Landmark size={14} />{item.department?.name || 'Phòng ban HUMG'}</span><span><CalendarDays size={14} />{formatAnnouncementDate(item.createdAt)}</span></div>
        <span className="announcement-more">Xem chi tiết <ArrowRight size={15} /></span>
    </Link>;
}

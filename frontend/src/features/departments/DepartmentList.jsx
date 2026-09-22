import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { ArrowRight, Building2, CalendarClock, GraduationCap, Landmark, MapPin, Phone, Search, WalletCards, Wrench } from 'lucide-react';
import './DepartmentList.css';

const GROUPS = [
    { key: 'ALL', label: 'Tất cả', icon: Building2 },
    { key: 'DAO_TAO', label: 'Khối Đào tạo', icon: GraduationCap },
    { key: 'HANH_CHINH', label: 'Khối Hành chính', icon: Landmark },
    { key: 'TAI_CHINH', label: 'Khối Tài chính & Hỗ trợ', icon: WalletCards },
];

const SAMPLE_DEPARTMENTS = [
    { id: 'dept-1', slug: 'bo-phan-mot-cua', name: 'Bộ phận Một cửa', description: 'Đơn vị tiếp nhận và trả kết quả thủ tục hành chính sinh viên.', address: 'Tầng 1, Nhà C12', phone: '(024) 3838 9633', group: 'HANH_CHINH', _count: { services: 12, staff: 8 } },
    { id: 'dept-2', slug: 'phong-dao-tao-dai-hoc', name: 'Phòng Đào tạo Đại học', description: 'Quản lý chương trình học, lịch thi và cấp bằng cho sinh viên.', address: 'Phòng 204, Nhà C12', phone: '(024) 3838 7581', group: 'DAO_TAO', _count: { services: 18, staff: 15 } },
    { id: 'dept-3', slug: 'phong-cong-tac-sinh-vien', name: 'Phòng Công tác Sinh viên', description: 'Hỗ trợ chính sách, học bổng, bảo hiểm và hoạt động sinh viên.', address: 'Phòng 102, Nhà C12', phone: '(024) 3838 9633', group: 'TAI_CHINH', _count: { services: 10, staff: 12 } },
    { id: 'dept-4', slug: 'phong-tai-chinh-ke-toan', name: 'Phòng Tài chính - Kế toán', description: 'Tiếp nhận và giải đáp các nội dung học phí, lệ phí và công nợ.', address: 'Phòng 105, Nhà C12', phone: '(024) 3838 4522', group: 'TAI_CHINH', _count: { services: 6, staff: 9 } },
    { id: 'dept-5', slug: 'phong-hanh-chinh-tong-hop', name: 'Phòng Hành chính - Tổng hợp', description: 'Cung cấp thông tin hành chính và hỗ trợ liên hệ các đơn vị.', address: 'Phòng 201, Nhà C12', phone: '(024) 3838 9633', group: 'HANH_CHINH', _count: { services: 4, staff: 7 } },
    { id: 'dept-6', slug: 'trung-tam-cong-nghe-thong-tin', name: 'Trung tâm Công nghệ Thông tin', description: 'Hỗ trợ tài khoản, hệ thống đăng ký học tập và dịch vụ trực tuyến.', address: 'Phòng 303, Nhà C12', phone: '(024) 3838 1234', group: 'HANH_CHINH', _count: { services: 5, staff: 10 } },
];

function getGroup(department) {
    if (department.group) return department.group;
    const name = department.name.toLowerCase();
    if (name.includes('đào tạo') || name.includes('khoa')) return 'DAO_TAO';
    if (name.includes('tài chính') || name.includes('công tác') || name.includes('sinh viên') || name.includes('hỗ trợ')) return 'TAI_CHINH';
    return 'HANH_CHINH';
}

function groupLabel(key) {
    return GROUPS.find((group) => group.key === key)?.label || 'Khối Hành chính';
}

export default function DepartmentList() {
    const [departments, setDepartments] = useState([]);
    const [search, setSearch] = useState('');
    const [group, setGroup] = useState('ALL');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/departments').then((response) => setDepartments(response.data.length ? response.data : SAMPLE_DEPARTMENTS)).catch(() => setDepartments(SAMPLE_DEPARTMENTS)).finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => departments.filter((department) => {
        const text = `${department.name} ${department.description || ''} ${department.address || ''}`.toLowerCase();
        return (group === 'ALL' || getGroup(department) === group) && text.includes(search.toLowerCase());
    }), [departments, group, search]);

    const preferredFeatured = filtered.filter((department) => ['Bộ phận Một cửa', 'Phòng Đào tạo Đại học'].includes(department.name));
    const featured = [...preferredFeatured, ...filtered.filter((department) => !preferredFeatured.some((item) => item.id === department.id))].slice(0, 2);
    const list = filtered.filter((department) => !featured.some((item) => item.id === department.id));

    if (loading) return <div className="loading container">Đang tải phòng ban...</div>;

    return (
        <>
            <section className="department-hero">
                <div className="container department-hero-inner">
                    <div className="department-hero-icon"><Building2 size={29} /></div>
                    <div className="page-kicker">Đầu mối liên hệ tại HUMG</div>
                    <h1 className="page-title">Các phòng ban & đơn vị hỗ trợ</h1>
                    <p className="page-subtitle">Tra cứu thông tin liên hệ, vị trí làm việc và các dịch vụ sinh viên đang cung cấp.</p>
                    <form className="department-search" onSubmit={(event) => event.preventDefault()}><Search size={20} /><input aria-label="Tìm phòng ban" placeholder="Nhập tên phòng ban: Đào tạo, Tài chính, CTSV..." value={search} onChange={(event) => setSearch(event.target.value)} /><button className="btn btn-primary" type="submit"><Search size={16} />Tìm kiếm</button></form>
                </div>
            </section>

            <main className="container page-content department-page">
                <div className="department-groups" role="tablist" aria-label="Lọc theo khối phòng ban">{GROUPS.map(({ key, label, icon: Icon }) => <button key={key} className={`department-group ${group === key ? 'active' : ''}`} type="button" onClick={() => setGroup(key)}><Icon size={16} />{label}{key === 'ALL' && <span>{departments.length}</span>}</button>)}</div>

                {featured.length > 0 && <section className="department-section"><div className="department-section-heading"><div><span className="department-kicker">Đơn vị được quan tâm</span><h2><Landmark size={19} /> Phòng ban nổi bật</h2></div><span>{featured.length} đơn vị</span></div><div className="featured-departments">{featured.map((department) => <DepartmentCard key={department.id} department={department} featured />)}</div></section>}

                <section className="department-section"><div className="department-section-heading"><div><span className="department-kicker">Tra cứu theo nhu cầu</span><h2><Building2 size={19} /> Danh sách tất cả phòng ban</h2></div><span>{filtered.length} phòng ban</span></div><div className="department-list">{list.map((department) => <DepartmentRow key={department.id} department={department} />)}{filtered.length === 0 && <div className="card"><div className="empty-state">Không tìm thấy phòng ban phù hợp.</div></div>}</div></section>

                <section className="working-hours"><CalendarClock size={24} /><div><span className="department-kicker">Thông tin chung</span><h2>Thời gian làm việc của các phòng ban</h2><p>Buổi sáng: 08:00 - 11:30 &nbsp; · &nbsp; Buổi chiều: 13:30 - 17:00 &nbsp; · &nbsp; Thứ 2 - Thứ 6</p><small>Nghỉ Thứ 7, Chủ nhật và các ngày Lễ/Tết theo quy định.</small></div></section>
            </main>
        </>
    );
}

function DepartmentCard({ department, featured }) {
    return <article className={`department-card ${featured ? 'featured' : ''}`}><div className="department-card-top"><span className="department-tag"><Building2 size={13} />{groupLabel(getGroup(department))}</span><span className="popular-label">★ Phổ biến</span></div><h3>{department.name}</h3><p>{department.description || 'Đơn vị hỗ trợ và cung cấp dịch vụ sinh viên.'}</p><DepartmentMeta department={department} /><div className="department-actions">{department.phone && <a className="btn btn-outline btn-sm" href={`tel:${department.phone.replace(/[^\d+]/g, '')}`}><Phone size={14} />Liên hệ</a>}<Link className="btn btn-primary btn-sm" to={`/phong-ban/${department.slug}`}>Xem chi tiết <ArrowRight size={14} /></Link></div></article>;
}

function DepartmentRow({ department }) {
    return <article className="department-row"><div className="department-row-icon"><Building2 size={21} /></div><div className="department-row-main"><span className="department-tag">{groupLabel(getGroup(department))}</span><h3>{department.name}</h3><div className="department-row-meta"><span><MapPin size={14} />{department.address || 'Cơ sở chính HUMG'}</span>{department.phone && <span><Phone size={14} />{department.phone}</span>}</div></div><div className="department-service-count"><Wrench size={16} /><strong>{department._count?.services || 0}</strong><span>Dịch vụ trực tuyến</span></div><Link className="btn btn-outline btn-sm" to={`/phong-ban/${department.slug}`}>Xem chi tiết <ArrowRight size={14} /></Link></article>;
}

function DepartmentMeta({ department }) {
    return <div className="department-card-meta"><span><MapPin size={14} />{department.address || 'Cơ sở chính HUMG'}</span>{department.phone && <span><Phone size={14} />{department.phone}</span>}<span><Wrench size={14} />{department._count?.services || 0} dịch vụ trực tuyến</span></div>;
}

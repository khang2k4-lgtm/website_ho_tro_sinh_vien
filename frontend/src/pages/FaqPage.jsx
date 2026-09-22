import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowRight, Bell, Check, ChevronDown, GraduationCap, HelpCircle, MessageCircleQuestion, Phone, Search, WalletCards } from 'lucide-react';
import './FaqPage.css';

const TOPICS = [
    { key: 'ALL', label: 'Tất cả', icon: HelpCircle },
    { key: 'DAO_TAO', label: 'Đăng ký học tập', icon: GraduationCap },
    { key: 'TAI_CHINH', label: 'Học phí & Học bổng', icon: WalletCards },
    { key: 'TAI_KHOAN', label: 'Tài khoản & Mật khẩu', icon: HelpCircle },
    { key: 'THU_TUC', label: 'Thủ tục SV', icon: Bell },
];

const SAMPLE_FAQS = [
    { id: 'faq-1', question: 'Tôi phải làm gì khi quên đăng ký tín chỉ đúng hạn?', answer: 'Sinh viên nộp đơn xin đăng ký bổ sung tại Phòng Đào tạo trong vòng 03 ngày kể từ khi hệ thống đóng. Đơn cần có xác nhận của cố vấn học tập và lý do chính đáng.', topic: 'DAO_TAO', views: 1200, helpful: 86, popular: true },
    { id: 'faq-2', question: 'Làm thế nào để nộp tiền học phí trực tuyến?', answer: 'Bạn có thể chuyển khoản theo mã định danh sinh viên qua ngân hàng BIDV hoặc thanh toán trực tiếp trên ứng dụng ngân hàng số. Kiểm tra công nợ trước khi thanh toán.', topic: 'TAI_CHINH', views: 980, helpful: 74, popular: true },
    { id: 'faq-3', question: 'Quy trình xin tạm hoãn học tập (bảo lưu kết quả) như thế nào?', answer: 'Sinh viên chuẩn bị đơn xin tạm hoãn học tập, giấy tờ minh chứng và nộp tại Phòng Công tác Sinh viên. Hồ sơ được tiếp nhận trong giờ hành chính.', topic: 'THU_TUC', views: 640, helpful: 51 },
    { id: 'faq-4', question: 'Điều kiện để đăng ký học cải thiện hoặc học nâng điểm là gì?', answer: 'Sinh viên được đăng ký học lại đối với học phần có điểm D, D+ hoặc F trong đợt đăng ký tín chỉ đầu mỗi học kỳ. Điểm mới sẽ thay thế điểm cũ trong tính điểm tích lũy.', topic: 'DAO_TAO', views: 510, helpful: 45 },
    { id: 'faq-5', question: 'Hướng dẫn làm thủ tục miễn giảm học phí cho đối tượng chính sách?', answer: 'Sinh viên điền mẫu đề nghị, đính kèm giấy tờ chứng minh đối tượng chính sách và nộp theo thông báo của Phòng Công tác Sinh viên trong thời hạn quy định.', topic: 'TAI_CHINH', views: 430, helpful: 38 },
    { id: 'faq-6', question: 'Quên mật khẩu trang Đăng ký học tập thì khôi phục ở đâu?', answer: 'Chọn Quên mật khẩu tại trang đăng nhập, nhập email sinh viên để nhận liên kết khôi phục. Nếu không nhận được email, liên hệ Trung tâm CNTT để được hỗ trợ.', topic: 'TAI_KHOAN', views: 390, helpful: 32 },
    { id: 'faq-7', question: 'Xin cấp giấy xác nhận là sinh viên vay vốn ngân hàng ở đâu?', answer: 'Sinh viên gửi yêu cầu trực tuyến tại mục Dịch vụ sinh viên hoặc liên hệ bộ phận một cửa của Phòng Công tác Sinh viên.', topic: 'THU_TUC', views: 280, helpful: 24 },
];

function inferTopic(item) {
    if (item.topic) return item.topic;
    const text = `${item.question} ${item.answer}`.toLowerCase();
    if (text.includes('học phí') || text.includes('học bổng') || text.includes('miễn giảm')) return 'TAI_CHINH';
    if (text.includes('mật khẩu') || text.includes('tài khoản')) return 'TAI_KHOAN';
    if (text.includes('đăng ký') || text.includes('học tập') || text.includes('tín chỉ')) return 'DAO_TAO';
    return 'THU_TUC';
}

function topicLabel(key) {
    return TOPICS.find((topic) => topic.key === key)?.label || 'Thủ tục SV';
}

export default function FaqPage() {
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState('');
    const [topic, setTopic] = useState('ALL');
    const [openId, setOpenId] = useState(null);
    const [votes, setVotes] = useState({});

    useEffect(() => {
        const params = search ? `?search=${encodeURIComponent(search)}` : '';
        api.get(`/faqs${params}`).then((response) => setItems(response.data.length ? response.data : SAMPLE_FAQS)).catch(() => setItems(SAMPLE_FAQS));
    }, [search]);

    const filteredItems = useMemo(() => items.filter((item) => topic === 'ALL' || inferTopic(item) === topic), [items, topic]);
    const markedPopular = filteredItems.filter((item) => item.popular).slice(0, 2);
    const popularItems = markedPopular.length ? markedPopular : filteredItems.slice(0, 2);
    const listItems = filteredItems.filter((item) => !popularItems.some((popular) => popular.id === item.id));

    const vote = (id, value) => setVotes((current) => ({ ...current, [id]: value }));

    return (
        <>
            <section className="faq-hero">
                <div className="container faq-hero-inner">
                    <div className="faq-hero-icon"><HelpCircle size={29} /></div>
                    <div className="page-kicker">Trung tâm giải đáp HUMG</div>
                    <h1 className="page-title">Câu hỏi thường gặp & trợ giúp</h1>
                    <p className="page-subtitle">Giải đáp nhanh các thắc mắc về đăng ký học tập, học phí, thủ tục hành chính và BHYT.</p>
                    <form className="faq-search" onSubmit={(event) => event.preventDefault()}>
                        <Search size={20} />
                        <input aria-label="Tìm câu hỏi" placeholder="Nhập câu hỏi: rút học phần, quên mật khẩu, BHYT..." value={search} onChange={(event) => setSearch(event.target.value)} />
                        <button className="btn btn-primary" type="submit"><Search size={16} />Tìm kiếm</button>
                    </form>
                </div>
            </section>

            <main className="container page-content faq-page">
                <div className="faq-topics" role="tablist" aria-label="Chủ đề câu hỏi">
                    {TOPICS.map(({ key, label, icon: Icon }) => <button key={key} className={`faq-topic ${topic === key ? 'active' : ''}`} type="button" onClick={() => setTopic(key)}><Icon size={16} />{label}</button>)}
                </div>

                {popularItems.length > 0 && <section className="faq-section"><div className="faq-section-heading"><div><span className="faq-kicker">Được sinh viên quan tâm</span><h2><Bell size={19} /> Câu hỏi phổ biến nhất</h2></div><span>{popularItems.length} câu hỏi</span></div><div className="popular-faq-grid">{popularItems.map((item) => <PopularFaq key={item.id} item={item} />)}</div></section>}

                <section className="faq-section"><div className="faq-section-heading"><div><span className="faq-kicker">Tra cứu theo từng vấn đề</span><h2><MessageCircleQuestion size={19} /> Danh sách câu hỏi giải đáp</h2></div><span>{filteredItems.length} câu hỏi</span></div><div className="faq-list">{listItems.map((item, index) => { const isOpen = (openId || listItems[0]?.id) === item.id; return <article className={`faq-item ${isOpen ? 'open' : ''}`} key={item.id}><button className="faq-question" type="button" aria-expanded={isOpen} onClick={() => setOpenId(isOpen ? '__none__' : item.id)}><span className="faq-question-topic">{topicLabel(inferTopic(item))}</span><strong>{index + 1}. {item.question}</strong><span className="faq-toggle">{isOpen ? <ChevronDown size={18} /> : <ArrowRight size={18} />}</span></button>{isOpen && <div className="faq-answer"><p><strong>Trả lời:</strong> {item.answer}</p><div className="faq-feedback"><span>Câu trả lời này có hữu ích không?</span><button className={votes[item.id] === 'yes' ? 'selected' : ''} type="button" onClick={() => vote(item.id, 'yes')}><Check size={14} /> Có {item.helpful ? `(${item.helpful + (votes[item.id] === 'yes' ? 1 : 0)})` : ''}</button><button className={votes[item.id] === 'no' ? 'selected no' : ''} type="button" onClick={() => vote(item.id, 'no')}>Không</button></div></div>}</article>; })}{filteredItems.length === 0 && <div className="card"><div className="empty-state">Không tìm thấy câu hỏi phù hợp.</div></div>}</div></section>

                <section className="faq-support"><div className="faq-support-icon"><MessageCircleQuestion size={24} /></div><div><span className="faq-kicker">Cần hỗ trợ thêm?</span><h2>Gửi câu hỏi trực tiếp cho nhà trường</h2><p>Nếu chưa tìm thấy câu trả lời phù hợp, đội ngũ hỗ trợ sẽ tiếp nhận và phản hồi cho bạn.</p></div><div className="faq-support-actions"><Link className="btn btn-primary" to="/hoi-dap"><MessageCircleQuestion size={16} />Gửi câu hỏi mới</Link><a className="btn btn-outline" href="tel:02438389633"><Phone size={16} />024 3838 9633</a></div></section>
            </main>
        </>
    );
}

function PopularFaq({ item }) {
    return <Link className="popular-faq" to={`/faq#${item.id}`}><div className="popular-faq-top"><span className="faq-label">{topicLabel(inferTopic(item))}</span><span className="popular-label">🔥 Phổ biến</span></div><h3>Q: {item.question}</h3><p>A: {item.answer}</p><div className="popular-faq-bottom"><span>◉ {item.views?.toLocaleString('vi-VN') || 0} lượt xem</span><span>Xem câu trả lời <ArrowRight size={15} /></span></div></Link>;
}

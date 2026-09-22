import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { formatDate } from '../utils/constants';
import { ArrowRight, CheckCircle2, Clock3, HelpCircle, MessageCircle, Paperclip, Plus, Search, Send, UserRound, Users } from 'lucide-react';
import './QnAPage.css';

const SAMPLE_QUESTIONS = [
    { id: 'question-1', title: 'Thủ tục xin bảo lưu học tập cần những giấy tờ gì?', content: 'Em muốn xin bảo lưu kết quả học tập thì cần chuẩn bị những giấy tờ nào và nộp ở đâu?', isResolved: true, author: { fullName: 'Nguyễn Văn A' }, _count: { answers: 1 }, createdAt: '2026-08-30T01:59:00', department: 'Phòng Đào tạo' },
    { id: 'question-2', title: 'Hạn nộp học phí học kỳ I là khi nào?', content: 'Cho em hỏi thời hạn nộp học phí học kỳ I và cách tra cứu công nợ trên cổng sinh viên.', isResolved: false, author: { fullName: 'Trần Thị B' }, _count: { answers: 0 }, createdAt: '2026-09-08T10:15:00', department: 'Phòng Tài chính' },
    { id: 'question-3', title: 'Đăng ký cấp giấy xác nhận sinh viên trực tuyến mất bao lâu?', content: 'Em đã gửi yêu cầu cấp giấy xác nhận sinh viên, thời gian xử lý dự kiến là bao lâu ạ?', isResolved: true, author: { fullName: 'Lê Văn C' }, _count: { answers: 2 }, createdAt: '2026-09-05T15:30:00', department: 'Phòng CTSV' },
];

const SAMPLE_DEPARTMENTS = [
    { id: 'dept-1', name: 'Phòng Đào tạo Đại học' },
    { id: 'dept-2', name: 'Phòng Tài chính - Kế toán' },
    { id: 'dept-3', name: 'Phòng Công tác Sinh viên' },
    { id: 'dept-4', name: 'Trung tâm Công nghệ Thông tin' },
];

const FILTERS = [
    { key: 'ALL', label: 'Tất cả', icon: Users },
    { key: 'MINE', label: 'Câu hỏi của tôi', icon: UserRound },
    { key: 'OPEN', label: 'Chờ trả lời', icon: Clock3 },
    { key: 'RESOLVED', label: 'Đã trả lời', icon: CheckCircle2 },
];

export default function QnAPage() {
    const { user } = useAuth();
    const [items, setItems] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [form, setForm] = useState({ title: '', content: '', departmentId: '' });
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('ALL');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    const load = () => api.get('/questions').then((response) => setItems(response.data.length ? response.data : SAMPLE_QUESTIONS)).catch(() => setItems(SAMPLE_QUESTIONS));

    useEffect(() => {
        Promise.all([
            load(),
            api.get('/departments').then((response) => setDepartments(response.data.length ? response.data : SAMPLE_DEPARTMENTS)).catch(() => setDepartments(SAMPLE_DEPARTMENTS)),
        ]).finally(() => setLoading(false));
    }, []);

    const submit = async (event) => {
        event.preventDefault();
        setError('');
        setSending(true);
        try {
            await api.post('/questions', { title: form.title, content: form.content });
            setForm({ title: '', content: '', departmentId: '' });
            await load();
        } catch (err) {
            setError(err.response?.data?.message || 'Không gửi được câu hỏi. Vui lòng thử lại.');
        } finally {
            setSending(false);
        }
    };

    const filteredItems = useMemo(() => items.filter((item) => {
        const haystack = `${item.title} ${item.content} ${item.department || ''}`.toLowerCase();
        const matchesSearch = haystack.includes(search.toLowerCase());
        const matchesFilter = filter === 'ALL' || (filter === 'MINE' && item.author?.id === user?.id) || (filter === 'OPEN' && !item.isResolved) || (filter === 'RESOLVED' && item.isResolved);
        return matchesSearch && matchesFilter;
    }), [items, search, filter, user]);

    return (
        <>
            <section className="qna-hero">
                <div className="container qna-hero-inner">
                    <div className="qna-hero-icon"><HelpCircle size={29} /></div>
                    <div className="page-kicker">Kết nối cùng phòng ban HUMG</div>
                    <h1 className="page-title">Hỏi đáp & hỗ trợ</h1>
                    <p className="page-subtitle">Gửi câu hỏi trực tiếp đến các phòng ban chuyên trách và theo dõi câu trả lời tại một nơi.</p>
                    <form className="qna-search" onSubmit={(event) => event.preventDefault()}><Search size={20} /><input aria-label="Tìm kiếm câu hỏi" placeholder="Tìm câu hỏi: bảo lưu, học phí, đăng ký học phần..." value={search} onChange={(event) => setSearch(event.target.value)} /><button className="btn btn-primary" type="submit"><Search size={16} />Tìm kiếm</button></form>
                </div>
            </section>

            <main className="container page-content qna-page">
                <div className="qna-filters" role="tablist" aria-label="Lọc câu hỏi">{FILTERS.map(({ key, label, icon: Icon }) => <button key={key} className={`qna-filter ${filter === key ? 'active' : ''}`} type="button" onClick={() => setFilter(key)}><Icon size={16} />{label}{key === 'ALL' && <span>{items.length}</span>}</button>)}</div>

                {user?.role === 'STUDENT' && <form className="question-form" onSubmit={submit}><div className="question-form-heading"><div className="question-form-icon"><Plus size={20} /></div><div><span className="qna-kicker">Bắt đầu cuộc trao đổi</span><h2>Đặt câu hỏi mới</h2><p>Chọn phòng ban phù hợp để nhận phản hồi nhanh hơn.</p></div></div>{error && <div className="qna-error">{error}</div>}<div className="question-form-grid"><div className="form-group"><label className="label" htmlFor="department">Phòng ban tiếp nhận <span>*</span></label><select id="department" className="select" value={form.departmentId} onChange={(event) => setForm({ ...form, departmentId: event.target.value })} required><option value="">Chọn phòng ban tiếp nhận câu hỏi...</option>{departments.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}</select></div><div className="form-group"><label className="label" htmlFor="question-title">Tiêu đề câu hỏi <span>*</span></label><input id="question-title" className="input" placeholder="Ví dụ: Thủ tục xin bảo lưu học tập cần giấy tờ gì?" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required /></div><div className="form-group form-full"><label className="label" htmlFor="question-content">Nội dung chi tiết <span>*</span></label><textarea id="question-content" className="textarea" placeholder="Mô tả chi tiết thắc mắc để phòng ban hỗ trợ chính xác nhất..." value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} required /></div></div><div className="question-form-footer"><span className="attachment-note"><Paperclip size={16} />Có thể đính kèm minh chứng ở bước trao đổi chi tiết</span><button className="btn btn-primary" type="submit" disabled={sending}><Send size={16} />{sending ? 'Đang gửi...' : 'Gửi câu hỏi'}</button></div></form>}

                <section className="qna-section"><div className="qna-section-heading"><div><span className="qna-kicker">Trao đổi mới nhất</span><h2><MessageCircle size={19} /> Danh sách câu hỏi</h2></div><span>{filteredItems.length} câu hỏi</span></div>{loading ? <div className="loading">Đang tải câu hỏi...</div> : <div className="question-list">{filteredItems.map((question) => <QuestionCard key={question.id} question={question} />)}{filteredItems.length === 0 && <div className="card"><div className="empty-state">Không tìm thấy câu hỏi phù hợp.</div></div>}</div>}</section>
            </main>
        </>
    );
}

function QuestionCard({ question }) {
    return <article className="question-card"><div className="question-card-top"><span className="question-department"><HelpCircle size={14} />{question.department || 'Phòng ban chuyên trách'}</span><span className={`question-status ${question.isResolved ? 'resolved' : 'pending'}`}>{question.isResolved ? <><CheckCircle2 size={14} /> Đã trả lời</> : <><Clock3 size={14} /> Đang xử lý</>}</span></div><h3>{question.title}</h3><div className="question-meta"><span><UserRound size={14} />{question.author?.fullName || 'Sinh viên'}</span><span><MessageCircle size={14} />{question._count?.answers || 0} trả lời</span><span><Clock3 size={14} />{formatDate(question.createdAt)}</span></div><Link className="question-link" to={`/hoi-dap/${question.id}`}>{question.isResolved ? 'Xem câu trả lời' : 'Xem chi tiết'} <ArrowRight size={15} /></Link></article>;
}

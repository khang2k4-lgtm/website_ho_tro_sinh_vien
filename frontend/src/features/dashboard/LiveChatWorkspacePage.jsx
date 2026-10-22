import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRightLeft,
  Bell,
  Check,
  CheckCircle2,
  Clock3,
  FileText,
  MessageCircle,
  MessageSquareText,
  Paperclip,
  Search,
  Send,
  Smile,
  StickyNote,
  Ticket,
  UserRound,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import './LiveChatWorkspacePage.css';

const INITIAL_TRANSFER_NOTE = 'Sinh viên đã nộp file xác nhận y tế, nhờ chuyên viên kiểm tra đối chiếu giúp.';

const STATUS_LABELS = {
  active: 'Đang chat',
  waiting: 'Chờ trả lời',
  completed: 'Hoàn tất',
  transferred: 'Đã chuyển',
};

function formatTime(value = new Date()) {
  return new Intl.DateTimeFormat('vi-VN', { hour: '2-digit', minute: '2-digit' }).format(new Date(value));
}

function downloadChatLog(chat) {
  const content = [
    `LỊCH SỬ CHAT ${chat.code}`,
    `Sinh viên: ${chat.student} (${chat.studentId})`,
    `Chủ đề: ${chat.topic}`,
    '',
    ...chat.messages.map((message) => `[${formatTime(message.createdAt)}] ${message.sender.role === 'STUDENT' ? 'Sinh viên' : 'Cán bộ'}: ${message.content}`),
  ].join('\n');
  const url = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `lich-su-chat-${chat.id.toLowerCase()}-demo.txt`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function LiveChatWorkspacePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedId = searchParams.get('conversation');
  const [chats, setChats] = useState([]);
  const [selectedId, setSelectedId] = useState(requestedId || '');
  const [staffDirectory, setStaffDirectory] = useState([]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [messageDraft, setMessageDraft] = useState('');
  const [availability, setAvailability] = useState('online');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [modal, setModal] = useState(null);
  const [transferAssigneeId, setTransferAssigneeId] = useState('');
  const [transferNote, setTransferNote] = useState(INITIAL_TRANSFER_NOTE);
  const [noteDraft, setNoteDraft] = useState('');
  const [internalNotes, setInternalNotes] = useState({});
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const knownMessageIds = useRef(null);

  const selectedChat = chats.find((chat) => chat.id === selectedId);
  const filteredChats = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase('vi');
    return chats.filter((chat) => {
      const matchesQuery = !needle || `${chat.studentName} ${chat.studentId} ${chat.code} ${chat.topic}`.toLocaleLowerCase('vi').includes(needle);
      return matchesQuery && (filter === 'all' || (filter === 'chatting' ? chat.status === 'active' : chat.status === 'waiting'));
    });
  }, [chats, filter, query]);

  const showToast = useCallback((text) => {
    setToast(text);
    window.setTimeout(() => setToast(''), 3500);
  }, []);

  const refreshChats = useCallback(async () => {
    const response = await api.get('/live-chat');
    const nextChats = response.data.map((conversation) => ({
      ...conversation,
      code: conversation.code,
      studentName: conversation.student.fullName,
      studentId: conversation.student.studentId || 'Chưa cập nhật',
      className: conversation.student.className || 'Chưa cập nhật',
      phone: conversation.student.phone || 'Chưa cập nhật',
      email: conversation.student.email,
      departmentName: conversation.department?.name || 'Chưa phân phòng ban',
      messages: conversation.messages,
    }));
    const known = knownMessageIds.current;
    if (known) {
      const incoming = nextChats.flatMap((chat) => chat.messages)
        .filter((message) => message.sender.role === 'STUDENT' && !known.has(message.id));
      if (incoming.length) {
        const latestIncoming = incoming[incoming.length - 1];
        showToast(`Tin nhắn mới từ ${latestIncoming.sender.fullName}.`);
      }
    }
    knownMessageIds.current = new Set(nextChats.flatMap((chat) => chat.messages.map((message) => message.id)));
    setChats(nextChats);
    setSelectedId((current) => {
      if (requestedId && nextChats.some((chat) => chat.id === requestedId)) return requestedId;
      if (current && nextChats.some((chat) => chat.id === current)) return current;
      return nextChats[0]?.id || '';
    });
    setLoading(false);
    setError('');
  }, [requestedId, showToast]);

  useEffect(() => {
    let active = true;
    let timeout;
    const refresh = async () => {
      try {
        await refreshChats();
      } catch (requestError) {
        if (active) {
          setError(requestError.response?.data?.message || 'Không thể tải hội thoại. Đang thử kết nối lại...');
          setLoading(false);
        }
      } finally {
        if (active) timeout = window.setTimeout(refresh, 3000);
      }
    };
    refresh();
    api.get('/live-chat/staff')
      .then((response) => { if (active) setStaffDirectory(response.data); })
      .catch((requestError) => {
        if (active) setError(requestError.response?.data?.message || 'Không thể tải danh sách cán bộ nhận bàn giao.');
      });
    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, [refreshChats]);

  useEffect(() => {
    if (!selectedId) return;
    api.patch(`/live-chat/${selectedId}/read`)
      .catch((requestError) => {
        setError(requestError.response?.data?.message || 'Không thể cập nhật trạng thái thông báo chat.');
      });
  }, [selectedId]);

  const sendMessage = async (event) => {
    event.preventDefault();
    const content = messageDraft.trim();
    if (!content || !selectedChat) return;
    try {
      await api.post(`/live-chat/${selectedChat.id}/messages`, { content });
      setMessageDraft('');
      await refreshChats();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Không thể gửi tin nhắn. Vui lòng thử lại.');
    }
  };

  const transferChat = async (event) => {
    event.preventDefault();
    if (!transferNote.trim() || !selectedChat || !transferAssigneeId) return;
    const assignee = staffDirectory.find((staff) => staff.id === transferAssigneeId);
    try {
      await api.patch(`/live-chat/${selectedChat.id}/transfer`, {
        assignedToId: transferAssigneeId,
        departmentId: assignee?.department?.id || null,
        handoverNote: transferNote.trim(),
      });
      setModal(null);
      await refreshChats();
      showToast(`Đã bàn giao phiên ${selectedChat.code} cho ${assignee?.fullName || 'cán bộ phụ trách'}.`);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Không thể bàn giao phiên chat.');
    }
  };

  const saveInternalNote = (event) => {
    event.preventDefault();
    if (!noteDraft.trim()) return;
    if (selectedChat) setInternalNotes((current) => ({ ...current, [selectedChat.id]: noteDraft.trim() }));
    setModal(null);
    setNoteDraft('');
    showToast('Ghi chú nội bộ được lưu trong phiên làm việc này.');
  };

  const finishChat = async () => {
    if (!selectedChat) return;
    try {
      await api.patch(`/live-chat/${selectedChat.id}/close`);
      await refreshChats();
      showToast(`Đã kết thúc phiên ${selectedChat.code}.`);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Không thể kết thúc phiên chat.');
    }
  };

  const createTicket = () => showToast(`Tính năng tạo ticket cho ${selectedChat?.studentName} chưa được kết nối.`);

  const openTransfer = (chat = selectedChat) => {
    if (!chat) return;
    setSelectedId(chat.id);
    setTransferNote(INITIAL_TRANSFER_NOTE);
    setTransferAssigneeId(chat.assignedTo?.id || staffDirectory[0]?.id || '');
    setModal({ type: 'transfer', chatId: chat.id });
  };

  const selectChat = (chat) => {
    setSelectedId(chat.id);
    setSearchParams({ conversation: chat.id }, { replace: true });
  };

  const statusClass = (status) => `live-chat-status ${status}`;
  const onlineCount = chats.filter((chat) => chat.status === 'active' || chat.status === 'waiting').length;
  const transferCount = chats.filter((chat) => chat.status === 'transferred').length;
  const completedCount = chats.filter((chat) => chat.status === 'completed').length;

  return (
    <main className="dashboard-page live-chat-workspace">
      <header className="live-chat-page-header">
        <div>
          <Link className="live-chat-back" to="/dashboard"><ArrowLeft size={16} /> Quay lại Dashboard</Link>
          <span className="dashboard-kicker">HỖ TRỢ &amp; TƯ VẤN SINH VIÊN</span>
          <h1 className="page-title">Chat trực tiếp với sinh viên</h1>
          <p className="page-subtitle">Trao đổi nhanh, hỗ trợ giải đáp thắc mắc, chuyển tiếp chuyên viên và ghi nhận nội dung tư vấn.</p>
        </div>
        <div className="live-chat-header-actions">
          <label className="live-chat-availability">
            <span>Trạng thái trực</span>
            <select value={availability} onChange={(event) => setAvailability(event.target.value)}>
              <option value="online">Đang sẵn sàng (Online)</option>
              <option value="busy">Đang bận</option>
              <option value="offline">Ngoại tuyến</option>
            </select>
          </label>
          <button className="btn btn-outline" type="button" onClick={() => setSoundEnabled((enabled) => !enabled)}>
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            Âm thanh: {soundEnabled ? 'Bật' : 'Tắt'}
          </button>
        </div>
      </header>

      {error && <div className="live-chat-error" role="alert">{error}</div>}
      <div className="live-chat-demo-note"><MessageCircle size={16} /><span>Hội thoại được lưu trên hệ thống. Tin nhắn mới và thông báo tự cập nhật khoảng mỗi 3 giây.</span></div>

      <section className="live-chat-stats" aria-label="Thống kê chat">
        <article><span className="live-chat-stat-icon blue"><UserRound size={19} /></span><div><span>Đang hoạt động</span><strong>{onlineCount} <small>phiên</small></strong></div></article>
        <article><span className="live-chat-stat-icon amber"><MessageSquareText size={19} /></span><div><span>Cuộc trò chuyện</span><strong>{chats.length} <small>hội thoại</small></strong></div></article>
        <article><span className="live-chat-stat-icon cyan"><ArrowRightLeft size={19} /></span><div><span>Đã chuyển cấp</span><strong>{transferCount} <small>phiên</small></strong></div></article>
        <article><span className="live-chat-stat-icon green"><CheckCircle2 size={19} /></span><div><span>Đã hoàn tất</span><strong>{completedCount} <small>phiên</small></strong></div></article>
      </section>

      <section className="live-chat-workspace-grid" aria-label="Không gian chat trực tiếp">
        <aside className="live-chat-contact-panel">
          <div className="live-chat-panel-heading">
            <div><h2>Danh sách chat</h2><span>{filteredChats.length} hội thoại</span></div>
            <span className={`live-chat-presence ${availability}`} title={availability === 'online' ? 'Đang online' : availability === 'busy' ? 'Đang bận' : 'Ngoại tuyến'} />
          </div>
          <label className="live-chat-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm sinh viên, MSSV..." aria-label="Tìm sinh viên hoặc mã số" /></label>
          <div className="live-chat-filters" role="group" aria-label="Lọc hội thoại">
            <button type="button" className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>Tất cả</button>
            <button type="button" className={filter === 'chatting' ? 'active' : ''} onClick={() => setFilter('chatting')}>Đang chat</button>
            <button type="button" className={filter === 'waiting' ? 'active' : ''} onClick={() => setFilter('waiting')}>Chờ</button>
          </div>
          <div className="live-chat-contact-list">
            {filteredChats.map((chat) => {
              const latest = chat.messages.at(-1);
              return (
                <button key={chat.id} type="button" className={`live-chat-contact ${selectedId === chat.id ? 'selected' : ''}`} onClick={() => selectChat(chat)}>
                  <span className={`live-chat-avatar ${chat.status}`} aria-hidden="true">{chat.studentName.charAt(0)}</span>
                  <span className="live-chat-contact-copy">
                    <span className="live-chat-contact-top"><strong>{chat.studentName}</strong><time>{formatTime(latest?.createdAt)}</time></span>
                    <span className="live-chat-contact-preview">{latest?.content}</span>
                    <span className={statusClass(chat.status)}>{STATUS_LABELS[chat.status]}</span>
                  </span>
                </button>
              );
            })}
            {filteredChats.length === 0 && <p className="live-chat-no-results">Không có hội thoại phù hợp.</p>}
          </div>
        </aside>

        {selectedChat ? <section className="live-chat-conversation-panel">
          <header className="live-chat-conversation-header">
            <div className="live-chat-person">
              <span className={`live-chat-avatar large ${selectedChat.status}`}>{selectedChat.studentName.charAt(0)}</span>
              <div><h2>{selectedChat.studentName}</h2><p>MSSV: {selectedChat.studentId} <span className="live-chat-inline-presence" /> {selectedChat.status === 'completed' ? 'Đã kết thúc' : 'Đang hoạt động'}</p></div>
            </div>
            <div className="live-chat-topic"><span>Chủ đề</span><strong>{selectedChat.topic}</strong></div>
          </header>
          <div className="live-chat-messages" aria-live="polite">
            <div className="live-chat-day-divider"><span>Hôm nay · 23/10/2026</span></div>
            {selectedChat.messages.map((message) => (
              <article key={message.id} className={`live-chat-message ${message.sender.role === 'STUDENT' ? 'student' : 'staff'}`}>
                <div className="live-chat-message-bubble">{message.content}</div>
                <time>{formatTime(message.createdAt)} · {message.sender.role === 'STUDENT' ? 'Sinh viên' : message.sender.fullName}</time>
              </article>
            ))}
            {selectedChat.status === 'transferred' && <div className="live-chat-inline-note"><ArrowRightLeft size={14} /><span>Phiên đã được bàn giao {selectedChat.assignedTo ? `cho ${selectedChat.assignedTo.fullName}` : 'tới bộ phận chuyên môn'}.</span></div>}
          </div>
          <form className="live-chat-composer" onSubmit={sendMessage}>
            <div className="live-chat-composer-tools">
              <button type="button" aria-label="Đính kèm file" onClick={() => showToast('Tính năng đính kèm tệp chưa được hỗ trợ trong chat trực tiếp.')}><Paperclip size={17} /></button>
              <button type="button" aria-label="Chèn biểu tượng cảm xúc" onClick={() => setMessageDraft((draft) => `${draft}${draft ? ' ' : ''}🙂`)}><Smile size={17} /></button>
              <span>Tin nhắn sẽ được lưu và gửi thông báo cho sinh viên.</span>
            </div>
            <div className="live-chat-composer-input">
              <textarea value={messageDraft} onChange={(event) => setMessageDraft(event.target.value)} placeholder="Nhập tin nhắn phản hồi cho sinh viên..." aria-label="Nội dung tin nhắn" rows={2} disabled={selectedChat.status === 'completed'} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); event.currentTarget.form.requestSubmit(); } }} />
              <button className="btn btn-primary" type="submit" disabled={!messageDraft.trim() || selectedChat.status === 'completed'}><Send size={15} /> Gửi</button>
            </div>
            <div className="live-chat-conversation-actions">
              <button className="btn btn-outline" type="button" onClick={() => openTransfer()}><ArrowRightLeft size={15} /> Chuyển cấp</button>
              {selectedChat.status !== 'completed' && <button className="btn btn-outline" type="button" onClick={finishChat}><Check size={15} /> Kết thúc chat</button>}
            </div>
          </form>
        </section> : <div className="live-chat-no-selection">{loading ? 'Đang tải hội thoại...' : 'Chưa có hội thoại. Sinh viên có thể bắt đầu chat từ trang hỗ trợ sinh viên.'}</div>}

        {selectedChat && <aside className="live-chat-student-panel">
          <section className="live-chat-student-card">
            <h2><UserRound size={17} /> Thông tin sinh viên</h2>
            <div className="live-chat-student-identity"><span className="live-chat-avatar large">{selectedChat.studentName.charAt(0)}</span><strong>{selectedChat.studentName}</strong></div>
            <dl>
              <div><dt>MSSV</dt><dd>{selectedChat.studentId}</dd></div>
              <div><dt>Lớp</dt><dd>{selectedChat.className}</dd></div>
              <div><dt>Số điện thoại</dt><dd>{selectedChat.phone}</dd></div>
              <div><dt>Email</dt><dd>{selectedChat.email}</dd></div>
            </dl>
          </section>
          <section className="live-chat-related-card">
            <h2><FileText size={17} /> Thông tin cuộc chat</h2>
            <div className="live-chat-related-application">
              <strong>{selectedChat.code}</strong><span>{STATUS_LABELS[selectedChat.status]}</span>
            </div>
            <small>{selectedChat.departmentName}</small>
          </section>
          {(selectedChat.handoverNote || internalNotes[selectedChat.id]) && <div className="live-chat-inline-note"><StickyNote size={14} /><span>Ghi chú nội bộ: {selectedChat.handoverNote || internalNotes[selectedChat.id]}</span></div>}
          <section className="live-chat-quick-actions">
            <h2>Thao tác nhanh</h2>
            <button type="button" onClick={() => { setNoteDraft(internalNotes[selectedChat.id] || ''); setModal({ type: 'note' }); }}><StickyNote size={15} /> Ghi chú nội bộ</button>
            <button type="button" onClick={createTicket}><Ticket size={15} /> Tạo ticket</button>
          </section>
          <div className="live-chat-compliance"><Bell size={15} /><span>Chỉ ghi nhận nội dung cần thiết để hỗ trợ sinh viên.</span></div>
        </aside>}
      </section>

      <section className="live-chat-recent-panel">
        <div className="live-chat-recent-heading"><div><h2>Lịch sử các cuộc chat gần đây</h2><p>Theo dõi tiến độ và trạng thái hỗ trợ sinh viên.</p></div><button className="btn btn-outline" type="button" disabled={!selectedChat} onClick={() => selectedChat && downloadChatLog(selectedChat)}><FileText size={15} /> Xuất log đang chọn</button></div>
        <div className="live-chat-table-scroll">
          <table className="live-chat-table">
            <thead><tr><th>Mã chat</th><th>Sinh viên &amp; MSSV</th><th>Chủ đề tư vấn / dịch vụ</th><th>Thời gian</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
            <tbody>
              {chats.slice(0, 3).map((chat) => (
                <tr key={chat.id}>
                  <td><strong>{chat.code}</strong></td>
                  <td><strong>{chat.studentName}</strong><small>{chat.studentId}</small></td>
                  <td><strong>{chat.topic}</strong><small>({chat.departmentName})</small></td>
                  <td>{formatTime(chat.messages.at(-1)?.createdAt)}</td>
                  <td><span className={statusClass(chat.status)}>{STATUS_LABELS[chat.status]}</span></td>
                  <td><div className="live-chat-table-actions"><button type="button" onClick={() => selectChat(chat)}><MessageSquareText size={14} /> Mở chat</button>{chat.status === 'completed' ? <button type="button" onClick={() => downloadChatLog(chat)}><FileText size={14} /> Xuất log</button> : chat.status === 'waiting' ? <button type="button" onClick={() => showToast(`Phiên ${chat.code} đang chờ cán bộ phản hồi sinh viên.`)}><Clock3 size={14} /> Chờ</button> : <button type="button" onClick={() => openTransfer(chat)}><ArrowRightLeft size={14} /> Chuyển</button>}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {modal && (
        <div className="live-chat-modal-backdrop" onClick={() => setModal(null)}>
          <section className="live-chat-modal" role="dialog" aria-modal="true" aria-labelledby="live-chat-modal-title" onClick={(event) => event.stopPropagation()}>
            <header className="live-chat-modal-header">
              <div><span className="dashboard-kicker">{modal.type === 'transfer' ? `BÀN GIAO PHIÊN ${selectedChat.code}` : `GHI CHÚ PHIÊN ${selectedChat.code}`}</span><h2 id="live-chat-modal-title">{modal.type === 'transfer' ? `Chuyển phiên chat #${selectedChat.code}` : 'Ghi chú nội bộ'}</h2><p>{selectedChat.studentName} · MSSV {selectedChat.studentId}</p></div>
              <button type="button" className="live-chat-modal-close" aria-label="Đóng" onClick={() => setModal(null)}><X size={19} /></button>
            </header>
            {modal.type === 'transfer' ? (
              <form className="live-chat-modal-body" onSubmit={transferChat}>
                <div className="live-chat-demo-note compact"><ArrowRightLeft size={15} /><span>Bàn giao sẽ gán phiên cho cán bộ đã chọn và thông báo cho sinh viên.</span></div>
                <label><span>Chuyên viên tiếp nhận</span><select required value={transferAssigneeId} onChange={(event) => setTransferAssigneeId(event.target.value)}><option value="">Chọn cán bộ</option>{staffDirectory.map((staff) => <option value={staff.id} key={staff.id}>{staff.fullName}{staff.department?.name ? ` · ${staff.department.name}` : ''}</option>)}</select></label>
                <label><span>Nội dung ghi chú bàn giao</span><textarea required value={transferNote} onChange={(event) => setTransferNote(event.target.value)} rows={4} /></label>
                <footer><button className="btn btn-outline" type="button" onClick={() => setModal(null)}>Hủy bỏ</button><button className="btn btn-primary" type="submit" disabled={!transferAssigneeId}><ArrowRightLeft size={15} /> Xác nhận chuyển</button></footer>
              </form>
            ) : (
              <form className="live-chat-modal-body" onSubmit={saveInternalNote}>
                <div className="live-chat-demo-note compact"><StickyNote size={15} /><span>Ghi chú chỉ tồn tại trong phiên giao diện hiện tại; chưa được lưu vào cơ sở dữ liệu.</span></div>
                <label><span>Nội dung ghi chú</span><textarea required value={noteDraft} onChange={(event) => setNoteDraft(event.target.value)} rows={5} placeholder="Ghi nhận nội dung cần lưu ý cho cán bộ..." /></label>
                <footer><button className="btn btn-outline" type="button" onClick={() => setModal(null)}>Hủy bỏ</button><button className="btn btn-primary" type="submit"><Check size={15} /> Lưu ghi chú</button></footer>
              </form>
            )}
          </section>
        </div>
      )}

      {toast && <div className="live-chat-toast" role="status"><CheckCircle2 size={17} />{toast}</div>}
    </main>
  );
}

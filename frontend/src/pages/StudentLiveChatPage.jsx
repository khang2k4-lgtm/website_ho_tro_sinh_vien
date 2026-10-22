import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  MessageCircle,
  MessageSquareText,
  Plus,
  RefreshCw,
  Send,
  UserRound,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './StudentLiveChatPage.css';

function formatTime(value) {
  if (!value) return '';
  return new Intl.DateTimeFormat('vi-VN', { hour: '2-digit', minute: '2-digit' }).format(new Date(value));
}

function statusLabel(status) {
  if (status === 'completed') return 'Đã kết thúc';
  if (status === 'transferred') return 'Đang chuyển chuyên viên';
  if (status === 'waiting') return 'Đang chờ phản hồi';
  return 'Đang hỗ trợ';
}

export default function StudentLiveChatPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedId = searchParams.get('conversation');
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(requestedId || '');
  const [messageDraft, setMessageDraft] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const messagesEndRef = useRef(null);
  const knownMessageIds = useRef(null);
  const selectedConversation = conversations.find((conversation) => conversation.id === selectedId);
  const selectedConversationId = selectedConversation?.id;

  const showToast = useCallback((text) => {
    setToast(text);
    window.setTimeout(() => setToast(''), 3500);
  }, []);

  const refreshConversations = useCallback(async () => {
    const response = await api.get('/live-chat');
    const next = response.data;
    const known = knownMessageIds.current;
    if (known) {
      const incoming = next.flatMap((conversation) => conversation.messages)
        .filter((message) => message.senderId !== user?.id && !known.has(message.id));
      if (incoming.length) {
        const latestIncoming = incoming[incoming.length - 1];
        showToast(`Bạn có tin nhắn mới từ ${latestIncoming.sender.fullName}.`);
      }
    }
    knownMessageIds.current = new Set(next.flatMap((conversation) => conversation.messages.map((message) => message.id)));
    setConversations(next);
    setLastUpdated(new Date());
    setError('');
    setSelectedId((current) => {
      if (requestedId && next.some((conversation) => conversation.id === requestedId)) return requestedId;
      if (current && next.some((conversation) => conversation.id === current)) return current;
      return next[0]?.id || '';
    });
    setLoading(false);
  }, [requestedId, showToast, user?.id]);

  useEffect(() => {
    let active = true;
    let timeout;
    const refresh = async () => {
      try {
        await refreshConversations();
      } catch (requestError) {
        if (active) {
          setError(requestError.response?.data?.message || 'Không thể kết nối dịch vụ chat. Đang thử kết nối lại...');
          setLoading(false);
        }
      } finally {
        if (active) timeout = window.setTimeout(refresh, 3000);
      }
    };
    refresh();
    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, [refreshConversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [selectedConversation?.messages.length]);

  useEffect(() => {
    if (!selectedConversationId) return;
    api.patch(`/live-chat/${selectedConversationId}/read`)
      .catch((requestError) => {
        setError(requestError.response?.data?.message || 'Không thể cập nhật trạng thái thông báo chat.');
      });
  }, [selectedConversationId]);

  const sortedConversations = useMemo(
    () => [...conversations].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)),
    [conversations],
  );

  const selectConversation = (conversation) => {
    setSelectedId(conversation.id);
    setSearchParams({ conversation: conversation.id }, { replace: true });
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    const content = messageDraft.trim();
    if (!content || !selectedConversation) return;
    setSending(true);
    setError('');
    try {
      await api.post(`/live-chat/${selectedConversation.id}/messages`, { content });
      setMessageDraft('');
      await refreshConversations();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Gửi tin nhắn chưa thành công. Vui lòng thử lại.');
    } finally {
      setSending(false);
    }
  };

  const startConversation = async (event) => {
    event.preventDefault();
    const topic = newTopic.trim();
    const content = newMessage.trim();
    if (!topic || !content) return;
    setSending(true);
    setError('');
    try {
      const response = await api.post('/live-chat', { topic, content });
      setNewTopic('');
      setNewMessage('');
      setShowNewConversation(false);
      setSelectedId(response.data.id);
      setSearchParams({ conversation: response.data.id }, { replace: true });
      await refreshConversations();
      showToast('Đã gửi yêu cầu chat. Nhân viên sẽ phản hồi tại cuộc trò chuyện này.');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Không thể tạo cuộc trò chuyện. Vui lòng thử lại.');
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="dashboard-page student-live-chat-page">
      <header className="student-chat-header">
        <div>
          <Link className="student-chat-back" to="/"><ArrowLeft size={16} /> Quay lại Trang chủ</Link>
          <span className="dashboard-kicker">HỖ TRỢ SINH VIÊN / CHAT TRỰC TIẾP</span>
          <h1 className="page-title">Chat với nhân viên hỗ trợ</h1>
          <p className="page-subtitle">Gửi câu hỏi và tiếp tục trao đổi tại đây. Tin nhắn mới sẽ tự cập nhật khi nhân viên phản hồi.</p>
        </div>
        <button className="btn btn-primary" type="button" onClick={() => setShowNewConversation((visible) => !visible)}>
          <Plus size={17} /> Tạo cuộc trò chuyện
        </button>
      </header>

      <div className="student-chat-realtime-note">
        <span className="student-chat-online-dot" />
        <span>Đồng bộ tin nhắn tự động mỗi vài giây</span>
        {lastUpdated && <small><RefreshCw size={12} /> Cập nhật lúc {formatTime(lastUpdated)}</small>}
      </div>

      {error && <div className="student-chat-error" role="alert">{error}</div>}

      {showNewConversation && (
        <section className="student-chat-new-panel">
          <div><h2>Bắt đầu cuộc trò chuyện</h2><p>Mô tả ngắn gọn chủ đề để nhân viên phụ trách hỗ trợ bạn.</p></div>
          <form onSubmit={startConversation}>
            <label><span>Chủ đề cần hỗ trợ</span><input maxLength={160} required value={newTopic} onChange={(event) => setNewTopic(event.target.value)} placeholder="Ví dụ: Hỏi thủ tục xin hoãn học" /></label>
            <label><span>Nội dung tin nhắn</span><textarea required maxLength={4000} rows={3} value={newMessage} onChange={(event) => setNewMessage(event.target.value)} placeholder="Nhập nội dung bạn cần tư vấn..." /></label>
            <div className="student-chat-form-actions"><button className="btn btn-outline" type="button" onClick={() => setShowNewConversation(false)}>Hủy</button><button className="btn btn-primary" type="submit" disabled={sending}><Send size={15} /> {sending ? 'Đang gửi...' : 'Gửi yêu cầu chat'}</button></div>
          </form>
        </section>
      )}

      <section className="student-chat-layout">
        <aside className="student-chat-list-panel">
          <div className="student-chat-panel-heading"><div><h2>Cuộc trò chuyện của tôi</h2><span>{conversations.length} hội thoại</span></div></div>
          {loading ? <div className="student-chat-empty"><RefreshCw size={18} /> Đang tải hội thoại...</div> : sortedConversations.length ? (
            <div className="student-chat-list">
              {sortedConversations.map((conversation) => {
                const latestMessage = conversation.messages.at(-1);
                return (
                  <button type="button" key={conversation.id} className={`student-chat-list-item ${selectedId === conversation.id ? 'selected' : ''}`} onClick={() => selectConversation(conversation)}>
                    <span className="student-chat-list-avatar"><MessageCircle size={17} /></span>
                    <span className="student-chat-list-copy">
                      <span className="student-chat-list-title"><strong>{conversation.topic}</strong><time>{formatTime(latestMessage?.createdAt)}</time></span>
                      <span className="student-chat-list-preview">{latestMessage?.senderId === user?.id ? 'Bạn: ' : ''}{latestMessage?.content}</span>
                      <span className={`student-chat-state ${conversation.status}`}>{statusLabel(conversation.status)}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="student-chat-empty"><MessageSquareText size={22} /><p>Bạn chưa có cuộc trò chuyện nào.</p><span>Tạo cuộc trò chuyện mới để được nhân viên hỗ trợ.</span><button className="btn btn-outline" type="button" onClick={() => setShowNewConversation(true)}><Plus size={15} /> Bắt đầu chat</button></div>
          )}
        </aside>

        <section className="student-chat-conversation">
          {selectedConversation ? (
            <>
              <header className="student-chat-conversation-header">
                <div className="student-chat-agent-avatar"><UserRound size={19} /></div>
                <div><h2>{selectedConversation.assignedTo?.fullName || 'Nhân viên hỗ trợ HUMG'}</h2><p><span className="student-chat-online-dot" />{statusLabel(selectedConversation.status)} · Mã {selectedConversation.code}</p></div>
                <span className={`student-chat-state ${selectedConversation.status}`}>{statusLabel(selectedConversation.status)}</span>
              </header>
              <div className="student-chat-topic"><span>Chủ đề</span><strong>{selectedConversation.topic}</strong>{selectedConversation.department && <small>{selectedConversation.department.name}</small>}</div>
              <div className="student-chat-messages" aria-live="polite">
                {selectedConversation.messages.map((message) => {
                  const mine = message.senderId === user?.id;
                  return (
                    <article key={message.id} className={`student-chat-message ${mine ? 'mine' : 'theirs'}`}>
                      <div className="student-chat-bubble">{message.content}</div>
                      <time>{formatTime(message.createdAt)} · {mine ? 'Bạn' : message.sender.fullName}</time>
                    </article>
                  );
                })}
                {selectedConversation.status === 'completed' && <div className="student-chat-ended"><CheckCircle2 size={16} /> Cuộc trò chuyện đã kết thúc. Nếu cần hỗ trợ thêm, hãy tạo cuộc trò chuyện mới.</div>}
                <div ref={messagesEndRef} />
              </div>
              <form className="student-chat-composer" onSubmit={sendMessage}>
                <textarea rows={2} maxLength={4000} value={messageDraft} onChange={(event) => setMessageDraft(event.target.value)} placeholder={selectedConversation.status === 'completed' ? 'Phiên chat đã kết thúc' : 'Nhập tin nhắn...'} aria-label="Nội dung tin nhắn" disabled={selectedConversation.status === 'completed' || sending} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); event.currentTarget.form.requestSubmit(); } }} />
                <button className="btn btn-primary" type="submit" disabled={!messageDraft.trim() || sending || selectedConversation.status === 'completed'}><Send size={16} /> Gửi</button>
                <small><Clock3 size={12} /> Enter để gửi · Shift + Enter để xuống dòng</small>
              </form>
            </>
          ) : (
            <div className="student-chat-empty student-chat-placeholder"><MessageCircle size={30} /><h2>Chọn một cuộc trò chuyện</h2><p>Tin nhắn sẽ được cập nhật tự động khi nhân viên phản hồi.</p><button className="btn btn-primary" type="button" onClick={() => setShowNewConversation(true)}><Plus size={15} /> Tạo cuộc trò chuyện</button></div>
          )}
        </section>
      </section>

      {toast && <div className="student-chat-toast" role="status"><CheckCircle2 size={17} />{toast}</div>}
    </main>
  );
}

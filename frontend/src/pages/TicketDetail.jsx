import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { TICKET_STATUS, formatDate } from '../utils/constants';

export default function TicketDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [message, setMessage] = useState('');

  const load = useCallback(
    () => api.get(`/tickets/${id}`).then((r) => setTicket(r.data)).catch(() => setTicket(null)),
    [id],
  );

  useEffect(() => { load(); }, [load]);

  const send = async (e) => {
    e.preventDefault();
    await api.post(`/tickets/${id}/messages`, { content: message });
    setMessage('');
    load();
  };

  if (!ticket) return <div className="container loading">Đang tải...</div>;

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: 800 }}>
      <h1 className="page-title">{ticket.title}</h1>
      <p className="page-subtitle">{ticket.code} · {ticket.student?.fullName}</p>
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="card-body">
          <p><strong>Trạng thái:</strong> <span className={`badge ${TICKET_STATUS[ticket.status]?.class}`}>{TICKET_STATUS[ticket.status]?.label}</span></p>
          <p style={{ whiteSpace: 'pre-line', marginTop: '1rem' }}>{ticket.content}</p>
        </div>
      </div>
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="card-header">Trao đổi</div>
        <div className="card-body" style={{ display: 'grid', gap: '0.75rem' }}>
          {ticket.messages?.length === 0 && <div className="empty-state">Chưa có tin nhắn.</div>}
          {ticket.messages?.map((m) => (
            <div key={m.id} style={{ padding: '0.75rem 1rem', borderRadius: 10, background: m.senderId === user?.id ? '#ecfdf3' : '#f8fafc' }}>
              <strong>{m.sender?.fullName}</strong>
              <p style={{ marginTop: '0.25rem' }}>{m.content}</p>
              <small style={{ color: 'var(--text-muted)' }}>{formatDate(m.createdAt)}</small>
            </div>
          ))}
        </div>
      </div>
      {user && (
        <form className="card" onSubmit={send}>
          <div className="card-body">
            <textarea className="textarea" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Nhập tin nhắn..." required />
            <button className="btn btn-primary" style={{ marginTop: '1rem' }} type="submit">Gửi tin nhắn</button>
          </div>
        </form>
      )}
    </div>
  );
}

import { useMemo, useState } from 'react';
import { ArrowLeft, Building2, CalendarDays, Check, ChevronLeft, ChevronRight, Clock3, Plus, UserRound, Users, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import './StaffScheduleDetailPage.css';

const weekdays = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6'];
const shiftDays = [
  [
    { kind: 'shift', title: 'Trực Quầy 1', department: 'Bộ phận 1 cửa', appointments: 4 },
    null,
    { kind: 'shift', title: 'Trực Quầy 1', department: 'Bộ phận 1 cửa', appointments: 6 },
    null,
    { kind: 'shift', title: 'Trực Quầy 2', department: 'Phòng CTSV', appointments: 3 },
  ],
  [
    null,
    { kind: 'shift', title: 'Trực Quầy 2', department: 'Phòng Học vụ', appointments: 5 },
    null,
    { kind: 'meeting', title: 'Hẹn gặp nhóm', department: 'Sinh viên nợ môn · Phòng C201' },
    null,
  ],
];
const initialAppointments = [
  { time: '08:30', student: 'Lê Thị Mơ', purpose: 'Đăng ký học phần bổ sung', counter: 'Quầy số 1', status: '' },
  { time: '09:15', student: 'Nguyễn Văn Tâm', purpose: 'Nhận Giấy xác nhận SV', counter: 'Quầy số 1', status: '' },
  { time: '10:00', student: 'Phạm Thu Hà', purpose: 'Đối chiếu lệ phí cấp bằng', counter: 'Quầy số 1', status: '' },
];

function getWeekDates(offset) {
  const start = new Date(2026, 9, 20 + offset * 7);
  return Array.from({ length: 5 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  });
}

function getMonthDates(offset) {
  const monthStart = new Date(2026, 9 + offset, 1);
  const gridStart = new Date(monthStart);
  gridStart.setDate(1 - ((monthStart.getDay() + 6) % 7));
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    return date;
  });
}

function Metric({ icon: Icon, label, value, detail, tone }) {
  return (
    <article className="staff-schedule-metric">
      <span className={`staff-schedule-metric-icon ${tone}`}><Icon size={19} /></span>
      <div><span>{label}</span><strong>{value}</strong><small>{detail}</small></div>
    </article>
  );
}

function ActionModal({ type, onClose, onSubmit }) {
  const isShift = type === 'shift';
  return (
    <div className="staff-schedule-modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="staff-schedule-modal" role="dialog" aria-modal="true" aria-labelledby="staff-schedule-modal-title">
        <button className="staff-schedule-icon-button modal-close" type="button" onClick={onClose} aria-label="Đóng"><X size={18} /></button>
        <span className="staff-schedule-kicker">{isShift ? 'ĐIỀU PHỐI CA TRỰC' : 'LỊCH HẸN SINH VIÊN'}</span>
        <h2 id="staff-schedule-modal-title">{isShift ? 'Đăng ký đổi ca trực' : 'Tạo lịch hẹn mới'}</h2>
        <p>{isShift ? 'Gửi đề xuất đổi ca để quản lý phòng xem xét.' : 'Thêm lịch hẹn gặp sinh viên vào lịch làm việc.'} Đây là thao tác xem trước.</p>
        <form onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
          <label>Ngày<input type="date" required defaultValue="2026-10-20" /></label>
          {isShift ? (
            <label>Ca trực muốn đổi<select defaultValue="Sáng · 07:30–11:30"><option>Sáng · 07:30–11:30</option><option>Chiều · 13:30–17:30</option></select></label>
          ) : (
            <>
              <label>Sinh viên<input required placeholder="Nhập tên sinh viên" /></label>
              <label>Thời gian<input type="time" required defaultValue="14:00" /></label>
            </>
          )}
          <label>Ghi chú<textarea rows="3" placeholder={isShift ? 'Lý do đổi ca, người đổi cùng...' : 'Nội dung cần trao đổi...'} /></label>
          <button className="staff-schedule-primary" type="submit"><Check size={16} /> Gửi yêu cầu</button>
        </form>
      </section>
    </div>
  );
}

export default function StaffScheduleDetailPage() {
  const [scope, setScope] = useState('department');
  const [view, setView] = useState('week');
  const [weekOffset, setWeekOffset] = useState(0);
  const [modal, setModal] = useState('');
  const [notice, setNotice] = useState('');
  const [appointments, setAppointments] = useState(initialAppointments);
  const [noteIndex, setNoteIndex] = useState(-1);
  const [noteDraft, setNoteDraft] = useState('');
  const dates = useMemo(() => getWeekDates(weekOffset), [weekOffset]);
  const monthDates = useMemo(() => getMonthDates(weekOffset), [weekOffset]);
  const weekEnd = new Date(2026, 9, 26 + weekOffset * 7);
  const periodLabel = `Tuần ${42 + weekOffset} (${dates[0]} - ${weekEnd.getDate()}/${weekEnd.getMonth() + 1}/${weekEnd.getFullYear()})`;
  const monthLabel = monthDates[15].toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
  const visibleDays = view === 'day' ? [0] : weekdays.map((_, index) => index);

  const markAttendance = (index, status) => {
    setAppointments((items) => items.map((item, itemIndex) => itemIndex === index ? { ...item, status } : item));
  };

  return (
    <div className="dashboard-page staff-schedule-page">
      <Link className="staff-schedule-back" to="/dashboard/lich-truc"><ArrowLeft size={16} /> Quay lại Lịch trực quầy & hẹn gặp</Link>
      <header className="staff-schedule-header">
        <div>
          <span className="staff-schedule-kicker">NHÂN VIÊN · TỔNG QUAN & LỊCH TRỰC</span>
          <h1>Lịch làm việc &amp; Ca trực Nhân viên</h1>
          <p>Quản lý lịch trực quầy, danh sách lịch hẹn gặp sinh viên và đăng ký đổi ca trực.</p>
        </div>
        <span className="staff-schedule-demo-badge">Dữ liệu minh họa</span>
      </header>

      {notice && <div className="staff-schedule-notice" role="status">{notice}<button type="button" onClick={() => setNotice('')} aria-label="Đóng thông báo"><X size={16} /></button></div>}

      <section className="staff-schedule-toolbar card">
        <div className="staff-schedule-control-row">
          <div className="staff-schedule-segment" aria-label="Khối lịch">
            <button type="button" className={scope === 'personal' ? 'active' : ''} onClick={() => setScope('personal')}><UserRound size={16} /> Lịch cá nhân</button>
            <button type="button" className={scope === 'department' ? 'active' : ''} onClick={() => setScope('department')}><Building2 size={16} /> Lịch toàn phòng</button>
          </div>
          <div className="staff-schedule-segment" aria-label="Chế độ xem">
            {[['week', 'Tuần'], ['month', 'Tháng'], ['day', 'Ngày']].map(([key, label]) => (
              <button type="button" key={key} className={view === key ? 'active' : ''} onClick={() => setView(key)}>{label}</button>
            ))}
          </div>
        </div>
        <div className="staff-schedule-control-row">
          <div className="staff-schedule-period">
            <button className="staff-schedule-icon-button" type="button" onClick={() => setWeekOffset((value) => value - 1)} aria-label="Tuần trước"><ChevronLeft size={18} /></button>
            <strong><CalendarDays size={17} /> {view === 'day' ? `Thứ 2 (${dates[0]}/2026)` : view === 'month' ? monthLabel : periodLabel}</strong>
            <button className="staff-schedule-icon-button" type="button" onClick={() => setWeekOffset((value) => value + 1)} aria-label="Tuần sau"><ChevronRight size={18} /></button>
          </div>
          <div className="staff-schedule-actions">
            <button className="staff-schedule-secondary" type="button" onClick={() => setModal('shift')}><Plus size={16} /> Đăng ký đổi ca</button>
            <button className="staff-schedule-primary" type="button" onClick={() => setModal('appointment')}><Plus size={16} /> Tạo lịch hẹn mới</button>
          </div>
        </div>
      </section>

      <section className="staff-schedule-metrics" aria-label="Thống kê lịch làm việc tuần này">
        <Metric icon={CalendarDays} label="CA TRỰC TUẦN NÀY" value="5 Ca trực" detail="20 Giờ" tone="blue" />
        <Metric icon={Users} label="LỊCH HẸN SINH VIÊN" value="18 Cuộc hẹn" detail="Trong tuần này" tone="violet" />
        <Metric icon={Check} label="ĐÃ TIẾP ĐÓN" value="12 Sinh viên" detail="Đã check-in" tone="green" />
        <Metric icon={Clock3} label="ĐỔI CA CHỜ DUYỆT" value="1 Yêu cầu" detail="Đang chờ phản hồi" tone="amber" />
      </section>

      <section className="card staff-schedule-calendar">
        <div className="staff-schedule-section-heading">
          <div><h2>Lịch làm việc {view === 'month' ? 'theo tháng' : view === 'day' ? 'trong ngày' : 'theo tuần'}</h2><p>{scope === 'department' ? 'Lịch trực và lịch hẹn của toàn phòng ban.' : 'Lịch trực và lịch hẹn cá nhân của bạn.'}</p></div>
          <span className="staff-schedule-legend"><i className="shift-dot" /> Ca trực <i className="meeting-dot" /> Hẹn gặp</span>
        </div>
        {view === 'month' ? (
          <div className="staff-schedule-month-grid">
            {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day) => <strong key={day}>{day}</strong>)}
            {monthDates.map((date) => {
              const dayIndex = date.getDay() - 1;
              const events = dayIndex >= 0 && dayIndex < 5
                ? shiftDays.map((row) => row[dayIndex]).filter(Boolean)
                : [];
              return <div className={`staff-schedule-month-day ${date.getDate() === 20 && date.getMonth() === 9 ? 'today' : ''}`} key={date.toISOString()}><span>{date.getDate()}</span>{events.map((event, index) => <small key={`${event.title}-${index}`}>{event.title}</small>)}</div>;
            })}
          </div>
        ) : (
          <div className="staff-schedule-table-wrap">
            <table className="staff-schedule-week-table">
              <thead><tr><th>KHUNG GIỜ</th>{visibleDays.map((index) => <th key={weekdays[index]}>{weekdays[index]} <span>{dates[index]}/2026</span></th>)}</tr></thead>
              <tbody>
                {shiftDays.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <th>{rowIndex === 0 ? 'CA SÁNG' : 'CA CHIỀU'}<span>{rowIndex === 0 ? '07:30–11:30' : '13:30–17:30'}</span></th>
                    {visibleDays.map((dayIndex) => {
                      const item = row[dayIndex];
                      return <td key={`${rowIndex}-${dayIndex}`}>{item ? <div className={`staff-schedule-event ${item.kind}`}><strong>{item.kind === 'shift' ? '●' : '◆'} {item.title}</strong><span>{item.department}</span>{item.appointments !== undefined && <small>• {item.appointments} lịch hẹn SV</small>}</div> : <span className="staff-schedule-rest">Nghỉ</span>}</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="card staff-schedule-appointments">
        <div className="staff-schedule-section-heading">
          <div><h2>Lịch hẹn chi tiết trong ngày hôm nay</h2><p>Điểm danh và cập nhật trạng thái tiếp đón sinh viên.</p></div>
          <span className="staff-schedule-today"><span /> Hôm nay · 20/10/2026</span>
        </div>
        <div className="staff-schedule-table-wrap">
          <table className="staff-schedule-appointments-table">
            <thead><tr><th>GIỜ HẸN</th><th>SINH VIÊN</th><th>MỤC ĐÍCH HẸN GẶP</th><th>QUẦY TRỰC</th><th>THAO TÁC ĐIỂM DANH</th></tr></thead>
            <tbody>{appointments.map((appointment, index) => (
              <tr key={`${appointment.time}-${appointment.student}`}>
                <td><strong>{appointment.time}</strong></td><td>{appointment.student}</td><td>{appointment.purpose}</td><td>{appointment.counter}</td>
                <td><div className="staff-schedule-attendance">
                  <button type="button" className={appointment.status === 'Đã tiếp đón' ? 'selected present' : 'present'} onClick={() => markAttendance(index, 'Đã tiếp đón')}><Check size={14} /> Tiếp đón</button>
                  <button type="button" className={appointment.status === 'Vắng' ? 'selected absent' : 'absent'} onClick={() => markAttendance(index, 'Vắng')}><X size={14} /> Vắng</button>
                  <button type="button" className="note" onClick={() => { setNoteIndex(index); setNoteDraft(appointment.note || ''); }}><span>✎</span> Ghi chú</button>
                  {appointment.status && <small className="attendance-status">{appointment.status}</small>}
                </div></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </section>
      <p className="staff-schedule-footnote">Các số liệu và thao tác trên trang hiện là dữ liệu minh họa; hệ thống chưa kết nối API lịch trực/điểm danh.</p>

      {modal && <ActionModal type={modal} onClose={() => setModal('')} onSubmit={() => {
        setNotice(modal === 'shift' ? 'Đã ghi nhận yêu cầu đổi ca (bản xem trước).' : 'Đã thêm lịch hẹn vào bản xem trước.');
        setModal('');
      }} />}
      {noteIndex >= 0 && <div className="staff-schedule-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setNoteIndex(-1); }}>
        <section className="staff-schedule-modal staff-schedule-note-modal" role="dialog" aria-modal="true" aria-labelledby="staff-schedule-note-title">
          <button className="staff-schedule-icon-button modal-close" type="button" onClick={() => setNoteIndex(-1)} aria-label="Đóng"><X size={18} /></button>
          <span className="staff-schedule-kicker">CẬP NHẬT LỊCH HẸN</span><h2 id="staff-schedule-note-title">Ghi chú tiếp đón</h2>
          <p>{appointments[noteIndex]?.student} · {appointments[noteIndex]?.time}</p>
          <label>Ghi chú<textarea rows="4" value={noteDraft} onChange={(event) => setNoteDraft(event.target.value)} placeholder="Nhập nội dung ghi chú..." /></label>
          <button className="staff-schedule-primary" type="button" onClick={() => {
            setAppointments((items) => items.map((item, index) => index === noteIndex ? { ...item, note: noteDraft } : item));
            setNoteIndex(-1);
            setNotice('Đã lưu ghi chú trong bản xem trước.');
          }}><Check size={16} /> Lưu ghi chú</button>
        </section>
      </div>}
    </div>
  );
}

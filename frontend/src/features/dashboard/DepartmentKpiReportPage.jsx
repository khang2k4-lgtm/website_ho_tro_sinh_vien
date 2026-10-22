import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Award,
  BarChart3,
  Check,
  CheckCircle2,
  Clock3,
  Download,
  FileCheck2,
  Printer,
  Search,
  Send,
  Star,
  Target,
  TrendingDown,
  X,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import './DepartmentKpiReportPage.css';

const STAFF = [
  { code: 'CB-102', name: 'Nguyễn Văn A', unit: 'Quầy 1 - Một cửa', processed: 285, sla: 98.5, score: 96, grade: 'Xuất sắc', completed: 278, overdue: 2, response: '0.8 ngày', satisfaction: 4.9 },
  { code: 'CB-105', name: 'Phạm Thu Hà', unit: 'Phòng Đào tạo Đại học', processed: 240, sla: 88.0, score: 82, grade: 'Khá', completed: 218, overdue: 5, response: '1.7 ngày', satisfaction: 4.5 },
  { code: 'CB-108', name: 'Đỗ Mai Linh', unit: 'Phòng CTSV', processed: 310, sla: 99.1, score: 98, grade: 'Xuất sắc', completed: 307, overdue: 1, response: '0.7 ngày', satisfaction: 4.9 },
  { code: 'CB-112', name: 'Trần Quốc Tuấn', unit: 'Quầy 2 - Học vụ', processed: 210, sla: 92.4, score: 89, grade: 'Tốt', completed: 194, overdue: 3, response: '1.1 ngày', satisfaction: 4.7 },
  { code: 'CB-119', name: 'Lê Minh Tâm', unit: 'Bộ phận Một cửa', processed: 235, sla: 95.8, score: 93, grade: 'Xuất sắc', completed: 225, overdue: 2, response: '0.9 ngày', satisfaction: 4.8 },
];

const MONTHS = [
  ['2026-10', 'Tháng 10/2026'],
  ['2026-09', 'Tháng 09/2026'],
  ['2026-08', 'Tháng 08/2026'],
];

function getReportData(period) {
  if (period === '2026-09') {
    return {
      performance: '92.8',
      averageTime: '1.5',
      completed: '1,182',
      total: '1,240',
      satisfaction: '4.7',
      satisfactionPercent: '94%',
      onTime: '96.4%',
      timeChange: 'Giảm 14% thời gian chờ so với tháng trước.',
      online: '88%',
      backlog: '21',
      averageScore: '90.8',
      comparison: '+1.7%',
      review: 'Toàn phòng duy trì tiến độ tốt, cần tiếp tục giảm thời gian chờ tại các quầy tiếp nhận.',
    };
  }
  if (period === '2026-08') {
    return {
      performance: '91.6',
      averageTime: '1.7',
      completed: '1,105',
      total: '1,190',
      satisfaction: '4.6',
      satisfactionPercent: '92%',
      onTime: '95.1%',
      timeChange: 'Giảm 9% thời gian chờ so với tháng trước.',
      online: '86%',
      backlog: '27',
      averageScore: '89.2',
      comparison: '+1.2%',
      review: 'Kết quả tháng đạt yêu cầu; cần theo dõi nhóm hồ sơ học vụ có thời gian xử lý kéo dài.',
    };
  }
  return {
    performance: '94.5',
    averageTime: '1.2',
    completed: '1,240',
    total: '1,280',
    satisfaction: '4.8',
    satisfactionPercent: '96%',
    onTime: '98.2%',
    timeChange: 'Giảm 22% thời gian chờ so với tháng trước.',
    online: '91%',
    backlog: '15',
    averageScore: '92.5',
    comparison: '+3.2%',
    review: 'Toàn phòng hoàn thành xuất sắc chỉ tiêu tháng 10. Tỉ lệ giải quyết hồ sơ đúng hạn đạt 98.2%, nâng cao độ hài lòng của sinh viên.',
  };
}

export default function DepartmentKpiReportPage() {
  const [period, setPeriod] = useState('2026-10');
  const [unitFilter, setUnitFilter] = useState('ALL');
  const [comparison, setComparison] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [toast, setToast] = useState('');
  const data = getReportData(period);

  const filteredStaff = useMemo(
    () => STAFF.filter((staff) => unitFilter === 'ALL' || staff.unit === unitFilter),
    [unitFilter],
  );

  const showToast = (text) => {
    setToast(text);
    window.setTimeout(() => setToast(''), 3500);
  };

  const downloadReport = () => {
    const rows = [
      ['Mã cán bộ', 'Cán bộ thụ lý', 'Bộ phận', 'Đã xử lý', 'Đúng hạn SLA', 'Điểm KPI', 'Xếp loại'],
      ...filteredStaff.map((staff) => [staff.code, staff.name, staff.unit, staff.processed, `${staff.sla}%`, `${staff.score}/100`, staff.grade]),
    ];
    const csv = `\uFEFF${rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\r\n')}`;
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `bao-cao-kpi-phong-ban-${period}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const printReport = () => window.print();

  const sendToLeadership = () => {
    setShowSummary(false);
    showToast('Đã mô phỏng gửi báo cáo tới Ban Giám hiệu; báo cáo chưa được gửi ra ngoài hệ thống.');
  };

  const reportPeriod = MONTHS.find(([value]) => value === period)?.[1] || 'Tháng 10/2026';

  return (
    <main className="dashboard-page department-kpi-page">
      <header className="department-kpi-header">
        <div>
          <Link className="department-kpi-back" to="/dashboard/bao-cao-kpi"><ArrowLeft size={16} /> Quay lại Báo cáo cá nhân</Link>
          <span className="dashboard-kicker">QUẢN LÝ PHÒNG BAN / BÁO CÁO &amp; KẾ HOẠCH</span>
          <h1 className="page-title">Báo cáo Hiệu suất &amp; KPI Phòng ban</h1>
          <p className="page-subtitle">Đánh giá mức độ hoàn thành công việc, tiến độ SLA và năng suất của toàn bộ cán bộ đơn vị.</p>
        </div>
      </header>

      <div className="department-kpi-demo-note"><BarChart3 size={16} /> Báo cáo và chỉ số trên trang này là dữ liệu mẫu để trình diễn, không phải số liệu vận hành thực tế.</div>

      <section className="department-kpi-toolbar">
        <div className="department-kpi-filters">
          <label><span>Kỳ báo cáo</span><select value={period} onChange={(event) => setPeriod(event.target.value)}>{MONTHS.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
          <label><span>Bộ phận</span><select value={unitFilter} onChange={(event) => setUnitFilter(event.target.value)}><option value="ALL">Tất cả quầy / khối</option>{[...new Set(STAFF.map((staff) => staff.unit))].map((unit) => <option value={unit} key={unit}>{unit}</option>)}</select></label>
        </div>
        <div className="department-kpi-actions">
          <button type="button" className={`btn ${comparison ? 'btn-primary' : 'btn-outline'}`} onClick={() => setComparison((current) => !current)}><BarChart3 size={16} />{comparison ? 'Ẩn so sánh' : 'So sánh cùng kỳ'}</button>
          <button type="button" className="btn btn-outline" onClick={downloadReport}><Download size={16} /> Xuất Excel (CSV)</button>
          <button type="button" className="btn btn-outline" onClick={printReport}><Printer size={16} /> In báo cáo</button>
        </div>
      </section>

      {comparison && (
        <div className="department-kpi-comparison" role="status">
          <TrendingDown size={18} />
          <div><strong>Hiệu suất tăng {data.comparison} so với kỳ trước</strong><span>SLA đúng hạn tăng 1.8 điểm phần trăm · Thời gian xử lý trung bình cải thiện theo dữ liệu mẫu.</span></div>
        </div>
      )}

      <section className="department-kpi-stats" aria-label="KPI phòng ban">
        <article><span className="department-kpi-stat-icon blue"><BarChart3 size={19} /></span><div><span>Hiệu suất toàn phòng</span><strong>{data.performance}%</strong><small>Vượt chỉ tiêu tháng</small></div></article>
        <article><span className="department-kpi-stat-icon amber"><Zap size={19} /></span><div><span>Thời gian xử lý TB</span><strong>{data.averageTime} <small>ngày / hồ sơ</small></strong><small>{data.timeChange}</small></div></article>
        <article><span className="department-kpi-stat-icon cyan"><FileCheck2 size={19} /></span><div><span>Hồ sơ đã hoàn thành</span><strong>{data.completed} <small>/ {data.total}</small></strong><small>Hồ sơ trong kỳ báo cáo</small></div></article>
        <article><span className="department-kpi-stat-icon green"><Star size={19} /></span><div><span>Hài lòng của sinh viên</span><strong>{data.satisfaction} <small>/ 5.0</small></strong><small>{data.satisfactionPercent} lượt đánh giá tích cực</small></div></article>
      </section>

      <section className="department-kpi-overview-grid">
        <article className="department-kpi-panel">
          <div className="department-kpi-panel-heading"><div><h2>Mục tiêu trọng tâm phòng ban</h2><p>Tổng hợp kết quả thực hiện kế hoạch kỳ này.</p></div><Target size={19} /></div>
          <div className="department-kpi-goal-list">
            <div><span className="department-kpi-goal-icon green"><CheckCircle2 size={17} /></span><div><strong>Tỷ lệ giải quyết hồ sơ đúng hạn</strong><p>Đạt {data.onTime} (mục tiêu tối thiểu ≥ 95.0%).</p></div><small>Kỳ này</small></div>
            <div><span className="department-kpi-goal-icon blue"><Clock3 size={17} /></span><div><strong>Thời gian phản hồi trung bình</strong><p>{data.timeChange}</p></div><small>Kỳ này</small></div>
            <div><span className="department-kpi-goal-icon amber"><Star size={17} /></span><div><strong>Đánh giá chất lượng phục vụ</strong><p>{data.satisfaction}/5 điểm dựa trên 850 lượt đánh giá mẫu.</p></div><small>Tiếp tục</small></div>
          </div>
        </article>
        <article className="department-kpi-panel">
          <div className="department-kpi-panel-heading"><div><h2>Chỉ số theo dõi vận hành</h2><p>Thông tin theo dõi hoạt động phòng ban.</p></div><Zap size={19} /></div>
          <div className="department-kpi-metric-list">
            <div><span>Tỷ lệ xử lý hồ sơ trực tuyến</span><strong>{data.online}% hồ sơ nộp qua Cổng HUMG Portal.</strong><em className="metric-ok">Đạt</em></div>
            <div><span>Tồn đọng cần giải quyết</span><strong>Còn {data.backlog} hồ sơ quá 24h chưa phê duyệt.</strong><em className="metric-warning">Cần nhắc</em></div>
            <div><span>Điểm KPI bình quân toàn phòng</span><strong>Đạt {data.averageScore}/100 điểm (Xếp loại Tốt).</strong><em className="metric-ok">Tốt</em></div>
          </div>
        </article>
      </section>

      <section className="department-kpi-panel department-kpi-staff-panel">
        <div className="department-kpi-table-heading">
          <div><h2>Đánh giá hiệu suất và KPI cán bộ phòng ban</h2><p>Giám sát sản lượng, tiến độ và tỷ lệ hoàn thành SLA của từng cán bộ · {reportPeriod}</p></div>
          <button type="button" className="department-kpi-detail-link" onClick={() => setShowSummary(true)}>Xem chi tiết <Search size={15} /></button>
        </div>
        <div className="department-kpi-table-wrap">
          <table className="department-kpi-table">
            <thead><tr><th>Mã CB</th><th>Cán bộ thụ lý</th><th>Bộ phận / quầy</th><th>Đã xử lý</th><th>Đúng hạn (SLA)</th><th>Điểm KPI</th><th>Xếp loại &amp; thao tác</th></tr></thead>
            <tbody>
              {filteredStaff.map((staff) => (
                <tr key={staff.code}>
                  <td><strong className="department-kpi-code">{staff.code}</strong></td>
                  <td><strong>{staff.name}</strong></td>
                  <td>{staff.unit}</td>
                  <td>{staff.processed} hồ sơ</td>
                  <td><span className={`department-kpi-sla ${staff.sla >= 95 ? 'good' : staff.sla >= 90 ? 'average' : 'low'}`}>{staff.sla}%</span></td>
                  <td><strong>{staff.score} / 100</strong></td>
                  <td><div className="department-kpi-grade"><span className={staff.grade === 'Xuất sắc' ? 'excellent' : staff.grade === 'Khá' ? 'fair' : 'good'}><i />{staff.grade}</span><button type="button" aria-label={`Xem KPI chi tiết của ${staff.name}`} onClick={() => setSelectedStaff(staff)}><Search size={15} /></button></div></td>
                </tr>
              ))}
              {filteredStaff.length === 0 && <tr><td colSpan="7" className="department-kpi-empty">Không có cán bộ thuộc bộ phận này trong dữ liệu mẫu.</td></tr>}
            </tbody>
          </table>
        </div>
        <footer className="department-kpi-table-footer">Đang hiển thị {filteredStaff.length} cán bộ trong kỳ {reportPeriod}.</footer>
      </section>

      {toast && <div className="department-kpi-toast" role="status"><Check size={17} />{toast}</div>}

      {(showSummary || selectedStaff) && (
        <div className="department-kpi-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) { setShowSummary(false); setSelectedStaff(null); } }}>
          <section className="department-kpi-modal" role="dialog" aria-modal="true" aria-labelledby="department-kpi-modal-title">
            <header>
              <div><span className="dashboard-kicker">{selectedStaff ? 'ĐÁNH GIÁ CÁN BỘ' : 'TỔNG HỢP KỲ BÁO CÁO'}</span><h2 id="department-kpi-modal-title">{selectedStaff ? `KPI ${selectedStaff.name} · ${reportPeriod}` : `Chi tiết KPI phòng ban · ${reportPeriod}`}</h2></div>
              <button type="button" aria-label="Đóng" onClick={() => { setShowSummary(false); setSelectedStaff(null); }}><X size={19} /></button>
            </header>
            {selectedStaff ? (
              <div className="department-kpi-modal-body">
                <div className="department-kpi-staff-score"><span><Award size={22} /></span><div><strong>{selectedStaff.score}<small> / 100</small></strong><span>{selectedStaff.grade}</span></div></div>
                <div className="department-kpi-detail-grid">
                  <div><span>Mã cán bộ</span><strong>{selectedStaff.code}</strong></div>
                  <div><span>Bộ phận</span><strong>{selectedStaff.unit}</strong></div>
                  <div><span>Hồ sơ đã xử lý</span><strong>{selectedStaff.processed}</strong></div>
                  <div><span>Đã hoàn thành</span><strong>{selectedStaff.completed}</strong></div>
                  <div><span>SLA đúng hạn</span><strong>{selectedStaff.sla}%</strong></div>
                  <div><span>Hồ sơ quá hạn</span><strong>{selectedStaff.overdue}</strong></div>
                  <div><span>Phản hồi trung bình</span><strong>{selectedStaff.response}</strong></div>
                  <div><span>Hài lòng sinh viên</span><strong>{selectedStaff.satisfaction}/5</strong></div>
                </div>
              </div>
            ) : (
              <div className="department-kpi-modal-body">
                <div className="department-kpi-summary-metrics">
                  <div><span>Tổng hồ sơ tiếp nhận</span><strong>{data.total}</strong></div>
                  <div><span>Đã hoàn thành</span><strong>{data.completed}</strong></div>
                  <div><span>Đang xử lý</span><strong>35</strong></div>
                  <div><span>Quá hạn</span><strong className="summary-overdue">5</strong></div>
                </div>
                <div className="department-kpi-top-staff"><h3><Award size={17} /> Cán bộ dẫn đầu</h3><ol>{[...STAFF].sort((left, right) => right.score - left.score).slice(0, 3).map((staff) => <li key={staff.code}><span>{staff.name}</span><strong>{staff.score} điểm</strong></li>)}</ol></div>
                <blockquote><strong>Đánh giá của Trưởng phòng</strong><p>“{data.review}”</p></blockquote>
              </div>
            )}
            <footer>
              <button type="button" className="btn btn-outline" onClick={() => { setShowSummary(false); setSelectedStaff(null); }}>Đóng</button>
              <button type="button" className="btn btn-outline" onClick={downloadReport}><Download size={16} /> Xuất Excel (CSV)</button>
              {!selectedStaff && <button type="button" className="btn btn-primary" onClick={sendToLeadership}><Send size={16} /> Báo cáo Ban BGH</button>}
            </footer>
          </section>
        </div>
      )}
    </main>
  );
}

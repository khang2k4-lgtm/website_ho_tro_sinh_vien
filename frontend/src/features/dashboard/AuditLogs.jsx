import { useCallback, useEffect, useState } from 'react';
import { AlertCircle, ArrowDownToLine, Clock3, RefreshCw, ScrollText, Search, ShieldCheck, UserRound } from 'lucide-react';
import api from '../../services/api';
import { ROLE_LABELS, formatDate } from '../../utils/constants';
import './AuditLogs.css';

const ACTION_LABELS = {
  CHANGE_PASSWORD: 'Đổi mật khẩu',
  CREATE: 'Tạo mới',
  DELETE: 'Xóa hoặc khóa',
  LOGIN: 'Đăng nhập',
  SUBMIT: 'Gửi hồ sơ',
  UPDATE: 'Cập nhật',
  UPDATE_STATUS: 'Cập nhật trạng thái',
  USER_CREATE: 'Tạo tài khoản',
  USER_UPDATE: 'Cập nhật tài khoản',
};

const ENTITY_LABELS = {
  Application: 'Hồ sơ',
  Department: 'Phòng ban',
  Service: 'Dịch vụ',
  Ticket: 'Yêu cầu hỗ trợ',
  User: 'Người dùng',
};

const SENSITIVE_ACTIONS = new Set(['DELETE', 'USER_UPDATE', 'UPDATE', 'UPDATE_STATUS']);

function csvValue(value) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`;
}

async function fetchAuditLogs() {
  const response = await api.get('/admin/audit-logs');
  if (!Array.isArray(response.data)) {
    throw new Error('Dữ liệu nhật ký trả về không hợp lệ.');
  }
  return response.data;
}

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [entityFilter, setEntityFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const [referenceTime, setReferenceTime] = useState(0);

  const loadLogs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setLogs(await fetchAuditLogs());
      setReferenceTime(Date.now());
    } catch (loadError) {
      setError(loadError.response?.data?.message || loadError.message || 'Không thể tải nhật ký hệ thống.');
    } finally {
      setLoading(false);
    }
  }, []);

  const actions = [...new Set(logs.map((log) => log.action).filter(Boolean))];
  const entities = [...new Set(logs.map((log) => log.entityType).filter(Boolean))];
  const filteredLogs = logs.filter((log) => {
    const searchText = `${log.user?.fullName || ''} ${log.user?.role || ''} ${log.action || ''} ${log.entityType || ''} ${log.details || ''}`.toLowerCase();
    const matchesQuery = searchText.includes(query.toLowerCase());
    const matchesAction = actionFilter === 'all'
      || (actionFilter === 'sensitive' ? SENSITIVE_ACTIONS.has(log.action) : log.action === actionFilter);
    const matchesEntity = entityFilter === 'all' || log.entityType === entityFilter;
    const createdAt = new Date(log.createdAt);
    const isToday = referenceTime > 0 && createdAt.toDateString() === new Date(referenceTime).toDateString();
    const age = referenceTime - createdAt.getTime();
    const isLastWeek = age >= 0 && age <= 7 * 24 * 60 * 60 * 1000;
    const matchesTime = timeFilter === 'all' || (timeFilter === 'today' ? isToday : isLastWeek);
    return matchesQuery && matchesAction && matchesEntity && matchesTime;
  });
  const sensitiveCount = filteredLogs.filter((log) => SENSITIVE_ACTIONS.has(log.action)).length;

  const exportLogs = () => {
    const header = ['Thời gian', 'Tài khoản', 'Hành động', 'Phân hệ', 'Chi tiết'];
    const rows = filteredLogs.map((log) => [
      log.createdAt,
      log.user?.fullName || 'Người dùng không xác định',
      ACTION_LABELS[log.action] || log.action,
      ENTITY_LABELS[log.entityType] || log.entityType,
      log.details || '',
    ]);
    const csv = `\uFEFF${[header, ...rows].map((row) => row.map(csvValue).join(',')).join('\r\n')}`;
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'audit-logs.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    let active = true;
    fetchAuditLogs()
      .then((entries) => {
        if (active) {
          setLogs(entries);
          setReferenceTime(Date.now());
        }
      })
      .catch((loadError) => {
        if (active) setError(loadError.response?.data?.message || loadError.message || 'Không thể tải nhật ký hệ thống.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  return (
    <main className="dashboard-page audit-page">
      <header className="audit-page-header">
        <div>
          <span className="dashboard-kicker">VẬN HÀNH & KIỂM SOÁT</span>
          <h1 className="page-title">Nhật ký hệ thống</h1>
          <p className="page-subtitle">Theo dõi các hoạt động quản trị và thay đổi quan trọng gần đây.</p>
        </div>
        <div className="audit-header-actions">
          <button className="btn btn-outline audit-refresh" type="button" onClick={loadLogs} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'audit-refresh-spinning' : ''} />
            Làm mới
          </button>
          <button className="btn btn-primary audit-refresh" type="button" onClick={exportLogs} disabled={loading || filteredLogs.length === 0}>
            <ArrowDownToLine size={16} /> Xuất CSV
          </button>
        </div>
      </header>

      <div className="audit-filter-notice">
        <AlertCircle size={16} />
        Nhật ký hiện chưa có dữ liệu địa chỉ IP hoặc thiết bị; bộ lọc chỉ áp dụng trên các trường API hiện cung cấp.
      </div>

      {!loading && !error && sensitiveCount > 0 && (
        <div className="audit-sensitive-notice" role="status">
          <AlertCircle size={18} />
          <strong>{sensitiveCount} hoạt động nhạy cảm cần rà soát</strong>
        </div>
      )}

      <section className="card audit-card" aria-labelledby="audit-list-title">
        <div className="audit-card-heading">
          <div className="audit-card-icon"><ScrollText size={19} /></div>
          <div>
            <h2 id="audit-list-title">Hoạt động gần đây</h2>
            <p>Hiển thị tối đa 100 hoạt động mới nhất.</p>
          </div>
          {!loading && !error && <span className="badge badge-info">{logs.length} hoạt động</span>}
        </div>

        <div className="audit-filters">
          <label className="audit-search">
            <Search size={16} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm tài khoản hoặc nội dung..." />
          </label>
          <label>Mức độ
            <select value={actionFilter} onChange={(event) => setActionFilter(event.target.value)}>
              <option value="all">Tất cả</option>
              <option value="sensitive">Nhạy cảm</option>
              {actions.map((action) => <option key={action} value={action}>{ACTION_LABELS[action] || action}</option>)}
            </select>
          </label>
          <label>Phân hệ
            <select value={entityFilter} onChange={(event) => setEntityFilter(event.target.value)}>
              <option value="all">Tất cả</option>
              {entities.map((entity) => <option key={entity} value={entity}>{ENTITY_LABELS[entity] || entity}</option>)}
            </select>
          </label>
          <label>Thời gian
            <select value={timeFilter} onChange={(event) => setTimeFilter(event.target.value)}>
              <option value="all">Tất cả</option>
              <option value="today">Hôm nay</option>
              <option value="7d">7 ngày qua</option>
            </select>
          </label>
        </div>

        {loading ? (
          <div className="audit-state" role="status">
            <RefreshCw size={20} className="audit-refresh-spinning" />
            <span>Đang tải nhật ký hệ thống...</span>
          </div>
        ) : error ? (
          <div className="audit-state audit-state-error" role="alert">
            <AlertCircle size={21} />
            <div><strong>Không tải được nhật ký</strong><p>{error}</p></div>
            <button className="btn btn-outline btn-sm" type="button" onClick={loadLogs}>Thử lại</button>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="audit-state audit-state-empty">
            <ShieldCheck size={24} />
            <strong>{logs.length === 0 ? 'Chưa có hoạt động được ghi nhận' : 'Không có hoạt động khớp bộ lọc'}</strong>
            <p>{logs.length === 0 ? 'Đăng nhập quản trị hoặc thực hiện thao tác quản lý để nhật ký xuất hiện tại đây.' : 'Hãy đổi điều kiện lọc hoặc từ khóa tìm kiếm.'}</p>
          </div>
        ) : (
          <div className="audit-list">
            {filteredLogs.map((log) => (
              <article className="audit-entry" key={log.id}>
                <div className="audit-entry-icon"><UserRound size={17} /></div>
                <div className="audit-entry-main">
                  <div className="audit-entry-title">
                    <strong>{ACTION_LABELS[log.action] || log.action}</strong>
                    <span>{ENTITY_LABELS[log.entityType] || log.entityType}</span>
                    {SENSITIVE_ACTIONS.has(log.action) && <span className="audit-sensitive-badge">Cần rà soát</span>}
                  </div>
                  <p className="audit-entry-actor">
                    {log.user?.fullName || 'Người dùng không xác định'}
                    {log.user?.role && <span>{ROLE_LABELS[log.user.role] || log.user.role}</span>}
                  </p>
                  {log.details && <p className="audit-entry-details">{log.details}</p>}
                </div>
                <time className="audit-entry-time" dateTime={log.createdAt}>
                  <Clock3 size={14} />
                  {formatDate(log.createdAt)}
                </time>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

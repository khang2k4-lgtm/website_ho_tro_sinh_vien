import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  FileText,
  Mail,
  Phone,
  Printer,
  ShieldCheck,
} from 'lucide-react';
import api from '../../services/api';
import { CATEGORIES } from '../../utils/constants';

export default function ServiceDetail() {
  const { slug } = useParams();
  const [service, setService] = useState(null);

  useEffect(() => {
    api.get(`/services/${slug}`).then((r) => setService(r.data));
  }, [slug]);

  if (!service) return <div className="loading container">Đang tải...</div>;

  return (
    <div className="service-detail-page">
      <div className="container">
        <div className="service-detail-topbar">
          <nav className="service-detail-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Trang chủ</Link>
            <span>/</span>
            <Link to="/dich-vu">Dịch vụ sinh viên</Link>
            <span>/</span>
            <span>{service.name}</span>
          </nav>

          <button type="button" className="service-print-btn" onClick={() => window.print()}>
            <Printer size={15} />
            In thủ tục
          </button>
        </div>

        <div className="service-detail-layout">
          <article className="service-detail-main">
            <header className="service-detail-header">
              <span className="badge badge-info">{CATEGORIES[service.category]}</span>
              <h1>{service.name}</h1>
              <p>{service.description}</p>
            </header>

            <section className="detail-card">
              <div className="detail-card-header">
                <h2>Tóm tắt thủ tục</h2>
              </div>
              <div className="detail-card-body detail-summary-grid">
                <div className="detail-stat">
                  <span>Cơ quan giải quyết</span>
                  <strong>{service.department?.name}</strong>
                </div>
                <div className="detail-stat">
                  <span>Thời gian</span>
                  <strong>{service.processingTime}</strong>
                </div>
                <div className="detail-stat">
                  <span>Hình thức</span>
                  <strong>{service.submissionType}</strong>
                </div>
              </div>
            </section>

            <section className="detail-card">
              <div className="detail-card-header">
                <h2>Hồ sơ cần thiết</h2>
              </div>
              <div className="detail-card-body">
                <ul className="detail-check-list">
                  {service.requiredDocs?.map((doc, index) => (
                    <li key={`${doc}-${index}`}>
                      <span className="detail-check-icon">
                        <CheckCircle2 size={18} />
                      </span>
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="detail-card">
              <div className="detail-card-header">
                <h2>Quy trình giải quyết</h2>
              </div>
              <div className="detail-card-body">
                <ol className="detail-step-list">
                  {service.steps?.map((step, index) => (
                    <li key={`${step}-${index}`}>
                      <div className="detail-step-number">{index + 1}</div>
                      <div>
                        <h3>{step}</h3>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </section>

            <section className="detail-card">
              <div className="detail-card-header">
                <h2>Lệ phí & Căn cứ pháp lý</h2>
              </div>
              <div className="detail-card-body detail-faq-grid">
                <div className="detail-mini-card">
                  <div className="mini-card-title">
                    <ShieldCheck size={16} />
                    Lệ phí quy định
                  </div>
                  <p>{service.fee || 'Theo quy định hiện hành của Trường và cơ quan giải quyết.'}</p>
                </div>
                <div className="detail-mini-card">
                  <div className="mini-card-title">
                    <Building2 size={16} />
                    Căn cứ thực hiện
                  </div>
                  <p>
                    Theo quy định về hồ sơ, xác thực và quản lý thủ tục hành chính của Trường Đại học Mỏ - Địa chất và các văn bản liên quan.
                  </p>
                </div>
              </div>
            </section>
          </article>

          <aside className="service-detail-sidebar">
            <div className="detail-action-card">
              <div className="detail-office-header">
                <div className="detail-office-icon">
                  <FileText size={18} />
                </div>
                <div>
                  <h3>{service.department?.name}</h3>
                  <p>Trường Đại học Mỏ - Địa chất</p>
                </div>
              </div>

              <div className="detail-meta-list">
                <div className="detail-meta-item">
                  <Clock3 size={16} />
                  <div>
                    <span>Thời gian xử lý</span>
                    <strong>{service.processingTime}</strong>
                  </div>
                </div>

                <div className="detail-meta-item">
                  <Building2 size={16} />
                  <div>
                    <span>Hình thức tiếp nhận</span>
                    <strong>{service.submissionType}</strong>
                  </div>
                </div>
              </div>

              <Link to={`/nop-ho-so/${service.slug}`} className="service-primary-btn">
                <FileText size={16} />
                Nộp hồ sơ online
              </Link>

              <div className="detail-contact-box">
                <div>
                  <Phone size={14} />
                  <span>Hotline: (024) 3838 9633</span>
                </div>
                <div>
                  <Mail size={14} />
                  <span>hanhchinh@humg.edu.vn</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

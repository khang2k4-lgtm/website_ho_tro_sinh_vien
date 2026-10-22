import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  CalendarClock,
  CheckCircle2,
  Clock3,
  FileText,
  HelpCircle,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import api from '../../services/api';
import { CATEGORIES } from '../../utils/constants';

const SAMPLE_SERVICE_ITEMS = [
  { id: 'svc-1', slug: 'xac-nhan-sinh-vien', name: 'Xác nhận sinh viên', category: 'CONG_TAC_SINH_VIEN', processingTime: '2 ngày' },
  { id: 'svc-2', slug: 'cap-lai-the-sinh-vien', name: 'Cấp lại thẻ sinh viên', category: 'CONG_TAC_SINH_VIEN', processingTime: '7-10 ngày' },
  { id: 'svc-3', slug: 'xin-cap-bang-diem', name: 'Xin cấp bảng điểm', category: 'HOC_VU', processingTime: '3 ngày' },
  { id: 'svc-4', slug: 'tra-cuu-hoc-phi', name: 'Tra cứu học phí', category: 'TAI_CHINH', processingTime: '1 ngày' },
];

const SAMPLE_FAQS = [
  { id: 'faq-1', question: 'Sinh viên cần chuẩn bị những giấy tờ gì?', answer: 'Thông thường bạn cần mang thẻ sinh viên hoặc CCCD, đơn đề nghị và các giấy tờ liên quan theo từng thủ tục.' },
  { id: 'faq-2', question: 'Nếu cần hỗ trợ thêm, tôi liên hệ ở đâu?', answer: 'Bạn có thể liên hệ trực tiếp tại phòng ban hoặc gửi yêu cầu thông qua hệ thống hỗ trợ sinh viên.' },
  { id: 'faq-3', question: 'Thủ tục có cần nộp trực tiếp không?', answer: 'Một số thủ tục hỗ trợ trực tiếp và online, tùy thuộc vào loại hồ sơ và thời gian xử lý của từng phòng ban.' },
];

const SAMPLE_STAFF = [
  { id: 'staff-1', fullName: 'Nguyễn Thị Lan', email: 'lan.nt@humg.edu.vn' },
  { id: 'staff-2', fullName: 'Trần Văn Hòa', email: 'hoa.tv@humg.edu.vn' },
  { id: 'staff-3', fullName: 'Phạm Minh Tú', email: 'tu.pm@humg.edu.vn' },
];

function buildDepartmentFallback(slug, name) {
  const normalized = (slug || name || '').toLowerCase();

  if (normalized.includes('đào tạo') || normalized.includes('dao-tao')) {
    return {
      name: name || 'Phòng Đào tạo Đại học',
      description: 'Quản lý chương trình đào tạo, đăng ký học phần, thời khóa biểu, xét tốt nghiệp và các thủ tục học vụ cho sinh viên.',
      address: 'Tầng 2, Nhà C12, Trường Đại học Mỏ - Địa chất',
      phone: '(024) 3838 7581',
      email: 'phongdaotao@humg.edu.vn',
      workingHours: 'Thứ 2 - Thứ 6 · 08:00 - 17:00',
    };
  }

  if (normalized.includes('tài chính') || normalized.includes('ke-toan')) {
    return {
      name: name || 'Phòng Tài chính - Kế toán',
      description: 'Tiếp nhận, xử lý và giải đáp các vấn đề về học phí, lệ phí, hỗ trợ tài chính, thanh toán và công nợ sinh viên.',
      address: 'Tầng 1, Nhà B, Trường Đại học Mỏ - Địa chất',
      phone: '(024) 3838 4522',
      email: 'taichinh@humg.edu.vn',
      workingHours: 'Thứ 2 - Thứ 6 · 08:00 - 17:00',
    };
  }

  if (normalized.includes('công tác') || normalized.includes('ctsv') || normalized.includes('sinh viên')) {
    return {
      name: name || 'Phòng Công tác Sinh viên',
      description: 'Hỗ trợ sinh viên về chính sách, học bổng, hồ sơ học vụ, hỗ trợ xã hội, tư vấn tâm lý và các hoạt động sinh viên.',
      address: 'Tầng 1, Nhà A, Trường Đại học Mỏ - Địa chất',
      phone: '(024) 3838 9633',
      email: 'ctsv@humg.edu.vn',
      workingHours: 'Thứ 2 - Thứ 6 · 08:00 - 17:00',
    };
  }

  if (normalized.includes('một cửa') || normalized.includes('mot-cua')) {
    return {
      name: name || 'Bộ phận Một cửa',
      description: 'Tiếp nhận hồ sơ trực tiếp, hướng dẫn thủ tục hành chính và trả kết quả theo quy trình tập trung của trường.',
      address: 'Tầng 1, Tòa nhà C12, Trường Đại học Mỏ - Địa chất',
      phone: '(024) 3838 9633',
      email: 'motcua@humg.edu.vn',
      workingHours: 'Thứ 2 - Thứ 6 · 07:30 - 17:30',
    };
  }

  return {
    name: name || 'Phòng ban hỗ trợ',
    description: 'Đơn vị cung cấp hỗ trợ và xử lý thủ tục liên quan đến sinh viên theo quy định của Trường Đại học Mỏ - Địa chất.',
    address: 'Trường Đại học Mỏ - Địa chất, Hà Nội',
    phone: '(024) 3838 9633',
    email: 'hotro@humg.edu.vn',
    workingHours: 'Thứ 2 - Thứ 6 · 08:00 - 17:00',
  };
}

export default function DepartmentDetail() {
  const { slug } = useParams();
  const [dept, setDept] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/departments/${slug}`)
      .then((r) => setDept(r.data))
      .catch(() => setDept(null))
      .finally(() => setLoading(false));
  }, [slug]);

  const details = dept || buildDepartmentFallback(slug, 'Phòng ban');
  const services = Array.isArray(dept?.services) && dept.services.length > 0 ? dept.services : SAMPLE_SERVICE_ITEMS;
  const faqList = Array.isArray(dept?.faqs) && dept.faqs.length > 0 ? dept.faqs : SAMPLE_FAQS;
  const staffList = Array.isArray(dept?.staff) && dept.staff.length > 0 ? dept.staff : SAMPLE_STAFF;
  const contactInfo = [
    { icon: MapPin, label: 'Địa điểm', value: details.address || 'Trường Đại học Mỏ - Địa chất' },
    { icon: Phone, label: 'Điện thoại', value: details.phone || '(024) 3838 9633' },
    { icon: Mail, label: 'Email', value: details.email || 'hotro@humg.edu.vn' },
    { icon: Clock3, label: 'Giờ làm việc', value: details.workingHours || 'Thứ 2 - Thứ 6 · 08:00 - 17:00' },
  ];

  const summaryItems = [
    { label: 'Dịch vụ trực tuyến', value: `${services.length}` },
    { label: 'Nhân sự hỗ trợ', value: `${staffList.length}` },
    { label: 'Thời gian tiếp nhận', value: '1-3 ngày' },
    { label: 'Hình thức', value: 'Online + trực tiếp' },
  ];

  if (loading) return <div className="loading container">Đang tải...</div>;
  if (!dept && !slug) return <div className="empty-state container">Không tìm thấy phòng ban</div>;

  return (
    <div className="department-detail-page">
      <div className="container department-detail-shell">
        <header className="department-detail-hero">
          <div className="department-detail-hero__content">
            <span className="department-kicker">Đơn vị hỗ trợ sinh viên</span>
            <h1>{details.name}</h1>
            <p>{details.description}</p>
          </div>

          <div className="department-detail-contact-box">
            <div className="detail-contact-header">
              <div className="detail-contact-icon"><Building2 size={18} /></div>
              <div>
                <span>Liên hệ nhanh</span>
                <strong>{details.name}</strong>
              </div>
            </div>

            <div className="detail-contact-list">
              {contactInfo.map(({ icon: Icon, label, value }) => (
                <div key={label} className="detail-contact-item">
                  <Icon size={15} />
                  <div>
                    <small>{label}</small>
                    <span>{value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </header>

        <section className="department-summary-grid">
          {summaryItems.map((item) => (
            <div key={item.label} className="department-summary-item">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </section>

        <div className="department-detail-grid">
          <main className="department-detail-main">
            <section className="detail-panel">
              <div className="detail-panel__header">
                <div>
                  <span className="department-kicker">Thông tin</span>
                  <h2>Dịch vụ trực tuyến</h2>
                </div>
                <span className="detail-chip">{services.length} dịch vụ</span>
              </div>

              <div className="department-service-list">
                {services.map((service) => (
                  <Link key={service.id || service.slug} to={`/dich-vu/${service.slug}`} className="department-service-item">
                    <div className="service-item-icon"><FileText size={18} /></div>
                    <div className="service-item-content">
                      <div className="service-item-topline">
                        <span className="badge badge-neutral">{CATEGORIES[service.category] || 'Dịch vụ'}</span>
                        <span className="service-time"><CalendarClock size={14} />{service.processingTime || 'Theo quy định'}</span>
                      </div>
                      <h3>{service.name}</h3>
                    </div>
                    <ArrowRight size={16} className="service-arrow" />
                  </Link>
                ))}
              </div>
            </section>

            <section className="detail-panel">
              <div className="detail-panel__header">
                <div>
                  <span className="department-kicker">Hỗ trợ</span>
                  <h2>Câu hỏi thường gặp</h2>
                </div>
              </div>

              <div className="department-faq-list">
                {faqList.map((item) => (
                  <details key={item.id} className="department-faq-item" open>
                    <summary>
                      <HelpCircle size={16} />
                      <span>{item.question}</span>
                    </summary>
                    <p>{item.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          </main>

          <aside className="department-detail-aside">
            <section className="detail-panel">
              <div className="detail-panel__header">
                <div>
                  <span className="department-kicker">Phản hồi</span>
                  <h2>Tiếp nhận hồ sơ</h2>
                </div>
              </div>

              <div className="detail-checklist">
                <div><CheckCircle2 size={16} /> Thủ tục được tư vấn rõ ràng theo từng đối tượng</div>
                <div><CheckCircle2 size={16} /> Hỗ trợ online và trực tiếp trong giờ hành chính</div>
                <div><CheckCircle2 size={16} /> Theo dõi tiến độ qua hệ thống sinh viên</div>
              </div>
            </section>

            <section className="detail-panel">
              <div className="detail-panel__header">
                <div>
                  <span className="department-kicker">Nhân sự</span>
                  <h2>Người hỗ trợ</h2>
                </div>
              </div>

              <div className="department-staff-list">
                {staffList.map((person) => (
                  <div key={person.id || person.email} className="department-staff-item">
                    <div className="staff-avatar"><UserRound size={16} /></div>
                    <div>
                      <strong>{person.fullName}</strong>
                      <span>{person.email || 'hotro@humg.edu.vn'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="detail-panel info-panel">
              <div className="detail-panel__header">
                <div>
                  <span className="department-kicker">Mức độ</span>
                  <h2>Đảm bảo chất lượng</h2>
                </div>
                <ShieldCheck size={18} />
              </div>
              <p>Phòng ban cam kết tư vấn, xử lý hồ sơ đúng quy trình, công khai thời gian giải quyết và phản hồi kịp thời cho sinh viên.</p>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

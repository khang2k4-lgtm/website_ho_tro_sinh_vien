import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Building2,
  FileText,
  HelpCircle,
  ArrowRight,
  Bell,
  MapPin,
  GraduationCap,
  Award,
  BookOpen,
  BadgeCheck,
  Briefcase,
  Layers,
  Users,
  Wallet,
  Landmark,
  UserCheck,
  Building,
  Clock,
  CheckCircle2
} from 'lucide-react';

import api from '../services/api';
import './Home.css';

export default function Home() {
  const [query, setQuery] = useState('');
  const [guide, setGuide] = useState(null);

  const [departments, setDepartments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [services, setServices] = useState([]);

  // ================================
  // LẤY DỮ LIỆU TỪ BACKEND
  // ================================
  useEffect(() => {
    Promise.all([
      api.get('/departments'),
      api.get('/announcements'),
      api.get('/services'),
    ])
      .then(([d, a, s]) => {
        setDepartments(d.data.slice(0, 6));
        setAnnouncements(
          a.data
            .filter((x) => x.isPinned)
            .slice(0, 3)
        );
        setServices(s.data.slice(0, 6));
      })
      .catch((error) => {
        console.error('Không thể tải dữ liệu:', error);
      });
  }, []);

  // ================================
  // TÌM KIẾM HƯỚNG DẪN
  // ================================
  const handleGuideSearch = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      setGuide(null);
      return;
    }

    try {
      const { data } = await api.get(
        `/search/guide?q=${encodeURIComponent(query)}`
      );

      setGuide(data);
    } catch (error) {
      console.error(error);

      setGuide({
        found: false,
        message: 'Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại.'
      });
    }
  };

  // ================================
  // CLICK GỢI Ý TÌM KIẾM
  // ================================
  const handleSuggestion = (value) => {
    setQuery(value);
    setGuide(null);
  };

  // ================================
  // ICON DỊCH VỤ
  // ================================
  const getServiceIcon = (index) => {
    const iconConfigs = [
      {
        Icon: GraduationCap,
        colorClass: 'icon-red'
      },
      {
        Icon: BookOpen,
        colorClass: 'icon-green'
      },
      {
        Icon: Award,
        colorClass: 'icon-blue'
      },
      {
        Icon: BadgeCheck,
        colorClass: 'icon-purple'
      },
      {
        Icon: Briefcase,
        colorClass: 'icon-orange'
      },
      {
        Icon: Layers,
        colorClass: 'icon-cyan'
      }
    ];

    const config =
      iconConfigs[index % iconConfigs.length];

    const IconComponent = config.Icon;

    return (
      <div
        className={`service-icon-wrapper ${config.colorClass}`}
      >
        <IconComponent size={22} />
      </div>
    );
  };

  // ================================
  // ICON PHÒNG BAN
  // ================================
  const getDepartmentIcon = (deptName, index) => {
    let IconComponent = Building2;
    let colorClass = 'icon-blue';

    const nameLower = deptName.toLowerCase();

    if (nameLower.includes('một cửa')) {
      IconComponent = UserCheck;
      colorClass = 'icon-cyan';
    }

    else if (nameLower.includes('tuyển sinh')) {
      IconComponent = GraduationCap;
      colorClass = 'icon-green';
    }

    else if (
      nameLower.includes('chính trị') ||
      nameLower.includes('sinh viên')
    ) {
      IconComponent = Users;
      colorClass = 'icon-orange';
    }

    else if (
      nameLower.includes('hành chính') ||
      nameLower.includes('tổng hợp')
    ) {
      IconComponent = Landmark;
      colorClass = 'icon-purple';
    }

    else if (
      nameLower.includes('tài chính') ||
      nameLower.includes('kế hoạch') ||
      nameLower.includes('kế toán')
    ) {
      IconComponent = Wallet;
      colorClass = 'icon-red';
    }

    else {
      const defaultConfigs = [
        {
          Icon: Building,
          colorClass: 'icon-blue'
        },
        {
          Icon: Building2,
          colorClass: 'icon-green'
        },
        {
          Icon: Landmark,
          colorClass: 'icon-purple'
        }
      ];

      const config =
        defaultConfigs[index % defaultConfigs.length];

      IconComponent = config.Icon;
      colorClass = config.colorClass;
    }

    return (
      <div
        className={`service-icon-wrapper ${colorClass}`}
      >
        <IconComponent size={22} />
      </div>
    );
  };

  return (
    <div className="home">

      {/* =====================================
          HERO
      ====================================== */}
      <section className="hero">

        {/* Background trang trí */}
        <div className="hero-grid"></div>

        <div className="hero-circle hero-circle-1"></div>
        <div className="hero-circle hero-circle-2"></div>

        <div className="container hero-content">

          {/* Badge */}
          <div className="hero-badge">
            <GraduationCap size={17} />

            <span>
              Cổng hỗ trợ sinh viên
            </span>
          </div>

          {/* Tiêu đề */}
          <h1>
            Bạn cần hỗ trợ vấn đề gì?
          </h1>

          {/* Mô tả */}
          <p className="hero-description">
            Tra cứu dịch vụ, thủ tục và phòng ban phù hợp.
            <br />

            Nộp hồ sơ trực tuyến và theo dõi tiến trình
            dễ dàng.
          </p>

          {/* Thanh tìm kiếm */}
          <form
            className="hero-search"
            onSubmit={handleGuideSearch}
          >

            <div className="search-icon">
              <Search size={22} />
            </div>

            <input
              type="text"
              value={query}
              onChange={(e) =>
                setQuery(e.target.value)
              }
              placeholder='Ví dụ: "hoãn học", "thẻ sinh viên", "học phí"...'
            />

            <button type="submit">
              <Search size={18} />

              <span>
                Tìm kiếm
              </span>
            </button>

          </form>

          {/* Gợi ý */}
          <div className="hero-suggestions">

            <span>Gợi ý:</span>

            <button
              type="button"
              onClick={() =>
                handleSuggestion('hoãn học')
              }
            >
              Hoãn học
            </button>

            <button
              type="button"
              onClick={() =>
                handleSuggestion('thẻ sinh viên')
              }
            >
              Thẻ sinh viên
            </button>

            <button
              type="button"
              onClick={() =>
                handleSuggestion('học phí')
              }
            >
              Học phí
            </button>

            <button
              type="button"
              onClick={() =>
                handleSuggestion('học bổng')
              }
            >
              Học bổng
            </button>

          </div>

          {/* =====================================
              KẾT QUẢ TÌM KIẾM
          ====================================== */}
          {guide && (
            <div
              className={`guide-result ${guide.found
                ? 'found'
                : 'not-found'
                }`}
            >

              {guide.found ? (
                <>
                  {/* Header kết quả */}
                  <div className="guide-header">

                    <div className="guide-icon">
                      <FileText size={24} />
                    </div>

                    <div>
                      <h3>
                        {guide.service.name}
                      </h3>

                      <p>
                        Phòng phụ trách:{' '}

                        <strong>
                          {guide.service.department?.name ||
                            'Đang cập nhật'}
                        </strong>
                      </p>
                    </div>

                  </div>

                  {/* Thông tin */}
                  <div className="guide-details">

                    <div>
                      <span>
                        Hồ sơ cần
                      </span>

                      {Array.isArray(
                        guide.service.requiredDocs
                      )
                        ? guide.service.requiredDocs.join(
                          ', '
                        )
                        : 'Xem chi tiết dịch vụ'}
                    </div>

                    <div>
                      <span>
                        Thời gian
                      </span>

                      {guide.service.processingTime ||
                        'Đang cập nhật'}
                    </div>

                    <div>
                      <span>
                        Hình thức
                      </span>

                      {guide.service.submissionType ||
                        'Đang cập nhật'}
                    </div>

                  </div>

                  {/* Button */}
                  <div className="guide-actions">

                    <Link
                      to={`/dich-vu/${guide.service.slug}`}
                      className="btn btn-outline btn-sm"
                    >
                      Xem hướng dẫn
                    </Link>

                    <Link
                      to={`/nop-ho-so/${guide.service.slug}`}
                      className="btn btn-primary btn-sm"
                    >
                      Nộp hồ sơ
                    </Link>

                  </div>
                </>
              ) : (

                <div className="guide-empty">

                  <HelpCircle size={22} />

                  <p>
                    {guide.message}
                  </p>

                </div>

              )}

            </div>
          )}

        </div>
      </section>


      {/* =====================================
          DỊCH VỤ PHỔ BIẾN
      ====================================== */}
      <section className="container section">

        <div className="section-header">

          <div>
            <span className="section-label">
              HỖ TRỢ SINH VIÊN
            </span>

            <h2>
              Dịch vụ phổ biến
            </h2>

            <p>
              Những thủ tục được sinh viên sử dụng
              thường xuyên
            </p>
          </div>

          <Link
            to="/dich-vu"
            className="section-link"
          >
            Xem tất cả

            <ArrowRight size={16} />
          </Link>

        </div>

        <div className="grid grid-3">

          {services.map((s, index) => (

            <Link
              key={s.id}
              to={`/dich-vu/${s.slug}`}
              className="service-card"
            >

              {getServiceIcon(index)}

              <div className="service-card-content">

                <h3>
                  {s.name}
                </h3>

                <p>
                  {s.department?.name ||
                    'Phòng ban phụ trách'}
                </p>

                {s.processingTime && (

                  <span className="service-time">

                    <Clock size={14} />

                    {s.processingTime}

                  </span>

                )}

              </div>

              <ArrowRight
                className="card-arrow"
                size={18}
              />

            </Link>

          ))}

        </div>

      </section>


      {/* =====================================
          PHÒNG BAN
      ====================================== */}
      <section className="department-section">

        <div className="container section">

          <div className="section-header">

            <div>

              <span className="section-label">
                ĐƠN VỊ PHỤ TRÁCH
              </span>

              <h2>
                Phòng ban
              </h2>

              <p>
                Tìm đúng đơn vị để được hỗ trợ
                nhanh hơn
              </p>

            </div>

            <Link
              to="/phong-ban"
              className="section-link"
            >
              Xem tất cả

              <ArrowRight size={16} />
            </Link>

          </div>

          <div className="grid grid-3">

            {departments.map((d, index) => (

              <Link
                key={d.id}
                to={`/phong-ban/${d.slug}`}
                className="dept-card"
              >

                {getDepartmentIcon(
                  d.name,
                  index
                )}

                <div className="dept-content">

                  <h3>
                    {d.name}
                  </h3>

                  <p>

                    <CheckCircle2 size={14} />

                    {d._count?.services || 0}

                    {' '}dịch vụ

                  </p>

                </div>

                <ArrowRight
                  className="card-arrow"
                  size={18}
                />

              </Link>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================
          TRUY CẬP NHANH
      ====================================== */}
      <section className="container section quick-section">

        <div className="section-header">

          <div>

            <span className="section-label">
              TRUY CẬP NHANH
            </span>

            <h2>
              Bạn đang cần làm gì?
            </h2>

          </div>

        </div>


        <div className="quick-grid">

          {/* Tra cứu */}
          <Link
            to="/tra-cuu"
            className="quick-link"
          >

            <div className="quick-icon quick-blue">
              <Search size={23} />
            </div>

            <div className="quick-content">

              <strong>
                Tra cứu thủ tục
              </strong>

              <span>
                Tìm dịch vụ và hướng dẫn
              </span>

            </div>

            <ArrowRight size={17} />

          </Link>


          {/* Hỗ trợ */}
          <Link
            to="/ho-tro"
            className="quick-link"
          >

            <div className="quick-icon quick-orange">
              <HelpCircle size={23} />
            </div>

            <div className="quick-content">

              <strong>
                Yêu cầu hỗ trợ
              </strong>

              <span>
                Gửi câu hỏi đến nhà trường
              </span>

            </div>

            <ArrowRight size={17} />

          </Link>


          {/* Bản đồ */}
          <Link
            to="/bando"
            className="quick-link"
          >

            <div className="quick-icon quick-green">
              <MapPin size={23} />
            </div>

            <div className="quick-content">

              <strong>
                Bản đồ trường
              </strong>

              <span>
                Tìm vị trí các phòng ban
              </span>

            </div>

            <ArrowRight size={17} />

          </Link>


          {/* Thông báo */}
          <Link
            to="/thong-bao"
            className="quick-link"
          >

            <div className="quick-icon quick-purple">
              <Bell size={23} />
            </div>

            <div className="quick-content">

              <strong>
                Thông báo
              </strong>

              <span>
                Cập nhật tin tức mới nhất
              </span>

            </div>

            <ArrowRight size={17} />

          </Link>

        </div>

      </section>


      {/* =====================================
          THÔNG BÁO
      ====================================== */}
      {announcements.length > 0 && (

        <section className="container section announcement-section">

          <div className="section-header">

            <div>

              <span className="section-label">
                CẬP NHẬT
              </span>

              <h2>
                Thông báo nổi bật
              </h2>

            </div>

            <Link
              to="/thong-bao"
              className="section-link"
            >
              Xem tất cả

              <ArrowRight size={16} />
            </Link>

          </div>


          <div className="announce-list">

            {announcements.map((a) => (

              <Link
                key={a.id}
                to={`/thong-bao/${a.id}`}
                className="announce-item"
              >

                <div className="announce-icon">
                  <Bell size={18} />
                </div>

                <div className="announce-content">

                  <strong>
                    {a.title}
                  </strong>

                  <small>
                    {a.department?.name ||
                      'Nhà trường'}
                  </small>

                </div>

                <ArrowRight size={17} />

              </Link>

            ))}

          </div>

        </section>

      )}

    </div>
  );
}
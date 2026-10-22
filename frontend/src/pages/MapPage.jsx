import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import api from '../services/api';
import { ArrowUpRight, Building2, Compass, Image, MapPinned, MapPin, Minus, Phone, Plus, Search } from 'lucide-react';
import './MapPage.css';

const CAMPUS_MARKER_ICON = L.divIcon({
    className: 'campus-marker-icon',
    html: '<span></span>',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -13],
});

const CAMPUS_LOCATIONS = [
    { id: 'gate', name: 'Cổng trường', kind: 'Cổng vào', building: 'Cổng chính', latitude: 21.071588, longitude: 105.773891, address: 'Điểm bắt đầu tham quan khuôn viên' },
    { id: 'building-b', name: 'Nhà B', kind: 'Tòa nhà', building: 'Nhà B', latitude: 21.071889, longitude: 105.773593, address: 'Nhà B, Trường Đại học Mỏ - Địa chất' },
    { id: 'building-a', name: 'Nhà A', kind: 'Tòa nhà', building: 'Nhà A', latitude: 21.071885, longitude: 105.773951, address: 'Nhà A, Trường Đại học Mỏ - Địa chất' },
    { id: 'building-d', name: 'Nhà D', kind: 'Tòa nhà', building: 'Nhà D', latitude: 21.072503, longitude: 105.773568, address: 'Nhà D, Trường Đại học Mỏ - Địa chất' },
    { id: 'building-c12', name: 'Nhà C 12 tầng', kind: 'Tòa nhà', building: 'Nhà C', floor: '12 tầng', latitude: 21.072538, longitude: 105.773911, address: 'Nhà C 12 tầng, Trường Đại học Mỏ - Địa chất' },
    { id: 'library', name: 'Thư viện', kind: 'Tòa nhà', building: 'Thư viện', floor: 'Nhà C 5 tầng', latitude: 21.072538, longitude: 105.773911, address: 'Thư viện, Nhà C 5 tầng' },
    { id: 'auditorium', name: 'Hội trường 300', kind: 'Công trình', building: 'Hội trường 300', latitude: 21.071867, longitude: 105.774257, address: 'Hội trường 300' },
    { id: 'canteen', name: 'Nhà ăn HUMG', kind: 'Tiện ích', building: 'Nhà ăn HUMG', latitude: 21.072960, longitude: 105.773994, address: 'Nhà ăn HUMG' },
    { id: 'dorm-a', name: 'Ký túc xá khu A', kind: 'Lưu trú', building: 'KTX khu A', latitude: 21.073314, longitude: 105.773611, address: 'Ký túc xá khu A' },
    { id: 'building-e', name: 'Nhà E', kind: 'Tòa nhà', building: 'Nhà E', latitude: 21.072739, longitude: 105.773392, address: 'Nhà E, Trường Đại học Mỏ - Địa chất' },
    { id: 'one-stop', name: 'Bộ phận Một cửa', kind: 'Phòng nghiệp vụ', building: 'Nhà C', floor: 'Tầng 1', room: 'Sảnh một cửa', parentId: 'building-c12', address: 'Tầng 1, Nhà C 12 tầng', slug: 'bo-phan-mot-cua' },
    { id: 'student-affairs', name: 'Phòng Công tác Chính trị - Sinh viên', kind: 'Phòng nghiệp vụ', building: 'Nhà A', floor: 'Tầng 1', parentId: 'building-a', address: 'Tầng 1, Nhà A', slug: 'phong-ctsv' },
    { id: 'undergraduate', name: 'Phòng Đào tạo Đại học', kind: 'Phòng nghiệp vụ', building: 'Nhà C', floor: 'Tầng 2', room: 'Phòng đào tạo đại học', parentId: 'building-c12', address: 'Tầng 2, Nhà C 12 tầng', slug: 'phong-dao-tao' },
    { id: 'graduate', name: 'Phòng Đào tạo Sau đại học', kind: 'Phòng nghiệp vụ', building: 'Nhà C', floor: 'Tầng 3', parentId: 'building-c12', address: 'Tầng 3, Nhà C 12 tầng', slug: 'phong-dao-tao-sau-dai-hoc' },
    { id: 'library-office', name: 'Phòng Thư viện', kind: 'Phòng nghiệp vụ', building: 'Thư viện', floor: 'Nhà C 5 tầng', parentId: 'library', address: 'Nhà C 5 tầng', slug: 'thu-vien' },
    { id: 'language-center', name: 'Trung tâm Ngoại ngữ - Tin học', kind: 'Phòng nghiệp vụ', building: 'Thư viện', floor: 'Nhà C 5 tầng', parentId: 'library', address: 'Nhà C 5 tầng' },
    { id: 'lab-center', name: 'Trung tâm Thí nghiệm', kind: 'Phòng nghiệp vụ', building: 'Nhà E', parentId: 'building-e', address: 'Nhà E' },
];

export default function MapPage() {
    const [departments, setDepartments] = useState([]);
    const [search, setSearch] = useState('');
    const [area, setArea] = useState('ALL');
    const [selectedId, setSelectedId] = useState('undergraduate');
    const [loading, setLoading] = useState(true);
    const [mapOffline, setMapOffline] = useState(false);

    useEffect(() => {
        api.get('/departments').then((response) => setDepartments(response.data || [])).catch(() => setDepartments([])).finally(() => setLoading(false));
    }, []);

    const locations = useMemo(() => {
        const baseLocations = CAMPUS_LOCATIONS.map((location) => {
            const department = departments.find((item) => item.name === location.name || item.slug === location.slug);
            return { ...location, ...department, id: location.id, latitude: location.latitude, longitude: location.longitude, building: location.building, floor: location.floor, parentId: location.parentId };
        });
        return baseLocations.map((location) => {
            if (location.latitude || !location.parentId) return location;
            const parent = baseLocations.find((candidate) => candidate.id === location.parentId);
            return { ...location, latitude: parent?.latitude, longitude: parent?.longitude };
        });
    }, [departments]);
    const areas = useMemo(() => ['ALL', ...new Set(locations.map((location) => location.building).filter(Boolean))], [locations]);
    const filtered = useMemo(() => locations.filter((location) => {
        const text = `${location.name} ${location.address || ''} ${location.building || ''} ${location.floor || ''}`.toLowerCase();
        return (area === 'ALL' || location.building === area) && text.includes(search.toLowerCase());
    }), [locations, area, search]);
    const withCoords = filtered.filter((department) => department.latitude && department.longitude);
    const selected = filtered.find((location) => location.id === selectedId) || filtered[0] || null;
    const visibleLocations = useMemo(() => {
        if (!selected) return withCoords;

        const relatedIds = new Set([selected.id]);
        if (selected.parentId) relatedIds.add(selected.parentId);

        return withCoords.filter((location) => relatedIds.has(location.id));
    }, [selected, withCoords]);

    if (loading) return <div className="loading container">Đang tải bản đồ...</div>;

    return (
        <>
            <section className="map-hero">
                <div className="container map-hero-inner">
                    <div className="map-hero-icon"><MapPinned size={29} /></div>
                    <div className="page-kicker">Bản đồ hỗ trợ sinh viên HUMG</div>
                    <h1 className="page-title">Khám phá khuôn viên trường</h1>
                    <p className="page-subtitle">Tìm phòng ban, tòa nhà và các dịch vụ hỗ trợ sinh viên ngay trong khuôn viên trường.</p>
                </div>
            </section>
            <main className="container page-content map-page">
                <div className="map-toolbar">
                    <div><span className="map-kicker">Bản đồ tương tác</span><h2><Compass size={19} /> Tìm địa điểm trong trường</h2></div>
                    <span className="map-result-count">{filtered.length} địa điểm</span>
                </div>

                <div className="campus-layout">
                    <aside className="campus-sidebar" aria-label="Tìm địa điểm trên bản đồ">
                        <div className="campus-sidebar-heading"><MapPinned size={18} /><h2>Địa điểm</h2><span>{filtered.length}</span></div>
                        <label className="map-search">
                            <Search size={18} />
                            <input aria-label="Tìm phòng ban hoặc tòa nhà" placeholder="Tìm phòng ban, tòa nhà..." value={search} onChange={(event) => setSearch(event.target.value)} />
                        </label>
                        <label className="campus-area-filter">
                            <span>Khu vực</span>
                            <select aria-label="Lọc theo khu vực" value={area} onChange={(event) => setArea(event.target.value)}>
                                {areas.map((item) => <option key={item} value={item}>{item === 'ALL' ? 'Toàn khuôn viên' : item}</option>)}
                            </select>
                        </label>
                        <div className="campus-location-list">
                            {filtered.map((location) => (
                                <button key={location.id} type="button" className={`campus-location-option ${selected?.id === location.id ? 'selected' : ''}`} aria-pressed={selected?.id === location.id} onClick={() => setSelectedId(location.id)}>
                                    <span className="campus-location-icon"><Building2 size={16} /></span>
                                    <span className="campus-location-text"><strong>{location.name}</strong><small>{location.floor || location.building || location.kind}</small></span>
                                    <MapPin size={15} className="campus-location-pin" />
                                </button>
                            ))}
                            {filtered.length === 0 && <div className="map-empty"><Search size={22} /><strong>Không tìm thấy địa điểm</strong><span>Thử từ khóa hoặc khu vực khác.</span></div>}
                        </div>
                    </aside>

                    <section className="campus-map-panel" aria-label="Bản đồ khuôn viên HUMG">
                        <div className="campus-map-heading">
                            <div><strong>Bản đồ khuôn viên HUMG</strong><span>Chọn ghim trên bản đồ hoặc địa điểm trong danh sách.</span></div>
                            <span className={`map-status ${mapOffline ? 'offline-map-status' : ''}`}><span /> {mapOffline ? 'Sơ đồ ngoại tuyến' : 'Ảnh vệ tinh'}</span>
                        </div>
                        <div className="campus-map-wrap">
                            {mapOffline ? (
                                <OfflineCampusMap locations={visibleLocations} selected={selected} onSelect={(location) => setSelectedId(location.id)} />
                            ) : (
                                <OnlineCampusMap
                                    locations={visibleLocations}
                                    selected={selected}
                                    onSelect={(location) => setSelectedId(location.id)}
                                    onTilesError={() => setMapOffline(true)}
                                />
                            )}
                            {withCoords.length === 0 && <div className="map-empty"><MapPinned size={25} /><strong>Chưa có tọa độ bản đồ</strong><span>Thử chọn khu vực khác.</span></div>}
                        </div>
                    </section>

                    <aside className="campus-place-detail" aria-live="polite">
                        {selected ? (
                            <>
                                <span className="campus-detail-kind">{selected.kind || selected.building || 'Địa điểm HUMG'}</span>
                                <h2>{selected.name}</h2>
                                <div className="campus-detail-meta">
                                    <span><Building2 size={16} />{selected.address || selected.building || 'Khuôn viên HUMG'}</span>
                                    {selected.floor && <span><MapPin size={16} />{selected.floor}{selected.room ? ` · ${selected.room}` : ''}</span>}
                                    {selected.phone && <span><Phone size={16} />{selected.phone}</span>}
                                </div>
                                {selected.description && <div className="campus-detail-description"><h3>Giới thiệu</h3><p>{selected.description}</p></div>}
                                <div className="campus-detail-services">
                                    <h3>Dịch vụ liên quan</h3>
                                    {selected.services?.length ? (
                                        <ul>{selected.services.slice(0, 4).map((service) => <li key={service.id}><Link to={`/dich-vu/${service.slug}`}>{service.name}</Link></li>)}</ul>
                                    ) : (
                                        <p>Xem các thủ tục và thông tin hỗ trợ từ đơn vị này.</p>
                                    )}
                                </div>
                                <div className="campus-detail-actions">
                                    <Link className="btn btn-primary" to={selected.slug ? `/phong-ban/${selected.slug}` : '/dich-vu'}>
                                        <ArrowUpRight size={16} /> {selected.slug ? 'Xem chi tiết & dịch vụ' : 'Xem dịch vụ'}
                                    </Link>
                                    {selected.latitude && selected.longitude && (
                                        <a className="btn btn-secondary" href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${selected.latitude},${selected.longitude}`} target="_blank" rel="noopener noreferrer">
                                            <Image size={16} /> Xem ảnh khu vực
                                        </a>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="campus-detail-empty"><MapPin size={24} /><strong>Chọn một địa điểm</strong><span>Thông tin phòng ban và dịch vụ sẽ hiển thị tại đây.</span></div>
                        )}
                    </aside>
                </div>
            </main>
        </>
    );
}

function MapViewport({ selected }) {
    const map = useMap();

    useEffect(() => {
        if (selected?.latitude && selected?.longitude) {
            map.setView([selected.latitude, selected.longitude], 17);
        }
    }, [map, selected]);

    return null;
}

function OnlineCampusMap({ locations, selected, onSelect, onTilesError }) {
    return (
        <MapContainer center={[21.07225, 105.77382]} zoom={16} scrollWheelZoom className="campus-map">
            <TileLayer
                attribution="Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community"
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                eventHandlers={{ tileerror: onTilesError }}
            />
            <TileLayer
                attribution="Labels &copy; Esri"
                url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
            />
            <MapViewport selected={selected} />
            {locations.map((location) => (
                <Marker
                    key={location.id}
                    icon={CAMPUS_MARKER_ICON}
                    position={[location.latitude, location.longitude]}
                    eventHandlers={{ click: () => onSelect(location) }}
                >
                    <Popup>
                        <strong>{location.name}</strong>
                        <br />
                        {location.address || location.building}
                        {location.floor && <><br />{location.floor}</>}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}

function OfflineCampusMap({ locations, selected, onSelect }) {
    const [zoom, setZoom] = useState(1);
    const minLatitude = 21.07145;
    const maxLatitude = 21.0734;
    const minLongitude = 105.7733;
    const maxLongitude = 105.7744;

    const getPosition = (location) => ({
        left: `${Math.max(4, Math.min(96, ((location.longitude - minLongitude) / (maxLongitude - minLongitude)) * 100))}%`,
        top: `${Math.max(5, Math.min(95, ((maxLatitude - location.latitude) / (maxLatitude - minLatitude)) * 100))}%`,
    });

    return (
        <div className="offline-campus-map">
            <div className="offline-map-viewport">
                <div className="offline-map-scene" style={{ transform: `scale(${zoom})` }}>
                    <svg className="offline-map-art" viewBox="0 0 1000 700" role="img" aria-label="Sơ đồ minh họa khuôn viên HUMG">
                        <defs>
                            <pattern id="campus-grid" width="42" height="42" patternUnits="userSpaceOnUse">
                                <path d="M 42 0 L 0 0 0 42" fill="none" stroke="#dce9dc" strokeWidth="1" />
                            </pattern>
                            <filter id="building-shadow" x="-20%" y="-20%" width="140%" height="150%">
                                <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#47664f" floodOpacity=".16" />
                            </filter>
                        </defs>
                        <rect width="1000" height="700" fill="#e8f2e7" />
                        <rect width="1000" height="700" fill="url(#campus-grid)" />
                        <path d="M-40 98 L1040 548" stroke="#d1d9d6" strokeWidth="78" />
                        <path d="M-40 98 L1040 548" stroke="#fff" strokeWidth="68" />
                        <path d="M175 -35 L815 740" stroke="#d1d9d6" strokeWidth="66" />
                        <path d="M175 -35 L815 740" stroke="#fff" strokeWidth="56" />
                        <path d="M-30 615 C180 525 310 585 492 505 S810 360 1030 390" fill="none" stroke="#fff" strokeWidth="25" />
                        <path d="M95 185 C260 250 365 305 506 375 S765 495 930 525" fill="none" stroke="#bddfdf" strokeWidth="8" strokeDasharray="12 12" />
                        <path d="M350 105 C418 57 496 66 541 120 C579 168 547 218 478 222 C405 226 343 179 350 105Z" fill="#a6d8e2" stroke="#fff" strokeWidth="8" />
                        <rect x="754" y="104" width="154" height="254" rx="62" fill="#f3bd9f" stroke="#fff" strokeWidth="10" />
                        <rect x="778" y="130" width="106" height="202" rx="48" fill="#b8dcae" stroke="#e9f2e7" strokeWidth="7" />
                        <path d="M52 270 C98 230 150 245 165 286 C178 324 138 352 94 342 C53 332 29 306 52 270Z" fill="#d2e8c8" />
                        <path d="M812 442 C866 408 942 424 959 470 C976 517 921 554 866 536 C818 520 787 475 812 442Z" fill="#d2e8c8" />
                        <g className="offline-map-buildings" filter="url(#building-shadow)">
                            <g><rect x="245" y="145" width="132" height="88" rx="10" /><text x="311" y="184">NHÀ B</text><text x="311" y="204" className="building-subtitle">KHU GIẢNG ĐƯỜNG</text></g>
                            <g><rect x="424" y="247" width="142" height="116" rx="10" /><text x="495" y="292">NHÀ C</text><text x="495" y="314" className="building-subtitle">12 TẦNG</text></g>
                            <g><rect x="615" y="388" width="137" height="91" rx="10" /><text x="683" y="428">NHÀ A</text><text x="683" y="448" className="building-subtitle">KHU GIẢNG ĐƯỜNG</text></g>
                            <g><rect x="119" y="420" width="144" height="89" rx="10" /><text x="191" y="461">NHÀ D</text><text x="191" y="481" className="building-subtitle">KHU LÀM VIỆC</text></g>
                            <g><rect x="637" y="128" width="86" height="72" rx="10" /><text x="680" y="170">THƯ VIỆN</text></g>
                            <g><rect x="308" y="474" width="118" height="72" rx="10" /><text x="367" y="516">NHÀ ĂN</text></g>
                            <g><rect x="87" y="116" width="70" height="51" rx="8" /><text x="122" y="147">CỔNG</text></g>
                        </g>
                        <g className="offline-map-trees" fill="#77b985">
                            <circle cx="210" cy="115" r="13" /><circle cx="399" cy="270" r="11" /><circle cx="585" cy="218" r="14" />
                            <circle cx="713" cy="282" r="12" /><circle cx="297" cy="366" r="13" /><circle cx="565" cy="465" r="12" />
                            <circle cx="477" cy="447" r="10" /><circle cx="176" cy="555" r="12" /><circle cx="896" cy="586" r="13" />
                            <circle cx="940" cy="206" r="11" /><circle cx="540" cy="111" r="10" /><circle cx="339" cy="396" r="9" />
                        </g>
                        <g className="offline-map-road-labels">
                            <text x="140" y="90" transform="rotate(23 140 90)">ĐƯỜNG NỘI BỘ</text>
                            <text x="685" y="598" transform="rotate(-13 685 598)">LỐI ĐI KHUÔN VIÊN</text>
                        </g>
                    </svg>
                    {locations.filter((location) => location.latitude && location.longitude).map((location) => (
                        <button
                            key={location.id}
                            type="button"
                            className={`offline-map-marker ${selected?.id === location.id ? 'selected' : ''}`}
                            style={getPosition(location)}
                            aria-label={`Chọn ${location.name}`}
                            aria-pressed={selected?.id === location.id}
                            title={location.name}
                            onClick={() => onSelect(location)}
                        >
                            <MapPin size={17} fill="currentColor" />
                        </button>
                    ))}
                </div>
            </div>
            <div className="offline-map-controls" aria-label="Điều khiển thu phóng sơ đồ">
                <button type="button" aria-label="Phóng to sơ đồ" disabled={zoom >= 1.35} onClick={() => setZoom((value) => Math.min(1.35, Number((value + 0.1).toFixed(1))))}><Plus size={18} /></button>
                <button type="button" aria-label="Thu nhỏ sơ đồ" disabled={zoom <= 1} onClick={() => setZoom((value) => Math.max(1, Number((value - 0.1).toFixed(1))))}><Minus size={18} /></button>
            </div>
            <div className="offline-map-attribution">Sơ đồ minh họa HUMG · Hoạt động ngoại tuyến</div>
        </div>
    );
}

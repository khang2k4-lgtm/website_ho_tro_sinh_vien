import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import api from '../services/api';
import { Building2, ChevronRight, Compass, MapPinned, MapPin, Phone, Search } from 'lucide-react';
import './MapPage.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

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
    { id: 'building-c12', name: 'Nhà C 12 tầng', kind: 'Tòa nhà', building: 'Nhà C', floor: '12 tầng', latitude: 21.072299, longitude: 105.773589, address: 'Nhà C 12 tầng, Trường Đại học Mỏ - Địa chất' },
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

function MapViewport({ selected }) {
    const map = useMap();
    useEffect(() => {
        if (selected?.latitude && selected?.longitude) map.setView([selected.latitude, selected.longitude], 17);
    }, [map, selected]);
    return null;
}

export default function MapPage() {
    const [departments, setDepartments] = useState([]);
    const [search, setSearch] = useState('');
    const [area, setArea] = useState('ALL');
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(true);

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
    const visibleLocations = useMemo(() => {
        if (!selected) return withCoords;

        const relatedIds = new Set([selected.id]);
        if (selected.parentId) relatedIds.add(selected.parentId);

        return withCoords.filter((location) => relatedIds.has(location.id));
    }, [selected, withCoords]);
    const center = [21.07225, 105.77382];

    if (loading) return <div className="loading container">Đang tải bản đồ...</div>;

    return (
        <>
            <section className="map-hero"><div className="container map-hero-inner"><div className="map-hero-icon"><MapPinned size={29} /></div><div className="page-kicker">Tìm đường trong trường</div><h1 className="page-title">Bản đồ HUMG</h1><p className="page-subtitle">Tìm nhanh phòng ban, tòa nhà và đầu mối hỗ trợ sinh viên trong khuôn viên trường.</p></div></section>
            <main className="container page-content map-page">
                <div className="map-toolbar"><div><span className="map-kicker">Bản đồ tương tác</span><h2><Compass size={19} /> Vị trí phòng ban</h2></div><span className="map-result-count">{filtered.length} địa điểm</span></div>
                <section className="map-card"><div className="map-card-head"><div><strong>Bản đồ khuôn viên HUMG</strong><span>Chọn một vị trí để hiển thị marker liên quan trên bản đồ.</span></div><span className="map-status"><span /> Bản đồ trực tuyến</span></div><div className="map-frame"><MapContainer center={center} zoom={16} scrollWheelZoom className="campus-map"><TileLayer attribution="&copy; OpenStreetMap" url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" /><MapViewport selected={selected} />{visibleLocations.map((location) => <Marker key={location.id} icon={CAMPUS_MARKER_ICON} position={[location.latitude, location.longitude]} eventHandlers={{ click: () => setSelected(location) }}><Popup><strong>{location.name}</strong><br />{location.address || location.building}{location.floor && <><br />{location.floor}</>}{location.slug && <><br /><Link to={`/phong-ban/${location.slug}`}>Xem chi tiết</Link></>}</Popup></Marker>)}</MapContainer>{withCoords.length === 0 && <div className="map-empty"><MapPinned size={25} /><strong>Chưa có tọa độ bản đồ</strong><span>Danh sách phòng ban vẫn có thể tra cứu bên dưới.</span></div>}</div></section>

                <section className="location-directory"><div className="directory-head"><div><span className="map-kicker">Tra cứu địa điểm</span><h2>Tìm vị trí phòng / tòa nhà</h2></div><span>{filtered.length} kết quả</span></div><div className="location-controls"><label className="map-search"><Search size={18} /><input aria-label="Tìm vị trí phòng hoặc tòa nhà" placeholder="Nhập tên phòng, bộ phận..." value={search} onChange={(event) => setSearch(event.target.value)} /></label><div className="area-tabs">{areas.map((item) => <button key={item} type="button" className={area === item ? 'active' : ''} onClick={() => setArea(item)}>{item === 'ALL' ? 'Tất cả' : item}</button>)}</div></div><div className="location-list">{filtered.map((department) => <LocationCard key={department.id} department={department} selected={selected?.id === department.id} onSelect={setSelected} />)}{filtered.length === 0 && <div className="map-empty directory-empty"><Search size={25} /><strong>Không tìm thấy địa điểm</strong><span>Thử tên phòng hoặc chọn lại khu vực.</span></div>}</div></section>
            </main>
        </>
    );
}

function LocationCard({ department, selected, onSelect }) {
    return <article className={`location-card ${selected ? 'selected' : ''}`} onClick={() => onSelect(department)}><div className="location-card-main"><div className="location-icon"><Building2 size={19} /></div><div><h3>{department.name}</h3><p>{department.address || `${department.building || 'Cơ sở chính'} ${department.floor || ''}`}</p><div className="location-meta"><span><MapPin size={13} />{department.latitude ? `${department.latitude.toFixed(6)}, ${department.longitude.toFixed(6)}` : 'Chưa có tọa độ'}</span>{department.phone && <span><Phone size={13} />{department.phone}</span>}</div></div></div><div className="location-card-side"><span>{department.kind || department.building || 'HUMG'}</span>{department.slug && <Link to={`/phong-ban/${department.slug}`} aria-label={`Xem chi tiết ${department.name}`}><ChevronRight size={18} /></Link>}</div><div className="location-card-footer"><button type="button" disabled={!department.latitude} onClick={(event) => { event.stopPropagation(); onSelect(department); }}><MapPin size={14} /> {department.latitude ? 'Định vị trên bản đồ' : 'Chưa có vị trí bản đồ'}</button>{department.floor && <span><Building2 size={13} /> {department.floor}</span>}</div></article>;
}

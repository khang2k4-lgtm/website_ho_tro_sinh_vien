import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import api from '../services/api';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function MapPage() {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    api.get('/departments').then((r) => setDepartments(r.data)).catch(() => setDepartments([]));
  }, []);

  const withCoords = departments.filter((d) => d.latitude && d.longitude);
  const center = withCoords[0] ? [withCoords[0].latitude, withCoords[0].longitude] : [21.0734, 105.7738];

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <h1 className="page-title">Bản đồ trường</h1>
      <p className="page-subtitle">Vị trí các phòng ban tại Trường Đại học Mỏ - Địa chất.</p>
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <MapContainer center={center} zoom={16} scrollWheelZoom className="leaflet-container">
          <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {withCoords.map((d) => (
            <Marker key={d.id} position={[d.latitude, d.longitude]}>
              <Popup>
                <strong>{d.name}</strong><br />
                {d.building} · phòng {d.room}<br />
                <Link to={`/phong-ban/${d.slug}`}>Xem chi tiết</Link>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <div className="grid grid-2">
        {departments.map((d) => (
          <Link key={d.id} to={`/phong-ban/${d.slug}`} className="card" style={{ display: 'block' }}>
            <div className="card-body">
              <strong>{d.name}</strong>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.35rem' }}>{d.address} · {d.workingHours}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

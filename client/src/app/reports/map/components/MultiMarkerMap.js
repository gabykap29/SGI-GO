"use client"
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const icon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const DynamicMap = dynamic(
    () => import('react-leaflet').then((mod) => ({
        default: function MapWrapper({ reports }) {
            const { MapContainer, TileLayer, Marker, Popup } = mod;

            // Posición por defecto (centro de Formosa, Argentina aproximadamente)
            const defaultCenter = [-26.177319, -58.196097];

            // Filtrar solo reportes con coordenadas válidas
            const validReports = reports.filter(r => r.latitude && r.longitude);

            // Calcular el centro basado en los marcadores
            let center = defaultCenter;
            let zoom = 13;

            if (validReports.length > 0) {
                // Si hay reportes, calcular el centro promedio
                const latSum = validReports.reduce((sum, r) => sum + r.latitude, 0);
                const lngSum = validReports.reduce((sum, r) => sum + r.longitude, 0);
                center = [latSum / validReports.length, lngSum / validReports.length];

                // Ajustar zoom según la cantidad de marcadores
                if (validReports.length === 1) {
                    zoom = 15;
                } else {
                    zoom = 12;
                }
            }

            return (
                <MapContainer
                    center={center}
                    zoom={zoom}
                    scrollWheelZoom={true}
                    style={{ height: '100%', width: '100%', borderRadius: '8px' }}
                    className="shadow-lg"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {validReports.map((report) => (
                        <Marker
                            key={report.id}
                            position={[report.latitude, report.longitude]}
                            icon={icon}
                        >
                            <Popup>
                                <div style={{ minWidth: '200px' }}>
                                    <h6 className="fw-bold mb-2">{report.title}</h6>
                                    <p className="mb-1 small">
                                        <strong>Fecha:</strong> {new Date(report.date).toLocaleDateString('es-ES')}
                                    </p>
                                    <p className="mb-2 small">
                                        <strong>Estado:</strong>{' '}
                                        <span className={`badge ${report.status === 'complete' || report.status === 'completed' ? 'bg-success' :
                                                report.status === 'urgent' || report.status === 'urgente' ? 'bg-danger' :
                                                    report.status === 'pending' || report.status === 'pendiente' ? 'bg-warning' :
                                                        report.status === 'in_progress' || report.status === 'en proceso' ? 'bg-info' :
                                                            'bg-secondary'
                                            }`}>
                                            {report.status === 'complete' || report.status === 'completed' ? 'Completado' :
                                                report.status === 'urgent' || report.status === 'urgente' ? 'Urgente' :
                                                    report.status === 'pending' || report.status === 'pendiente' ? 'Pendiente' :
                                                        report.status === 'in_progress' || report.status === 'en proceso' ? 'En Progreso' :
                                                            report.status || 'Sin estado'}
                                        </span>
                                    </p>
                                    <a
                                        href={`/reports/view/${report.id}`}
                                        className="btn btn-sm btn-primary w-100"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Ver Detalle
                                    </a>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            );
        }
    })),
    {
        ssr: false,
        loading: () => (
            <div
                style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                className="bg-gray-100 rounded-lg shadow-lg"
            >
                <p className="text-gray-500">Cargando mapa...</p>
            </div>
        )
    }
);

export default function MultiMarkerMap({ reports }) {
    return (
        <div style={{ height: '600px', width: '100%' }}>
            <DynamicMap reports={reports || []} />
        </div>
    );
}

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


/**
 * Función CLAVE: next/dynamic para deshabilitar el renderizado en el servidor (SSR).
 * Esto resuelve el error 'ReferenceError: window is not defined'.
 */
const DynamicMap = dynamic(
    () => import('react-leaflet').then((mod) => {
        const { MapContainer, TileLayer, Marker, Popup } = mod;

        // Componente interno que recibe las props
        return function MapWrapper({ latitude, longitude, title }) {
            // Usar coordenadas recibidas o valores por defecto
            const mapPosition = [latitude || -26.177319, longitude || -58.196097];

            return (
                <MapContainer
                    center={mapPosition}
                    zoom={15}
                    scrollWheelZoom={false}
                    style={{ height: '50vh', width: '100%', borderRadius: '8px' }}
                    className="shadow-lg"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={mapPosition} icon={icon}>
                        <Popup>
                            {title || "Ubicación del reporte"}
                        </Popup>
                    </Marker>
                </MapContainer>
            );
        };
    }),
    {
        // 🛑 Opción CRÍTICA: ssr: false
        ssr: false,
        // Muestra un indicador de carga mientras el mapa se descarga en el cliente
        loading: () => (
            <div
                style={{ height: '50vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                className="bg-gray-100 rounded-lg shadow-lg"
            >
                <p className="text-gray-500">Cargando mapa...</p>
            </div>
        )
    }
);


export default function SectionMaps({ latitude, longitude, title }) {
    // Renderiza el componente dinámico.
    return (
        <div className="p-4 bg-white rounded-lg border border-gray-200">
            <h5 className="font-bold text-xl mb-4 text-indigo-700">Ubicación Georeferenciada</h5>
            <DynamicMap latitude={latitude} longitude={longitude} title={title} />
        </div>
    );
}
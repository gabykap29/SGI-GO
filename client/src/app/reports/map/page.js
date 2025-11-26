"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '../../../../components/Header';
import { Sidebar } from '../../../../components/Sidebard';
import { getReportsWithFilters } from '../../../../hooks/handleReportsFilters';
import useTheme from '../../../../hooks/useTheme';
import { handleError } from '../../../../hooks/toaster';
import { useAuth } from '../../../../hooks/useAuth';
import SearchFilters from './components/SearchFilters';
import MultiMarkerMap from './components/MultiMarkerMap';

export default function ReportsMapPage() {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const { theme, toggleTheme, isDark } = useTheme();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('sidebarCollapsed');
            return saved !== null ? JSON.parse(saved) : true;
        }
        return true;
    });
    const [isMobile, setIsMobile] = useState(false);

    // Estados para los datos
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalResults, setTotalResults] = useState(0);
    const [hasSearched, setHasSearched] = useState(false);

    const LIMIT = 30;

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, isLoading, router]);

    // Auto-colapsar en pantallas pequeñas
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) {
                setSidebarCollapsed(true);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Guardar estado del sidebar en localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
        }
    }, [sidebarCollapsed]);

    const handleSearch = async (filters) => {
        setLoading(true);
        setError(null);
        setHasSearched(true);

        try {
            // Construir filtros para el backend
            const searchFilters = {};

            if (filters.dateFrom) {
                searchFilters.date_from = filters.dateFrom;
            }
            if (filters.dateTo) {
                searchFilters.date_to = filters.dateTo;
            }
            if (filters.departmentId) {
                searchFilters.department_id = parseInt(filters.departmentId);
            }
            if (filters.localityId) {
                searchFilters.locality_id = parseInt(filters.localityId);
            }
            if (filters.typeReportId) {
                searchFilters.type_report_id = parseInt(filters.typeReportId);
            }
            if (filters.status) {
                searchFilters.status = filters.status;
            }

            // Obtener reportes con límite de 30
            const result = await getReportsWithFilters(searchFilters, 1, LIMIT);

            if (result.error) {
                setError(result.error);
                setReports([]);
                setTotalResults(0);
                handleError(result.error);
            } else {
                // Filtrar solo reportes con coordenadas válidas
                const reportsWithCoords = (result.data || []).filter(
                    r => r.latitude && r.longitude
                );

                setReports(reportsWithCoords);
                setTotalResults(result.total || 0);

                if (reportsWithCoords.length === 0 && result.data && result.data.length > 0) {
                    handleError('Los reportes encontrados no tienen coordenadas registradas');
                }
            }
        } catch (err) {
            const errorMsg = 'Error inesperado al buscar los informes';
            setError(errorMsg);
            setReports([]);
            setTotalResults(0);
            handleError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className={`min-vh-100 ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light'}`}>
            <Header
                sidebarCollapsed={sidebarCollapsed}
                setSidebarCollapsed={setSidebarCollapsed}
                isDark={theme === 'dark'}
                toggleTheme={toggleTheme}
                isMobile={isMobile}
            />

            <div className="d-flex">
                {/* Sidebar */}
                <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} isDark={true} />

                {/* Main content */}
                <main className="flex-grow-1 p-4" style={{ marginLeft: isMobile ? '0' : (sidebarCollapsed ? '70px' : '250px'), width: isMobile ? '100%' : (sidebarCollapsed ? 'calc(100% - 70px)' : 'calc(100% - 250px)'), transition: 'margin-left 0.3s ease, width 0.3s ease' }}>
                    {/* Title Card */}
                    <div className={isDark ? "p-4 rounded shadow-sm border-start border-4 border-primary bg-dark mb-4" : "p-4 rounded shadow-sm border-start border-4 border-secondary bg-white mb-4"}>
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h1 className="h3 mb-1">
                                        <i className="fas fa-map-marked-alt me-2"></i>
                                        Mapa de Reportes
                                    </h1>
                                    <p className="text-muted mb-0">Visualiza reportes georeferenciados en el mapa</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filtros de búsqueda */}
                    <SearchFilters onSearch={handleSearch} loading={loading} />

                    {/* Información de resultados */}
                    {hasSearched && !loading && (
                        <div className="mb-3">
                            {reports.length > 0 ? (
                                <div className="alert alert-info d-flex align-items-center">
                                    <i className="fas fa-info-circle me-2"></i>
                                    <div className="flex-grow-1">
                                        Mostrando {reports.length} informe{reports.length !== 1 ? 's' : ''} con coordenadas
                                        {totalResults > LIMIT && (
                                            <span className="ms-2">
                                                (Límite de {LIMIT} resultados alcanzado de {totalResults} totales)
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="alert alert-warning d-flex align-items-center">
                                    <i className="fas fa-exclamation-triangle me-2"></i>
                                    <span>No se encontraron informes con coordenadas que coincidan con los filtros</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Loading state */}
                    {loading && (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                            <p className="mt-3 text-muted">Buscando informes...</p>
                        </div>
                    )}

                    {/* Error state */}
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            <i className="fas fa-exclamation-triangle me-2"></i>
                            <strong>Error:</strong> {error}
                        </div>
                    )}

                    {/* Mapa */}
                    {!loading && hasSearched && (
                        <div className="card shadow-sm">
                            <div className="card-body p-3">
                                <MultiMarkerMap reports={reports} />
                            </div>
                        </div>
                    )}

                    {/* Mensaje inicial */}
                    {!loading && !hasSearched && (
                        <div className="text-center py-5">
                            <i className="fas fa-map-marked-alt fa-4x text-muted mb-3"></i>
                            <h5 className="text-muted">Usa los filtros de búsqueda para comenzar</h5>
                            <p className="text-muted">Los reportes con coordenadas se mostrarán en el mapa</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

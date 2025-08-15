"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '../../../../components/Header';
import { Sidebar } from '../../../../components/Sidebard';
import FilterPanel from '../../../../components/FilterPanel';
import { getReportsWithFilters, getActiveFiltersDescription } from '../../../../hooks/handleReportsFilters';
import { getDepartments } from '../../../../hooks/handleDepartments';
import { getLocalities } from '../../../../hooks/handleLocalities';
import { getTypeReports } from '../../../../hooks/handleTypeReports';
import useTheme from '../../../../hooks/useTheme';
import { handleError } from '../../../../hooks/toaster';
import { useAuth } from '../../../../hooks/useAuth';
import { Users, Plus, Edit, Trash2, Search, Eye, EyeOff } from 'lucide-react';

export default function ReportsListPage() {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const { theme, toggleTheme, isDark } = useTheme();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    // Estados para los datos
    const [reports, setReports] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Estados para filtros y paginación
    const [filters, setFilters] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    
    // Estados para datos de referencia
    const [departments, setDepartments] = useState([]);
    const [localities, setLocalities] = useState([]);
    const [typeReports, setTypeReports] = useState([]);

    useEffect(() => {
        loadReferenceData();
        fetchReports();
    }, []);

    const loadReferenceData = async () => {
        try {
            const [deptData, typeData] = await Promise.all([
                getDepartments(),
                getTypeReports()
            ]);
            setDepartments(deptData || []);
            setTypeReports(typeData || []);
        } catch (error) {
            console.error('Error loading reference data:', error);
        }
    };

    const fetchReports = async (newFilters = filters, page = currentPage) => {
        setLoading(true);
        setError(null);
        
        try {
            const result = await getReportsWithFilters(newFilters, page, pageSize);
            
            if (result.error) {
                setError(result.error);
                setReports([]);
                setTotal(0);
                handleError(result.error);
            } else {
                setReports(result.data);
                setTotal(result.total);
            }
        } catch (err) {
            const errorMsg = 'Error inesperado al cargar los informes';
            setError(errorMsg);
            setReports([]);
            setTotal(0);
            handleError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleFiltersChange = (newFilters) => {
        setFilters(newFilters);
        setCurrentPage(1);
        fetchReports(newFilters, 1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchReports(filters, page);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('es-ES');
    };

    const getDepartmentName = (id) => {
        const dept = departments.find(d => d.id === id);
        return dept ? dept.name : 'N/A';
    };

    const getLocalityName = (id) => {
        const locality = localities.find(l => l.id === id);
        return locality ? locality.name : 'N/A';
    };

    const getTypeReportName = (id) => {
        const type = typeReports.find(t => t.id === id);
        return type ? type.name : 'N/A';
    };

    const totalPages = Math.ceil(total / pageSize);
    const activeFiltersDesc = getActiveFiltersDescription(filters, departments, localities, typeReports);

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
                sidebarCollapsed={!sidebarOpen}
                setSidebarCollapsed={(collapsed) => setSidebarOpen(!collapsed)}
                isDark={theme === 'dark'}
                toggleTheme={toggleTheme}
            />

            <div className="d-flex">
                {/* Sidebar */}
                <Sidebar isCollapsed={!sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

                {/* Main content */}
                <main className="flex-grow-1 p-4" style={{ marginLeft: sidebarOpen ? '0' : '0', transition: 'margin-left 0.3s ease' }}>
                        {/* Title Card */}
                <div className={isDark ? "p-4 rounded shadow-sm border-start border-4 border-primary bg-dark": "p-4 rounded shadow-sm border-start border-4 border-secondary bg-white"}>

                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h1 className="h3 mb-1">Lista de Informes</h1>
                                        <p className="text-muted mb-0">Gestiona y visualiza todos los informes del sistema</p>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <i className="fas fa-file-alt fa-2x text-primary me-3"></i>
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={() => router.push('/reports/create')}
                                        >
                                            <i className="fas fa-plus me-1"></i>
                                            Nuevo Informe
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Panel de filtros */}
                        <FilterPanel 
                            onFiltersChange={handleFiltersChange}
                            initialFilters={filters}
                        />

                        {/* Información de filtros activos */}
                        {activeFiltersDesc.length > 0 && (
                            <div className="alert alert-info mb-3">
                                <strong>Filtros activos:</strong>
                                <ul className="mb-0 mt-1">
                                    {activeFiltersDesc.map((desc, index) => (
                                        <li key={index}>{desc}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Información de resultados */}
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div>
                                <span className="text-muted">
                                    Mostrando {reports.length} de {total} informes
                                    {currentPage > 1 && ` (Página ${currentPage} de ${totalPages})`}
                                </span>
                            </div>
                            <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => fetchReports(filters, currentPage)}
                                disabled={loading}
                            >
                                <i className="fas fa-sync-alt me-1"></i>
                                Actualizar
                            </button>
                        </div>

                        {/* Loading state */}
                        {loading && (
                            <div className="loading-state fade-in">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Cargando...</span>
                                </div>
                                <p className="mt-3 text-muted mb-0">Cargando informes...</p>
                            </div>
                        )}

                        {/* Error state */}
                        {error && (
                            <div className="alert alert-danger error-state fade-in" role="alert">
                                <i className="fas fa-exclamation-triangle me-2"></i>
                                <strong>Error:</strong> {error}
                            </div>
                        )}

                        {/* Empty state */}
                        {!loading && !error && reports.length === 0 && (
                            <div className="empty-state fade-in">
                                <i className="fas fa-file-alt"></i>
                                <h5 className="text-muted mb-2">No se encontraron informes</h5>
                                <p className="text-muted mb-0">No hay informes que coincidan con los filtros aplicados.</p>
                            </div>
                        )}

                        {/* Reports table */}
                        {!loading && !error && reports.length > 0 && (
                            <div className="card shadow-sm reports-table">
                                <div className="card-body p-0">
                                    <div className="table-responsive">
                                        <table className="table table-striped table-hover mb-0">
                                    <thead className={theme === 'dark' ? 'table-dark' : 'table-light'}>
                                        <tr>
                                            <th>Título</th>
                                            <th>Departamento</th>
                                            <th>Localidad</th>
                                            <th>Tipo</th>
                                            <th>Fecha</th>
                                            <th>Estado</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reports.map((report) => (
                                            <tr key={report.id}>
                                                <td>
                                                    <strong>{report.title}</strong>
                                                    {report.description && (
                                                        <small className="d-block text-muted">
                                                            {report.description.length > 50 
                                                                ? `${report.description.substring(0, 50)}...`
                                                                : report.description}
                                                        </small>
                                                    )}
                                                </td>
                                                <td>{getDepartmentName(report.department_id)}</td>
                                                <td>{getLocalityName(report.locality_id)}</td>
                                                <td>{getTypeReportName(report.type_report_id)}</td>
                                                <td>{formatDate(report.date)}</td>
                                                <td>
                                                    <span className={`badge ${
                                                        report.status === 'completed' ? 'bg-success' :
                                                        report.status === 'in_progress' ? 'bg-warning' :
                                                        'bg-secondary'
                                                    }`}>
                                                        {report.status === 'completed' ? 'Completado' :
                                                         report.status === 'in_progress' ? 'En Progreso' :
                                                         'Pendiente'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="btn-group btn-group-sm" role="group">
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-primary"
                                                            onClick={() => router.push(`/reports/view/${report.id}`)}
                                                            title="Ver informe"
                                                        >
                                                            <Eye size={15} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-secondary"
                                                            onClick={() => router.push(`/reports/edit/${report.id}`)}
                                                            title="Editar informe"
                                                        >
                                                            <Edit size={15} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Pagination */}
                        {!loading && !error && totalPages > 1 && (
                            <div className="pagination-container mt-4">
                                <div className="d-flex justify-content-between align-items-center flex-wrap">
                                    <div className="pagination-info mb-2 mb-md-0">
                                        Mostrando {((currentPage - 1) * reportsPerPage) + 1} - {Math.min(currentPage * reportsPerPage, totalReports)} de {totalReports} informes
                                    </div>
                                    <nav aria-label="Paginación de informes">
                                        <ul className="pagination justify-content-center mb-0">
                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            Anterior
                                        </button>
                                    </li>
                                    
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            pageNum = currentPage - 2 + i;
                                        }
                                        
                                        return (
                                            <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                                                <button
                                                    className="page-link"
                                                    onClick={() => handlePageChange(pageNum)}
                                                >
                                                    {pageNum}
                                                </button>
                                            </li>
                                        );
                                    })}
                                    
                                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                        >
                                            Siguiente
                                        </button>
                                    </li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
        </div>
    );
}
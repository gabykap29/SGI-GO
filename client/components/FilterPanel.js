import { useState, useEffect } from 'react';
import { getDepartments } from '../hooks/handleDepartments';
import { getLocalities } from '../hooks/handleLocalities';
import { getTypeReports } from '../hooks/handleTypeReports';
import { Filter } from 'lucide-react';
export default function FilterPanel({ onFiltersChange, initialFilters = {} }) {
    const [filters, setFilters] = useState({
        title: '',
        department_id: '',
        locality_id: '',
        type_report_id: '',
        date: '',
        content: '',
        description: '',
        ...initialFilters
    });

    const [departments, setDepartments] = useState([]);
    const [localities, setLocalities] = useState([]);
    const [typeReports, setTypeReports] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

    useEffect(() => {
        loadDepartments();
        loadTypeReports();
    }, []);

    useEffect(() => {
        if (filters.department_id) {
            loadLocalities(filters.department_id);
        } else {
            setLocalities([]);
            setFilters(prev => ({ ...prev, locality_id: '' }));
        }
    }, [filters.department_id]);

    // Hook para manejar el redimensionamiento de la ventana
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const loadDepartments = async () => {
        try {
            const data = await getDepartments();
            setDepartments(data || []);
        } catch (error) {
            console.error('Error loading departments:', error);
        }
    };

    const loadLocalities = async (departmentId) => {
        try {
            const data = await getLocalities(departmentId);
            setLocalities(data || []);
        } catch (error) {
            console.error('Error loading localities:', error);
        }
    };

    const loadTypeReports = async () => {
        try {
            const data = await getTypeReports();
            setTypeReports(data || []);
        } catch (error) {
            console.error('Error loading type reports:', error);
        }
    };

    const handleFilterChange = (field, value) => {
        const newFilters = { ...filters, [field]: value };
        setFilters(newFilters);
        onFiltersChange(newFilters);
    };

    const clearFilters = () => {
        const clearedFilters = {
            title: '',
            department_id: '',
            locality_id: '',
            type_report_id: '',
            date: '',
            content: '',
            description: ''
        };
        setFilters(clearedFilters);
        onFiltersChange(clearedFilters);
    };

    const hasActiveFilters = Object.values(filters).some(value => value !== '');

    return (
        <div 
            className="filter-panel card mb-4 shadow" 
            style={{ 
                transition: 'margin-left 0.3s ease, width 0.3s ease',
                maxWidth: '100%',
                overflow: 'hidden',
                position: 'relative',
                zIndex: 10
            }}
        >
            <div className="card-header d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center px-3 px-md-4 py-3 gap-2" style={{ minHeight: '60px' }}>
                <h5 className="mb-0 d-flex align-items-center fw-semibold">
                    <span className="d-none d-sm-inline">Filtros de Búsqueda</span>
                    <span className="d-inline d-sm-none">Filtros</span>
                </h5>
                <div className="d-flex flex-wrap gap-2 w-100 w-sm-auto justify-content-end" style={{ minWidth: windowWidth < 576 ? '100%' : 'auto' }}>
                    {hasActiveFilters && (
                        <button
                            type="button"
                            className="btn btn-outline-danger btn-sm rounded-pill px-2 px-sm-3 flex-fill flex-sm-grow-0"
                            onClick={clearFilters}
                            title="Limpiar filtros"
                            aria-label="Limpiar filtros"
                        >
                            <Filter size={15}/>
                            <span className="d-none d-sm-inline">Limpiar</span>
                        </button>
                    )}
                    <button
                        type="button"
                        className="btn btn-outline-primary btn-sm rounded-pill px-2 px-sm-3 flex-fill flex-sm-grow-0"
                        onClick={() => setIsExpanded(!isExpanded)}
                        aria-expanded={isExpanded}
                        aria-label={isExpanded ? 'Contraer filtros' : 'Expandir filtros'}
                    >
                        <Filter size={15}/>
                        <span className="d-none d-sm-inline">{isExpanded ? 'Contraer' : 'Expandir'}</span>
                    </button>
                </div>
            </div>

            <div className={`collapse ${isExpanded ? 'show' : ''}`}>
                <div className="card-body p-3 p-md-4">
                    <div className="row g-3 g-md-4">
                        {/* Título */}
                        <div className="col-12 col-sm-6 col-lg-4">
                            <label htmlFor="filter-title" className="form-label fw-semibold d-flex align-items-center" style={{ fontSize: windowWidth < 576 ? '0.9rem' : '1rem' }}>
                                <i className="fas fa-heading me-2 text-primary"></i>
                                <span className="d-none d-sm-inline">Título</span>
                                <span className="d-inline d-sm-none">Título</span>
                            </label>
                            <input
                                type="text"
                                id="filter-title"
                                className="form-control rounded-3 shadow-sm"
                                placeholder={windowWidth < 576 ? "Título..." : "Buscar por título..."}
                                value={filters.title}
                                onChange={(e) => handleFilterChange('title', e.target.value)}
                                aria-describedby="filter-title-help"
                                style={{ fontSize: windowWidth < 576 ? '0.9rem' : '1rem' }}
                            />
                            <div id="filter-title-help" className="form-text text-muted mt-1 small d-none d-md-block">
                                Ingresa palabras clave del título.
                            </div>
                        </div>

                        {/* Departamento */}
                        <div className="col-12 col-sm-6 col-lg-4">
                            <label htmlFor="filter-department" className="form-label fw-semibold d-flex align-items-center">
                                <i className="fas fa-building me-2 text-primary"></i>
                                <span className="d-none d-sm-inline">Departamento</span>
                                <span className="d-inline d-sm-none">Depto.</span>
                            </label>
                            <select
                                id="filter-department"
                                className="form-select rounded-3 shadow-sm"
                                value={filters.department_id}
                                onChange={(e) => handleFilterChange('department_id', e.target.value)}
                                aria-describedby="filter-department-help"
                            >
                                <option value="">Todos</option>
                                {departments.map((dept) => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.name}
                                    </option>
                                ))}
                            </select>
                            <div id="filter-department-help" className="form-text text-muted mt-1 small d-none d-md-block">
                                Selecciona un departamento.
                            </div>
                        </div>

                        {/* Localidad */}
                        <div className="col-12 col-sm-6 col-lg-4">
                            <label htmlFor="filter-locality" className="form-label fw-semibold d-flex align-items-center">
                                <i className="fas fa-map-marker-alt me-2 text-primary"></i>
                                <span className="d-none d-sm-inline">Localidad</span>
                                <span className="d-inline d-sm-none">Local.</span>
                            </label>
                            <select
                                id="filter-locality"
                                className="form-select rounded-3 shadow-sm"
                                value={filters.locality_id}
                                onChange={(e) => handleFilterChange('locality_id', e.target.value)}
                                disabled={!filters.department_id}
                                aria-describedby="filter-locality-help"
                            >
                                <option value="">Todas</option>
                                {localities.map((locality) => (
                                    <option key={locality.id} value={locality.id}>
                                        {locality.name}
                                    </option>
                                ))}
                            </select>
                            <div id="filter-locality-help" className="form-text text-muted mt-1 small d-none d-md-block">
                                Selecciona una localidad.
                            </div>
                        </div>

                        {/* Tipo de Informe */}
                        <div className="col-12 col-sm-6 col-lg-4">
                            <label htmlFor="filter-type" className="form-label fw-semibold d-flex align-items-center">
                                <i className="fas fa-tags me-2 text-primary"></i>
                                <span className="d-none d-sm-inline">Tipo de Informe</span>
                                <span className="d-inline d-sm-none">Tipo</span>
                            </label>
                            <select
                                id="filter-type"
                                className="form-select rounded-3 shadow-sm"
                                value={filters.type_report_id}
                                onChange={(e) => handleFilterChange('type_report_id', e.target.value)}
                                aria-describedby="filter-type-help"
                            >
                                <option value="">Todos</option>
                                {typeReports.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                            <div id="filter-type-help" className="form-text text-muted mt-1 small d-none d-md-block">
                                Selecciona un tipo de informe.
                            </div>
                        </div>

                        {/* Fecha */}
                        <div className="col-12 col-sm-6 col-lg-4">
                            <label htmlFor="filter-date" className="form-label fw-semibold d-flex align-items-center">
                                <i className="fas fa-calendar me-2 text-primary"></i>
                                Fecha
                            </label>
                            <input
                                type="date"
                                id="filter-date"
                                className="form-control rounded-3 shadow-sm"
                                value={filters.date}
                                onChange={(e) => handleFilterChange('date', e.target.value)}
                                aria-describedby="filter-date-help"
                            />
                            <div id="filter-date-help" className="form-text text-muted mt-1 small d-none d-md-block">
                                Selecciona una fecha específica.
                            </div>
                        </div>

                        {/* Contenido */}
                        <div className="col-12 col-sm-6 col-lg-4">
                            <label htmlFor="filter-content" className="form-label fw-semibold d-flex align-items-center">
                                <i className="fas fa-file-alt me-2 text-primary"></i>
                                <span className="d-none d-sm-inline">Contenido</span>
                                <span className="d-inline d-sm-none">Cont.</span>
                            </label>
                            <input
                                type="text"
                                id="filter-content"
                                className="form-control rounded-3 shadow-sm"
                                placeholder={windowWidth < 576 ? "Contenido..." : "Buscar contenido..."}
                                value={filters.content}
                                onChange={(e) => handleFilterChange('content', e.target.value)}
                                aria-describedby="filter-content-help"
                                style={{ fontSize: windowWidth < 576 ? '0.9rem' : '1rem' }}
                            />
                            <div id="filter-content-help" className="form-text text-muted mt-1 small d-none d-md-block">
                                Busca palabras clave en el contenido.
                            </div>
                        </div>

                        {/* Descripción */}
                        <div className="col-12">
                            <label htmlFor="filter-description" className="form-label fw-semibold d-flex align-items-center">
                                <i className="fas fa-align-left me-2 text-primary"></i>
                                <span className="d-none d-sm-inline">Descripción</span>
                                <span className="d-inline d-sm-none">Desc.</span>
                            </label>
                            <input
                                type="text"
                                id="filter-description"
                                className="form-control rounded-3 shadow-sm"
                                placeholder={windowWidth < 576 ? "Descripción..." : "Buscar descripción..."}
                                value={filters.description}
                                onChange={(e) => handleFilterChange('description', e.target.value)}
                                aria-describedby="filter-description-help"
                                style={{ fontSize: windowWidth < 576 ? '0.9rem' : '1rem' }}
                            />
                            <div id="filter-description-help" className="form-text text-muted mt-1 small d-none d-md-block">
                                Busca palabras clave en la descripción.
                            </div>
                        </div>
                    </div>

                    {/* Indicador de filtros activos */}
                    {hasActiveFilters && (
                        <div className="mt-3 mt-md-4">
                            <div className="alert alert-primary d-flex flex-column flex-sm-row align-items-start align-items-sm-center mb-0 shadow-sm rounded-3 border-0 gap-2">
                                <div className="d-flex align-items-center">
                                    <i className="fas fa-info-circle me-2"></i>
                                    <span className="fw-medium">Filtros activos aplicados</span>
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-link text-primary btn-sm ms-auto p-0 fw-semibold align-self-end align-self-sm-center"
                                    onClick={clearFilters}
                                    aria-label="Limpiar todos los filtros"
                                >
                                    <i className="fas fa-times me-1 d-sm-none"></i>
                                    <span className="d-none d-sm-inline">Limpiar todos</span>
                                    <span className="d-inline d-sm-none">Limpiar</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
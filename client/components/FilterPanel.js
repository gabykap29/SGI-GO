import { useState, useEffect } from 'react';
import { getDepartments } from '../hooks/handleDepartments';
import { getLocalities } from '../hooks/handleLocalities';
import { getTypeReports } from '../hooks/handleTypeReports';

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
        <div className="filter-panel card mb-4 shadow bg-white mt-3">

            <div className="card-header d-flex justify-content-between align-items-center px-4 py-3 bg-white">
                <h5 className="mb-0 d-flex align-items-center fw-semibold">
                    <i className="fas fa-filter me-2 text-primary"></i>
                    Filtros de Búsqueda
                </h5>
                <div className="d-flex gap-2">
                    {hasActiveFilters && (
                        <button
                            type="button"
                            className="btn btn-outline-danger btn-sm rounded-pill px-3"
                            onClick={clearFilters}
                            title="Limpiar filtros"
                            aria-label="Limpiar filtros"
                        >
                            <i className="fas fa-times me-1"></i>
                            Limpiar
                        </button>
                    )}
                    <button
                        type="button"
                        className="btn btn-outline-primary btn-sm rounded-pill px-3"
                        onClick={() => setIsExpanded(!isExpanded)}
                        aria-expanded={isExpanded}
                        aria-label={isExpanded ? 'Contraer filtros' : 'Expandir filtros'}
                    >
                        <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} me-1`}></i>
                        {isExpanded ? 'Contraer' : 'Expandir'}
                    </button>
                </div>
            </div>

            <div className={`collapse ${isExpanded ? 'show' : ''}`}>
                <div className="card-body p-4">
                    <div className="row g-4">
                        {/* Título */}
                        <div className="col-md-6">
                            <label htmlFor="filter-title" className="form-label fw-semibold d-flex align-items-center">
                                <i className="fas fa-heading me-2 text-primary"></i>
                                Título
                            </label>
                            <input
                                type="text"
                                id="filter-title"
                                className="form-control rounded-3 shadow-sm"
                                placeholder="Buscar por título..."
                                value={filters.title}
                                onChange={(e) => handleFilterChange('title', e.target.value)}
                                aria-describedby="filter-title-help"
                            />
                            <div id="filter-title-help" className="form-text text-muted mt-1 small">
                                Ingresa palabras clave del título.
                            </div>
                        </div>

                        {/* Departamento */}
                        <div className="col-md-6">
                            <label htmlFor="filter-department" className="form-label fw-semibold d-flex align-items-center">
                                <i className="fas fa-building me-2 text-primary"></i>
                                Departamento
                            </label>
                            <select
                                id="filter-department"
                                className="form-select rounded-3 shadow-sm"
                                value={filters.department_id}
                                onChange={(e) => handleFilterChange('department_id', e.target.value)}
                                aria-describedby="filter-department-help"
                            >
                                <option value="">Todos los departamentos</option>
                                {departments.map((dept) => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.name}
                                    </option>
                                ))}
                            </select>
                            <div id="filter-department-help" className="form-text text-muted mt-1 small">
                                Selecciona un departamento.
                            </div>
                        </div>

                        {/* Localidad */}
                        <div className="col-md-6">
                            <label htmlFor="filter-locality" className="form-label fw-semibold d-flex align-items-center">
                                <i className="fas fa-map-marker-alt me-2 text-primary"></i>
                                Localidad
                            </label>
                            <select
                                id="filter-locality"
                                className="form-select rounded-3 shadow-sm"
                                value={filters.locality_id}
                                onChange={(e) => handleFilterChange('locality_id', e.target.value)}
                                disabled={!filters.department_id}
                                aria-describedby="filter-locality-help"
                            >
                                <option value="">Todas las localidades</option>
                                {localities.map((locality) => (
                                    <option key={locality.id} value={locality.id}>
                                        {locality.name}
                                    </option>
                                ))}
                            </select>
                            <div id="filter-locality-help" className="form-text text-muted mt-1 small">
                                Selecciona una localidad (requiere departamento).
                            </div>
                        </div>

                        {/* Tipo de Informe */}
                        <div className="col-md-6">
                            <label htmlFor="filter-type" className="form-label fw-semibold d-flex align-items-center">
                                <i className="fas fa-tags me-2 text-primary"></i>
                                Tipo de Informe
                            </label>
                            <select
                                id="filter-type"
                                className="form-select rounded-3 shadow-sm"
                                value={filters.type_report_id}
                                onChange={(e) => handleFilterChange('type_report_id', e.target.value)}
                                aria-describedby="filter-type-help"
                            >
                                <option value="">Todos los tipos</option>
                                {typeReports.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                            <div id="filter-type-help" className="form-text text-muted mt-1 small">
                                Selecciona un tipo de informe.
                            </div>
                        </div>

                        {/* Fecha */}
                        <div className="col-md-6">
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
                            <div id="filter-date-help" className="form-text text-muted mt-1 small">
                                Selecciona una fecha específica.
                            </div>
                        </div>

                        {/* Contenido */}
                        <div className="col-md-6">
                            <label htmlFor="filter-content" className="form-label fw-semibold d-flex align-items-center">
                                <i className="fas fa-file-alt me-2 text-primary"></i>
                                Contenido
                            </label>
                            <input
                                type="text"
                                id="filter-content"
                                className="form-control rounded-3 shadow-sm"
                                placeholder="Buscar en contenido..."
                                value={filters.content}
                                onChange={(e) => handleFilterChange('content', e.target.value)}
                                aria-describedby="filter-content-help"
                            />
                            <div id="filter-content-help" className="form-text text-muted mt-1 small">
                                Busca palabras clave en el contenido.
                            </div>
                        </div>

                        {/* Descripción */}
                        <div className="col-12">
                            <label htmlFor="filter-description" className="form-label fw-semibold d-flex align-items-center">
                                <i className="fas fa-align-left me-2 text-primary"></i>
                                Descripción
                            </label>
                            <input
                                type="text"
                                id="filter-description"
                                className="form-control rounded-3 shadow-sm"
                                placeholder="Buscar en descripción..."
                                value={filters.description}
                                onChange={(e) => handleFilterChange('description', e.target.value)}
                                aria-describedby="filter-description-help"
                            />
                            <div id="filter-description-help" className="form-text text-muted mt-1 small">
                                Busca palabras clave en la descripción.
                            </div>
                        </div>
                    </div>

                    {/* Indicador de filtros activos */}
                    {hasActiveFilters && (
                        <div className="mt-4">
                            <div className="alert alert-primary d-flex align-items-center mb-0 shadow-sm rounded-3 border-0">
                                <i className="fas fa-info-circle me-2"></i>
                                <span className="fw-medium">Filtros activos aplicados</span>
                                <button
                                    type="button"
                                    className="btn btn-link text-primary btn-sm ms-auto p-0 fw-semibold"
                                    onClick={clearFilters}
                                    aria-label="Limpiar todos los filtros"
                                >
                                    Limpiar todos
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
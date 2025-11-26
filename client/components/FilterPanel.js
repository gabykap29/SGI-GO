"use client";
import React, { useState, useEffect, useCallback, useMemo } from 'react';
// Importamos los íconos necesarios (Lucide React)
import { Filter, Search, Building, MapPin, Tag, Calendar, FileText, X } from 'lucide-react';

// --- Datos de ejemplo (se mantienen igual) ---
const initialDepartments = [{ id: '1', name: 'Formosa' }, { id: '2', name: 'Pilcomayo' }];
const initialLocalities = [
    { id: '101', name: 'Ciudad de Formosa', department_id: '1' },
    { id: '102', name: 'Pirané', department_id: '1' },
    { id: '201', name: 'Clorinda', department_id: '2' },
];
const initialTypeReports = [{ id: 'A', name: 'Accidente' }, { id: 'B', name: 'Delito' }];
// -----------------------------------------------------------

const initialFilters = {
    title: '',
    department_id: '',
    locality_id: '',
    type_report_id: '',
    date_from: '',
    date_to: '',
    content: '',
    description: '',
    status: ''
};

export default function ReportFilterPanel({ onFiltersChange }) {
    // 1. ESTADOS
    const [isExpanded, setIsExpanded] = useState(true);
    const [filters, setFilters] = useState(initialFilters);
    const [windowWidth, setWindowWidth] = useState(0);

    const [departments] = useState(initialDepartments);
    const [localitiesData] = useState(initialLocalities);
    const [typeReports] = useState(initialTypeReports);

    // 2. EFECTOS PARA DIMENSIONES DE PANTALLA
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const handleResize = () => setWindowWidth(window.innerWidth);
            handleResize();
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, []);

    // 3. LÓGICA DE FILTRADO Y ESTADOS DERIVADOS
    const filteredLocalities = useMemo(() => {
        if (!filters.department_id) return localitiesData;
        return localitiesData.filter(loc => loc.department_id === filters.department_id);
    }, [filters.department_id, localitiesData]);

    const hasActiveFilters = useMemo(() => {
        return Object.entries(filters).some(([key, value]) => {
            if (key === 'locality_id' && !filters.department_id) return false;
            return value !== '' && value !== 0;
        });
    }, [filters]);

    // 4. MANEJADORES DE EVENTOS
    const handleFilterChange = useCallback((name, value) => {
        // Obtenemos el valor previo *antes* de la actualización
        setFilters(prev => {
            const newFilters = { ...prev, [name]: value };

            // Si el departamento cambia, resetea la localidad
            if (name === 'department_id' && value !== prev.department_id) {
                newFilters.locality_id = '';
            }

            return newFilters;
        });
    }, []);

    const handleSearch = useCallback(() => {
        if (onFiltersChange) {
            onFiltersChange(filters);
        }
    }, [filters, onFiltersChange]);

    const clearFilters = useCallback(() => {
        setFilters(initialFilters);
        if (onFiltersChange) {
            onFiltersChange(initialFilters);
        }
    }, [onFiltersChange]);


    // 5. RENDERIZADO DEL COMPONENTE REPARADO
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
                            <X size={15} />
                            <span className="d-none d-sm-inline">Limpiar</span>
                        </button>
                    )}
                    <button
                        type="button"
                        className="btn btn-primary btn-sm rounded-pill px-2 px-sm-3 flex-fill flex-sm-grow-0"
                        onClick={handleSearch}
                        title="Aplicar filtros"
                        aria-label="Buscar"
                    >
                        <Search size={15} className="me-1" />
                        <span className="d-none d-sm-inline">Buscar</span>
                        <span className="d-inline d-sm-none">Buscar</span>
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline-primary btn-sm rounded-pill px-2 px-sm-3 flex-fill flex-sm-grow-0"
                        onClick={() => setIsExpanded(!isExpanded)}
                        aria-expanded={isExpanded}
                        aria-label={isExpanded ? 'Contraer filtros' : 'Expandir filtros'}
                    >
                        <Search size={15} />
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
                                <FileText size={15} className="me-2 text-primary" />
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
                                <Building size={15} className="me-2 text-primary" />
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
                                <MapPin size={15} className="me-2 text-primary" />
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
                                {filteredLocalities.map((locality) => (
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
                                <Tag size={15} className="me-2 text-primary" />
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

                        {/* Estado */}
                        <div className="col-12 col-sm-6 col-lg-4">
                            <label htmlFor="filter-status" className="form-label fw-semibold d-flex align-items-center">
                                <Tag size={15} className="me-2 text-primary" />
                                <span className="d-none d-sm-inline">Estado</span>
                                <span className="d-inline d-sm-none">Est.</span>
                            </label>
                            <select
                                id="filter-status"
                                className="form-select rounded-3 shadow-sm"
                                value={filters.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                aria-describedby="filter-status-help"
                            >
                                <option value="">Todos</option>
                                <option value="pending">Pendiente</option>
                                <option value="urgent">Urgente</option>
                                <option value="complete">Completado</option>
                            </select>
                            <div id="filter-status-help" className="form-text text-muted mt-1 small d-none d-md-block">
                                Selecciona un estado.
                            </div>
                        </div>

                        {/* Fecha Desde */}
                        <div className="col-12 col-sm-6 col-lg-4">
                            <label htmlFor="filter-date-from" className="form-label fw-semibold d-flex align-items-center">
                                <Calendar size={15} className="me-2 text-primary" />
                                Fecha Desde
                            </label>
                            <input
                                type="datetime-local"
                                id="filter-date-from"
                                className="form-control rounded-3 shadow-sm"
                                value={filters.date_from || ''}
                                onChange={(e) => handleFilterChange('date_from', e.target.value)}
                                aria-describedby="filter-date-from-help"
                            />
                            <div id="filter-date-from-help" className="form-text text-muted mt-1 small d-none d-md-block">
                                Fecha y hora de inicio.
                            </div>
                        </div>

                        {/* Fecha Hasta */}
                        <div className="col-12 col-sm-6 col-lg-4">
                            <label htmlFor="filter-date-to" className="form-label fw-semibold d-flex align-items-center">
                                <Calendar size={15} className="me-2 text-primary" />
                                Fecha Hasta
                            </label>
                            <input
                                type="datetime-local"
                                id="filter-date-to"
                                className="form-control rounded-3 shadow-sm"
                                value={filters.date_to || ''}
                                onChange={(e) => handleFilterChange('date_to', e.target.value)}
                                aria-describedby="filter-date-to-help"
                            />
                            <div id="filter-date-to-help" className="form-text text-muted mt-1 small d-none d-md-block">
                                Fecha y hora de fin.
                            </div>
                        </div>

                        {/* Contenido */}
                        <div className="col-12 col-sm-6 col-lg-4">
                            <label htmlFor="filter-content" className="form-label fw-semibold d-flex align-items-center">
                                <FileText size={15} className="me-2 text-primary" />
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
                                <FileText size={15} className="me-2 text-primary" />
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
                        <div className="mt-3 mt-md-4 d-flex justify-content-end">
                            <button
                                type="button"
                                className="btn btn-primary rounded-pill px-4"
                                onClick={handleSearch}
                            >
                                <Search size={18} className="me-2" />
                                Buscar Reportes
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}
"use client"
import { useState, useEffect } from 'react';
import { getDepartments } from '../../../../../hooks/handleDepartments';
import { getLocalities } from '../../../../../hooks/handleLocalities';
import { getTypeReports } from '../../../../../hooks/handleTypeReports';

export default function SearchFilters({ onSearch, loading }) {
    const [filters, setFilters] = useState({
        dateFrom: '',
        dateTo: '',
        departmentId: '',
        localityId: '',
        typeReportId: '',
        status: ''
    });

    const [departments, setDepartments] = useState([]);
    const [localities, setLocalities] = useState([]);
    const [typeReports, setTypeReports] = useState([]);

    useEffect(() => {
        loadReferenceData();
    }, []);

    useEffect(() => {
        // Cargar localidades cuando cambia el departamento
        if (filters.departmentId) {
            loadLocalities(filters.departmentId);
        } else {
            setLocalities([]);
            setFilters(prev => ({ ...prev, localityId: '' }));
        }
    }, [filters.departmentId]);

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

    const loadLocalities = async (departmentId) => {
        try {
            const localitiesData = await getLocalities(departmentId);
            setLocalities(localitiesData || []);
        } catch (error) {
            console.error('Error loading localities:', error);
            setLocalities([]);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validar que fecha desde no sea mayor que fecha hasta
        if (filters.dateFrom && filters.dateTo && filters.dateFrom > filters.dateTo) {
            alert('La fecha desde no puede ser mayor que la fecha hasta');
            return;
        }

        onSearch(filters);
    };

    const handleClear = () => {
        const clearedFilters = {
            dateFrom: '',
            dateTo: '',
            departmentId: '',
            localityId: '',
            typeReportId: '',
            status: ''
        };
        setFilters(clearedFilters);
        onSearch(clearedFilters);
    };

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-body">
                <h5 className="card-title mb-3">
                    <i className="fas fa-search me-2"></i>
                    Búsqueda Avanzada
                </h5>
                <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                        {/* Fecha desde */}
                        <div className="col-md-6 col-lg-3">
                            <label htmlFor="dateFrom" className="form-label">Fecha Desde</label>
                            <input
                                type="datetime-local"
                                className="form-control"
                                id="dateFrom"
                                name="dateFrom"
                                value={filters.dateFrom}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Fecha hasta */}
                        <div className="col-md-6 col-lg-3">
                            <label htmlFor="dateTo" className="form-label">Fecha Hasta</label>
                            <input
                                type="datetime-local"
                                className="form-control"
                                id="dateTo"
                                name="dateTo"
                                value={filters.dateTo}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Departamento */}
                        <div className="col-md-6 col-lg-3">
                            <label htmlFor="departmentId" className="form-label">Departamento</label>
                            <select
                                className="form-select"
                                id="departmentId"
                                name="departmentId"
                                value={filters.departmentId}
                                onChange={handleChange}
                            >
                                <option value="">Todos</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Localidad */}
                        <div className="col-md-6 col-lg-3">
                            <label htmlFor="localityId" className="form-label">Localidad</label>
                            <select
                                className="form-select"
                                id="localityId"
                                name="localityId"
                                value={filters.localityId}
                                onChange={handleChange}
                                disabled={!filters.departmentId}
                            >
                                <option value="">Todas</option>
                                {localities.map(loc => (
                                    <option key={loc.id} value={loc.id}>
                                        {loc.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Tipo de reporte */}
                        <div className="col-md-6 col-lg-3">
                            <label htmlFor="typeReportId" className="form-label">Tipo de Reporte</label>
                            <select
                                className="form-select"
                                id="typeReportId"
                                name="typeReportId"
                                value={filters.typeReportId}
                                onChange={handleChange}
                            >
                                <option value="">Todos</option>
                                {typeReports.map(type => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Estado */}
                        <div className="col-md-6 col-lg-3">
                            <label htmlFor="status" className="form-label">Estado</label>
                            <select
                                className="form-select"
                                id="status"
                                name="status"
                                value={filters.status}
                                onChange={handleChange}
                            >
                                <option value="">Todos</option>
                                <option value="pendiente">Pendiente</option>
                                <option value="en proceso">En Progreso</option>
                                <option value="urgente">Urgente</option>
                                <option value="completed">Completado</option>
                            </select>
                        </div>

                        {/* Botones */}
                        <div className="col-12 d-flex gap-2 justify-content-end">
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={handleClear}
                                disabled={loading}
                            >
                                <i className="fas fa-times me-1"></i>
                                Limpiar
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                        Buscando...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-search me-1"></i>
                                        Buscar
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

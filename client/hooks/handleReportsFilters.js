import { useState } from 'react';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

/**
 * Obtiene informes con filtros y paginación
 * @param {Object} filters - Objeto con los filtros a aplicar
 * @param {number} page - Número de página (por defecto 1)
 * @param {number} limit - Límite de resultados por página (por defecto 10)
 * @returns {Promise<Object>} - Objeto con data (informes) y total
 */
export async function getReportsWithFilters(filters = {}, page = 1, limit = 10) {
    const token = localStorage.getItem("token");
    
    // Construir parámetros de consulta
    const queryParams = new URLSearchParams();
    
    // Agregar paginación
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());
    
    // Agregar filtros solo si tienen valor
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
            queryParams.append(key, value.toString());
        }
    });
    
    try {
        const res = await fetch(`${apiUrl}/api/reports?${queryParams.toString()}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        });
        
        const data = await res.json();
        
        if (!res.ok) {
            console.error('Error fetching reports:', data);
            return {
                data: [],
                total: 0,
                error: data.error || 'Error al obtener los informes'
            };
        }
        
        return {
            data: data.data || [],
            total: data.total || 0,
            error: null
        };
    } catch (error) {
        console.error('Network error:', error);
        return {
            data: [],
            total: 0,
            error: 'Error de conexión'
        };
    }
}

/**
 * Hook personalizado para manejar el estado de informes con filtros
 * @param {Object} initialFilters - Filtros iniciales
 * @param {number} initialPage - Página inicial
 * @param {number} pageSize - Tamaño de página
 */
export function useReportsFilters(initialFilters = {}, initialPage = 1, pageSize = 10) {
    const [reports, setReports] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState(initialFilters);
    const [currentPage, setCurrentPage] = useState(initialPage);
    
    const fetchReports = async (newFilters = filters, page = currentPage) => {
        setLoading(true);
        setError(null);
        
        try {
            const result = await getReportsWithFilters(newFilters, page, pageSize);
            
            if (result.error) {
                setError(result.error);
                setReports([]);
                setTotal(0);
            } else {
                setReports(result.data);
                setTotal(result.total);
            }
        } catch (err) {
            setError('Error inesperado al cargar los informes');
            setReports([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    };
    
    const updateFilters = (newFilters) => {
        setFilters(newFilters);
        setCurrentPage(1); // Resetear a la primera página cuando cambian los filtros
        fetchReports(newFilters, 1);
    };
    
    const changePage = (page) => {
        setCurrentPage(page);
        fetchReports(filters, page);
    };
    
    const refresh = () => {
        fetchReports(filters, currentPage);
    };
    
    return {
        reports,
        total,
        loading,
        error,
        filters,
        currentPage,
        pageSize,
        updateFilters,
        changePage,
        refresh,
        fetchReports
    };
}

/**
 * Función auxiliar para limpiar filtros vacíos
 * @param {Object} filters - Objeto de filtros
 * @returns {Object} - Filtros limpiados
 */
export function cleanFilters(filters) {
    const cleaned = {};
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
            cleaned[key] = value;
        }
    });
    return cleaned;
}

/**
 * Función para construir una descripción legible de los filtros activos
 * @param {Object} filters - Objeto de filtros
 * @param {Array} departments - Lista de departamentos
 * @param {Array} localities - Lista de localidades
 * @param {Array} typeReports - Lista de tipos de informes
 * @returns {Array} - Array de descripciones de filtros activos
 */
export function getActiveFiltersDescription(filters, departments = [], localities = [], typeReports = []) {
    const descriptions = [];
    
    if (filters.title) {
        descriptions.push(`Título: "${filters.title}"`);
    }
    
    if (filters.department_id) {
        const dept = departments.find(d => d.id.toString() === filters.department_id.toString());
        descriptions.push(`Departamento: ${dept ? dept.name : filters.department_id}`);
    }
    
    if (filters.locality_id) {
        const locality = localities.find(l => l.id.toString() === filters.locality_id.toString());
        descriptions.push(`Localidad: ${locality ? locality.name : filters.locality_id}`);
    }
    
    if (filters.type_report_id) {
        const type = typeReports.find(t => t.id.toString() === filters.type_report_id.toString());
        descriptions.push(`Tipo: ${type ? type.name : filters.type_report_id}`);
    }
    
    if (filters.date) {
        descriptions.push(`Fecha: ${filters.date}`);
    }
    
    if (filters.content) {
        descriptions.push(`Contenido: "${filters.content}"`);
    }
    
    if (filters.description) {
        descriptions.push(`Descripción: "${filters.description}"`);
    }
    
    return descriptions;
}
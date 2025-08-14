"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, TrendingUp, AlertTriangle, CheckCircle, Clock, Users, Menu, X, Sun, Moon } from 'lucide-react';
import { Sidebar } from '../../../components/Sidebard';
import { getReports } from '../../../hooks/handleReports';
import useTheme from '../../../hooks/useTheme';

export default function DashboardInicio() {
  const router = useRouter();
  const [informes, setInformes] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const { theme, toggleTheme, isDark } = useTheme();
  const [stats, setStats] = useState({
    Urgente: 0,
    Completado: 0,
    Pendiente: 0,
  });

  // Auto-colapsar en pantallas pequeñas
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 992) {
        setSidebarCollapsed(true);
      }
    };
    // Solo ejecutar en el cliente
    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Datos de ejemplo para los últimos informes
useEffect(() => {
  const handleReports = async () => {
    const response = await getReports();
    setInformes(response.data);
    const newStats = response.data.reduce((acc, informe) => {
      const status = informe.status || "Pendiente";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    setStats(newStats);
  };
  handleReports();
}, []);

  const getBadgeClass = (tipo) => {
    switch (tipo) {
      case 'Politica':
        return 'bg-danger';
      case 'Institucional':
        return 'bg-primary';
      case 'Educación':
        return 'bg-info';
      case 'Religioso':
        return 'bg-warning';
      case 'Proselitismo':
        return 'bg-danger text-white';
      case 'Salud':
        return 'bg-success';
      case 'Seguridad':
        return 'bg-dark text-white';
      case 'Eventos Climaticos':
        return 'bg-warning';
      case 'Hídricos':
        return 'bg-primary-subtle';
      case 'Económicos':
        return 'bg-secondary';
      case 'Ambientales':
        return 'bg-success';
      case 'Sociales':
        return 'bg-info';
      case 'Turismo':
        return 'bg-pink text-white';
      case 'Deportivos':
        return 'bg-indigo text-white';
      case 'OTROS':
        return 'bg-secondary';
      default:
        return 'bg-light';
    }
  };
  
  const getEstadoBadge = (estado) => {
    switch (estado) {
      case 'Completado':
        return 'bg-success';
      case 'En Proceso':
        return 'bg-warning';
      case 'Pendiente':
        return 'bg-secondary';
      case 'Urgente':
        return 'bg-danger';
      default:
        return 'bg-light';
    }
  };

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <>
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" 
        rel="stylesheet" 
      />
      <style>
        {`
          .sidebar-expanded {
            width: 250px;
          }
          .sidebar-collapsed {
            width: 70px;
          }
          .transition-width {
            transition: width 0.3s ease-in-out;
          }
          
          /* Estilos para los enlaces en sidebar colapsado */
          .sidebar-collapsed .nav-link {
            justify-content: center;
            padding: 0.5rem;
          }
          
          .sidebar-collapsed .nav-link:hover {
            background-color: ${isDark ? 'var(--bg-tertiary)' : '#f8f9fa'};
            border-radius: 4px;
          }

          /* Sobrescribir colores de texto en modo oscuro */
          ${isDark ? `
            .text-primary {
              color: #ffffff !important;
            }
            .text-muted {
              color: #ffffff !important;
            }
            .text-secondary {
              color: #d4d4d4 !important;
            }
            .fw-bold.fs-4.text-primary {
              color: #ffffff !important;
            }
            .text-muted.small {
              color: #d4d4d4 !important;
            }
            .breadcrumb-item a {
              color: #d4d4d4 !important;
            }
            .breadcrumb-item.active {
              color: #ffffff !important;
            }
            .table th {
              color: #ffffff !important;
            }
            .table td {
              color: #ffffff !important;
            }
            .py-3.text-muted {
              color: #d4d4d4 !important;
            }
            .py-3.text-primary {
              color: #ffffff !important;
            }
            .fw-semibold.text-primary {
              color: #ffffff !important;
            }
          ` : ''}
        `}
      </style>
      <div className="d-flex">
        <Sidebar 
          isCollapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        <div className="flex-grow-1 min-vh-100">
          {/* Header */}
          <nav className="navbar navbar-expand-lg">
            <div className="container-fluid">
              <div className="d-flex align-items-center">
                <button 
                  className="btn btn-secondary me-2"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  aria-label="Contraer/Expandir sidebar"
                >
                  <Menu size={20} />
                </button>
                <a className="navbar-brand fw-bold" href="#" style={{color: isDark ? '#ffffff' : 'inherit'}}>
                  <FileText className="me-2" size={24} />
                  SGI - Sistema de Gestión de Informes
                </a>
              </div>
              <div className="navbar-nav ms-auto">
                <button 
                  className="theme-toggle me-3"
                  onClick={toggleTheme}
                  title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                >
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <a className="nav-link" href="#" style={{color: isDark ? '#ffffff' : 'inherit'}}>
                  <Users size={18} className="me-1" />
                  Usuario Admin
                </a>
              </div>
            </div>
          </nav>
          
          <div className="container-fluid py-4">
            {/* Título de bienvenida */}
            <div className="row mb-4">
              <div className="col-12">
                <div className={isDark? "p-4 rounded shadow-sm border-start border-4 border-dark bg-dark": "p-4 rounded shadow-sm border-start border-4 border-dark"}>
                  <div className="d-flex align-items-center mb-2">
                    <FileText size={28} className="me-2" style={{color: isDark ? '#ffffff' : 'inherit'}} />
                    <h1 className="h3 mb-0" style={{color: isDark ? '#ffffff' : 'inherit'}}>Dashboard</h1>
                  </div>
                  <p className="small" style={{color: isDark ? '#ffffff' : '#6c757d'}}>
                    Bienvenido al sistema de Gestión de Informes
                  </p>
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-0">
                      <li className="breadcrumb-item">
                        <a href="#" className="text-decoration-none" style={{color: isDark ? '#d4d4d4' : '#6c757d'}}>
                          Inicio
                        </a>
                      </li>
                      <li className="breadcrumb-item active" aria-current="page" style={{color: isDark ? '#ffffff' : 'inherit'}}>
                        Dashboard
                      </li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>

            {/* Cards de estadísticas */}
            <div className="row mb-4">
              <div className="col-xl-4 col-md-4 col-sm-6 mb-3">
                <div className="card border-0 shadow-sm border-start border-4 border-danger">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="flex-shrink-0">
                        <AlertTriangle className="text-danger" size={32} />
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <div className="fw-bold fs-4" style={{color: isDark ? '#ffffff' : '#0d6efd'}}>
                          {stats.Urgente || 0}
                        </div>
                        <div className="small" style={{color: isDark ? '#d4d4d4' : '#6c757d'}}>
                          Urgentes
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-md-4 col-sm-6 mb-3">
                <div className="card border-0 shadow-sm border-start border-4 border-success">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="flex-shrink-0">
                        <CheckCircle className="text-success" size={32} />
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <div className="fw-bold fs-4" style={{color: isDark ? '#ffffff' : '#0d6efd'}}>
                          {stats.Completado || 0}
                        </div>
                        <div className="small" style={{color: isDark ? '#d4d4d4' : '#6c757d'}}>
                          Completados
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-md-4 col-sm-6 mb-3">
                <div className="card border-0 shadow-sm border-start border-4 border-secondary">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="flex-shrink-0">
                        <Clock className="" size={32} style={{color: isDark ? '#ffffff' : 'inherit'}} />
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <div className="fw-bold fs-4" style={{color: isDark ? '#ffffff' : '#0d6efd'}}>
                          {stats.Pendiente || 0}
                        </div>
                        <div className="small" style={{color: isDark ? '#d4d4d4' : '#6c757d'}}>
                          Pendientes
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabla de últimos informes */}
            <div className="row">
              <div className="col-12">
                <div className="card border-0 shadow-sm">
                  <div className="card-header border-bottom">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0 fw-bold" style={{color: isDark ? '#ffffff' : '#0d6efd'}}>
                        Últimos Informes Cargados
                      </h5>
                      <button className={`btn ${isDark ? 'btn-light' : 'btn-dark'} btn-sm`}>
                        Ver Todos
                      </button>
                    </div>
                  </div>
                  <div className="card-body p-4 rounded-bottom shadow-sm">
                    <div className="table-responsive">
                      <table className="table table-hover align-middle text-nowrap">
                        <thead className={isDark ? '' : 'table-light'}>
                          <tr>
                            <th className="fw-bold" style={{color: isDark ? '#ffffff' : 'inherit'}}>Departamento</th>
                            <th className="fw-bold" style={{color: isDark ? '#ffffff' : 'inherit'}}>Localidad</th>
                            <th className="fw-bold" style={{color: isDark ? '#ffffff' : 'inherit'}}>Tipo</th>
                            <th className="fw-bold" style={{color: isDark ? '#ffffff' : 'inherit'}}>Fecha</th>
                            <th className="fw-bold" style={{color: isDark ? '#ffffff' : 'inherit'}}>Título</th>
                            <th className="fw-bold" style={{color: isDark ? '#ffffff' : 'inherit'}}>Estado</th>
                            <th className="fw-bold text-center" style={{color: isDark ? '#ffffff' : 'inherit'}}>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {informes.length > 0 ? informes.map((informe) => (
                            <tr key={informe.id} className="border-bottom">
                              <td className="py-3">
                                <span className="fw-semibold" style={{color: isDark ? '#ffffff' : '#0d6efd'}}>
                                  {informe.department.name}
                                </span>
                              </td>
                              <td className="py-3" style={{color: isDark ? '#d4d4d4' : '#6c757d'}}>
                                {informe.locality.name}
                              </td>
                              <td className="py-3">
                                <span className={`badge rounded-pill ${getBadgeClass(informe.type_report.name)} text-white px-3`}>
                                  {informe.type_report.name}
                                </span>
                              </td>
                              <td className="py-3" style={{color: isDark ? '#d4d4d4' : '#6c757d'}}>
                                {formatFecha(informe.date)}
                              </td>
                              <td className="py-3" style={{color: isDark ? '#ffffff' : '#0d6efd'}}>
                                {informe.title}
                              </td>
                              <td className="py-3">
                                <span className={`badge rounded-pill ${getEstadoBadge(informe.status)} text-white px-3`}>
                                  {informe.status || "Pendiente"}
                                </span>
                              </td>
                              <td className="py-3 text-center">
                                <div className="d-flex justify-content-center gap-2">
                                  <button 
                                    className={`btn btn-sm ${isDark ? 'btn-outline-light' : 'btn-outline-primary'} d-flex align-items-center`}
                                    onClick={() => router.push(`/reports/view/${informe.id}`)}
                                  >
                                    <i className="bi bi-eye me-1"></i> Ver
                                  </button>
                                  <button 
                                    className={`btn btn-sm ${isDark ? 'btn-outline-secondary' : 'btn-outline-secondary'} d-flex align-items-center`}
                                    onClick={() => router.push(`/reports/edit/${informe.id}`)}
                                  >
                                    <i className="bi bi-pencil me-1"></i> Editar
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )) : (
                            <tr>
                              <td colSpan={7} className="text-center" style={{color: isDark ? '#ffffff' : 'inherit'}}>
                                Aun no hay informes cargados!
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
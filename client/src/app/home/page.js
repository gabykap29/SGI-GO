"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, TrendingUp, AlertTriangle, CheckCircle, Clock, Users, Menu, X, Sun, Moon } from 'lucide-react';
import { Sidebar } from '../../../components/Sidebard';
import { Header } from '../../../components/Header';
import { getReports } from '../../../hooks/handleReports';
import useTheme from '../../../hooks/useTheme';
import { useAuth } from '../../../hooks/useAuth';

export default function DashboardInicio() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [informes, setInformes] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebarCollapsed');
      return saved !== null ? JSON.parse(saved) : true;
    }
    return true;
  });
  const [isMobile, setIsMobile] = useState(false);
  const { theme, toggleTheme, isDark } = useTheme();
  const [stats, setStats] = useState({
    urgent: 0,
    complete: 0,
    pending: 0,
  });

  // Auto-colapsar en pantallas pequeñas
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      }
    };
    
    // Ejecutar inmediatamente al cargar
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

  // Datos de ejemplo para los últimos informes
useEffect(() => {
  const handleReports = async () => {
    const response = await getReports();
    setInformes(response.data);
    const newStats = response.data.reduce((acc, informe) => {
      const status = informe.status;
      console.log(status);
      
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    setStats(newStats);
  };
  handleReports();
}, []);

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
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
          isDark={true}
        />
        <div 
          className={`flex-grow-1 min-vh-100 ${isDark ? 'bg-dark text-light' : 'bg-light text-dark'}`}
          style={{ 
            marginLeft: isMobile ? '0' : (sidebarCollapsed ? '70px' : '250px'), 
            transition: 'margin-left 0.3s ease' 
          }}
        >
          <Header 
            sidebarCollapsed={sidebarCollapsed}
            setSidebarCollapsed={setSidebarCollapsed}
            isDark={isDark}
            toggleTheme={toggleTheme}
            isMobile={isMobile}
          />
          
          <div className={isDark? "container-fluid py-4 bg-black" : "container-fluid py-4 bg-light"}>
            {/* Título de bienvenida */}
            <div className="row mb-4">
              <div className="col-12">
                <div className={isDark? "p-4 rounded shadow-sm border-start border-4 border-primary bg-dark": "p-4 rounded shadow-sm border-start border-4 border-dark"}>

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
                          {stats.urgent || 0}
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
                          {stats.complete || 0}
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
                          {stats.pending || 0}
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
                                <span className={`badge rounded-pill ${(informe.type_report.name)} text-white px-3`}>
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
                                <span className={`badge rounded-pill ${(informe.status === "pending") ? 'badge-warning' : (informe.status === "complete") ? 'badge-success' : 'badge-danger'} text-white px-3`}>
                                  {informe.status === "pending" ? "Pendiente" : informe.status === "complete"? "Completado" : "Urgente"}
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
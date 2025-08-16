"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "../../../../../components/Header";
import { Sidebar } from "../../../../../components/Sidebard";
import { getPersonById } from "../../../../../hooks/handlePersons";
import { GetReportsByPersonId } from "../../../../../hooks/handleReports";
import useTheme from "../../../../../hooks/useTheme";
import { useAuth } from "../../../../../hooks/useAuth";
import { User, FileText, ArrowLeft, Eye } from "lucide-react";

export default function PersonView() {
  const { isAuthenticated, isLoading } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebarCollapsed');
      return saved !== null ? JSON.parse(saved) : true;
    }
    return true;
  });
  const [isMobile, setIsMobile] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1024);
  
  const [person, setPerson] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const router = useRouter();
  const personId = params.id;

  // Hook para manejar el redimensionamiento de la ventana
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      const mobile = width < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      }
    };

    // Establecer el ancho inicial
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      setWindowWidth(width);
      const mobile = width < 768;
      setIsMobile(mobile);
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  // Guardar estado del sidebar en localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
    }
  }, [sidebarCollapsed]);

  useEffect(() => {
    if (isAuthenticated && personId) {
      fetchPersonData();
      fetchPersonReports();
    }
  }, [isAuthenticated, personId]);

  const fetchPersonData = async () => {
    try {
      const data = await getPersonById(personId);
      setPerson(data);
    } catch (err) {
      setError("Error al cargar los datos de la persona");
      console.error(err);
    }
  };

  const fetchPersonReports = async () => {
    try {
      const data = await GetReportsByPersonId(personId);
      setReports(data);
    } catch (err) {
      console.error("Error al cargar los reportes:", err);
      // No mostramos error aquí porque es opcional
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = (reportId) => {
    router.push(`/reports/view/${reportId}`);
  };

  const handleBackToSearch = () => {
    router.push("/persons/search");
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "complete":
        return "bg-green-100 text-green-800";
      case "urgent":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusDisplayText = (status) => {
    switch (status) {
      case "pending":
        return "Pendiente";
      case "complete":
        return "Completado";
      case "urgent":
        return "Urgente";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className={`min-vh-100 d-flex justify-content-center align-items-center ${theme === 'dark' ? 'bg-dark' : 'bg-light'}`}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Cargando...</span>
          </div>
          <h5 className={`${theme === 'dark' ? 'text-light' : 'text-dark'}`}>Cargando sistema...</h5>
          <p className="text-muted">Por favor espere mientras se inicializa la aplicación</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className={`d-flex flex-column min-vh-100 ${isDark ? 'bg-dark text-light' : 'bg-light'}`}>
        <Header 
          sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed} 
          isDark={isDark} 
          toggleTheme={toggleTheme} 
          isMobile={isMobile}
        />
        <div className="d-flex flex-grow-1 position-relative">
          <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} isDark={isDark} />
          
          {/* Overlay para móviles */}
          {!sidebarCollapsed && windowWidth < 768 && (
            <div 
              className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50" 
              style={{ zIndex: 1040 }}
              onClick={() => setSidebarCollapsed(true)}
            />
          )}
          
          <main 
            className={`flex-grow-1 transition-all ${isDark ? 'bg-dark' : 'bg-light'}`}
            style={{ 
              marginLeft: windowWidth >= 768 ? (sidebarCollapsed ? '70px' : '250px') : '0',
          width: windowWidth >= 768 ? (sidebarCollapsed ? 'calc(100% - 70px)' : 'calc(100% - 250px)') : '100%',
              transition: 'margin-left 0.3s ease, width 0.3s ease'
            }}
          >
            <div className="container-fluid p-4">
              <div className={`p-5 rounded shadow-sm ${isDark ? 'bg-dark border' : 'bg-white'}`}>
                <div className="text-center">
                  <div className="d-flex justify-content-center align-items-center mb-3">
                    <div className="spinner-border text-primary me-3" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                    <div>
                      <h6 className="mb-1">Cargando información de la persona...</h6>
                      <small className="text-muted">Obteniendo datos del servidor</small>
                    </div>
                  </div>
                  <div className="progress" style={{ height: '4px' }}>
                    <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`d-flex flex-column min-vh-100 ${isDark ? 'bg-dark text-light' : 'bg-light'}`}>
        <Header 
          sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed} 
          isDark={isDark} 
          toggleTheme={toggleTheme} 
        />
        <div className="d-flex flex-grow-1 position-relative">
          <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} isDark={isDark} />
          
          {/* Overlay para móviles */}
          {!sidebarCollapsed && windowWidth < 768 && (
            <div 
              className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50" 
              style={{ zIndex: 1040 }}
              onClick={() => setSidebarCollapsed(true)}
            />
          )}
          
          <main 
            className={`flex-grow-1 transition-all ${isDark ? 'bg-dark' : 'bg-light'}`}
            style={{ 
              marginLeft: windowWidth >= 768 ? (sidebarCollapsed ? '70px' : '250px') : '0',
          width: windowWidth >= 768 ? (sidebarCollapsed ? 'calc(100% - 70px)' : 'calc(100% - 250px)') : '100%',
              transition: 'margin-left 0.3s ease, width 0.3s ease'
            }}
          >
            <div className="container-fluid p-4">
              <div className={`alert ${isDark ? 'alert-dark border-danger' : 'alert-danger'} d-flex align-items-center`} role="alert">
                <div className="me-3">
                  <svg className="bi flex-shrink-0" width="24" height="24" role="img" aria-label="Danger:">
                    <use xlinkHref="#exclamation-triangle-fill"/>
                  </svg>
                </div>
                <div>
                  <h6 className="alert-heading mb-1">Error al cargar datos</h6>
                  <p className="mb-2">{error}</p>
                  <button 
                    className="btn btn-outline-danger btn-sm"
                    onClick={handleBackToSearch}
                    style={{
                      transition: 'all 0.2s ease',
                      transform: 'scale(1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <ArrowLeft className="me-2" size={16} />
                    Volver a búsqueda
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!person) {
    return (
      <div className={`d-flex flex-column min-vh-100 ${isDark ? 'bg-dark text-light' : 'bg-light'}`}>
        <Header 
          sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed} 
          isDark={isDark} 
          toggleTheme={toggleTheme} 
        />
        <div className="d-flex flex-grow-1 position-relative">
          <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} isDark={isDark} />
          
          {/* Overlay para móviles */}
          {!sidebarCollapsed && windowWidth < 768 && (
            <div 
              className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50" 
              style={{ zIndex: 1040 }}
              onClick={() => setSidebarCollapsed(true)}
            />
          )}
          
          <main 
            className={`flex-grow-1 transition-all ${isDark ? 'bg-dark' : 'bg-light'}`}
            style={{ 
              marginLeft: windowWidth >= 768 ? (sidebarCollapsed ? '70px' : '250px') : '0',
          width: windowWidth >= 768 ? (sidebarCollapsed ? 'calc(100% - 70px)' : 'calc(100% - 250px)') : '100%',
              transition: 'margin-left 0.3s ease, width 0.3s ease'
            }}
          >
            <div className="container-fluid p-4">
              <div className={`text-center py-5 ${isDark ? 'bg-dark border' : 'bg-white'} rounded shadow-sm`}>
                <div className="mb-4">
                  <User size={64} className="text-muted mb-3" />
                  <h5 className="text-muted mb-2">Persona no encontrada</h5>
                  <p className="text-muted mb-3">La persona que buscas no existe o no tienes permisos para verla.</p>
                  <button 
                    className="btn btn-primary"
                    onClick={handleBackToSearch}
                    style={{
                      transition: 'all 0.2s ease',
                      transform: 'scale(1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(13, 110, 253, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <ArrowLeft className="me-2" size={16} />
                    Volver a búsqueda
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className={`d-flex flex-column min-vh-100 ${isDark ? 'bg-dark text-light' : 'bg-light'}`}>
      <Header 
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed} 
        isDark={isDark} 
        toggleTheme={toggleTheme} 
      />
      <div className="d-flex flex-grow-1 position-relative">
        <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} isDark={isDark} />
        
        {/* Overlay para móviles */}
        {!sidebarCollapsed && windowWidth < 768 && (
          <div 
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50" 
            style={{ zIndex: 1040 }}
            onClick={() => setSidebarCollapsed(true)}
          />
        )}
        
        <main 
          className={`flex-grow-1 transition-all ${isDark ? 'bg-dark' : 'bg-light'}`}
          style={{ 
            marginLeft: windowWidth >= 768 ? (sidebarCollapsed ? '70px' : '250px') : '0',
          width: windowWidth >= 768 ? (sidebarCollapsed ? 'calc(100% - 70px)' : 'calc(100% - 250px)') : '100%',
            transition: 'margin-left 0.3s ease, width 0.3s ease'
          }}
        >
          <div className="container-fluid p-4">
            {/* Botón de regreso */}
            <div className="mb-4">
              <button 
                className={`btn ${isDark ? 'btn-outline-light' : 'btn-outline-secondary'}`}
                onClick={handleBackToSearch}
                style={{
                  transition: 'all 0.2s ease',
                  transform: 'scale(1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <ArrowLeft className="me-2" size={16} />
                Volver a búsqueda
              </button>
            </div>

            {/* Título */}
            <div className={`card mb-4 ${isDark ? 'bg-dark border-secondary' : 'bg-white'}`}>
              <div className="card-body">
                <h1 className="card-title h3 mb-0">
                  <User className="me-2" size={24} />
                  Información de Persona
                </h1>
              </div>
            </div>

            <div className="row">
              {/* Información de la persona */}
              <div className="col-lg-4 mb-4">
                <div className={`card h-100 ${isDark ? 'bg-dark border-secondary' : 'bg-white'} shadow-sm`}
                     style={{
                       transition: 'all 0.3s ease',
                       transform: 'scale(1)'
                     }}
                     onMouseEnter={(e) => {
                       e.currentTarget.style.transform = 'scale(1.02)';
                       e.currentTarget.style.boxShadow = isDark ? '0 8px 25px rgba(255,255,255,0.1)' : '0 8px 25px rgba(0,0,0,0.15)';
                     }}
                     onMouseLeave={(e) => {
                       e.currentTarget.style.transform = 'scale(1)';
                       e.currentTarget.style.boxShadow = isDark ? '0 2px 10px rgba(255,255,255,0.05)' : '0 2px 10px rgba(0,0,0,0.1)';
                     }}
                >
                  <div className={`card-header ${isDark ? 'bg-dark border-secondary' : 'bg-light'}`}>
                    <h5 className="card-title mb-0 d-flex align-items-center">
                      <User className="me-2" size={20} />
                      Datos Personales
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <label className="form-label text-muted small">Nombre completo</label>
                      <p className="fw-bold mb-0">{person.name} {person.last_name}</p>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label text-muted small">DNI</label>
                      <p className="fw-bold mb-0">{person.dni}</p>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label text-muted small">Teléfono</label>
                      <p className="fw-bold mb-0">{person.phone}</p>
                    </div>
                    
                    {person.email && (
                      <div className="mb-3">
                        <label className="form-label text-muted small">Email</label>
                        <p className="fw-bold mb-0">{person.email}</p>
                      </div>
                    )}
                    
                    {person.address && (
                      <div className="mb-3">
                        <label className="form-label text-muted small">Dirección</label>
                        <p className="fw-bold mb-0">{person.address}</p>
                      </div>
                    )}
                    
                    {person.birth_date && (
                      <div className="mb-3">
                        <label className="form-label text-muted small">Fecha de nacimiento</label>
                        <p className="fw-bold mb-0">{new Date(person.birth_date).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Reportes vinculados */}
              <div className="col-lg-8 mb-4">
                <div className={`card h-100 ${isDark ? 'bg-dark border-secondary' : 'bg-white'} shadow-sm`}
                     style={{
                       transition: 'all 0.3s ease',
                       transform: 'scale(1)'
                     }}
                     onMouseEnter={(e) => {
                       e.currentTarget.style.transform = 'scale(1.01)';
                       e.currentTarget.style.boxShadow = isDark ? '0 8px 25px rgba(255,255,255,0.1)' : '0 8px 25px rgba(0,0,0,0.15)';
                     }}
                     onMouseLeave={(e) => {
                       e.currentTarget.style.transform = 'scale(1)';
                       e.currentTarget.style.boxShadow = isDark ? '0 2px 10px rgba(255,255,255,0.05)' : '0 2px 10px rgba(0,0,0,0.1)';
                     }}
                >
                  <div className={`card-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2 ${isDark ? 'bg-dark border-secondary' : 'bg-light'}`}>
                    <h5 className="card-title mb-0 d-flex align-items-center">
                      <FileText className="me-2" size={20} />
                      Reportes Vinculados
                    </h5>
                    <span className="badge bg-primary">
                      {reports.length} reporte(s)
                    </span>
                  </div>
                  <div className="card-body">
                    {reports.length === 0 ? (
                      <div className="text-center py-5">
                        <FileText size={48} className="text-muted mb-3" />
                        <h6 className="text-muted">Sin reportes vinculados</h6>
                        <p className="text-muted">Esta persona no está vinculada a ningún reporte.</p>
                      </div>
                    ) : (
                      <div className="row">
                        {reports.map((report) => (
                          <div key={report.id} className="col-12 mb-3">
                            <div className={`card border-start border-primary border-3 ${isDark ? 'bg-dark border-secondary' : 'bg-white'}`}
                                 style={{
                                   transition: 'all 0.2s ease',
                                   transform: 'scale(1)'
                                 }}
                                 onMouseEnter={(e) => {
                                   e.currentTarget.style.transform = 'scale(1.02)';
                                   e.currentTarget.style.boxShadow = isDark ? '0 4px 15px rgba(255,255,255,0.1)' : '0 4px 15px rgba(0,0,0,0.1)';
                                 }}
                                 onMouseLeave={(e) => {
                                   e.currentTarget.style.transform = 'scale(1)';
                                   e.currentTarget.style.boxShadow = 'none';
                                 }}
                            >
                              <div className="card-body">
                                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-2 gap-2">
                                  <h6 className="card-title mb-0">{report.title}</h6>
                                  <span className={`badge ${
                                    report.status === 'pending' ? 'bg-warning' :
                                    report.status === 'complete' ? 'bg-success' :
                                    report.status === 'urgent' ? 'bg-danger' : 'bg-secondary'
                                  }`}>
                                    {getStatusDisplayText(report.status)}
                                  </span>
                                </div>
                                
                                <div className="row text-muted small mb-2 g-2">
                                  <div className="col-lg-6 col-md-12">
                                    <strong>Fecha:</strong> {new Date(report.date).toLocaleDateString()}
                                  </div>
                                  <div className="col-lg-6 col-md-12">
                                    <strong>Departamento:</strong> {report.Department?.name || 'N/A'}
                                  </div>
                                  <div className="col-lg-6 col-md-12">
                                    <strong>Localidad:</strong> {report.Locality?.name || 'N/A'}
                                  </div>
                                  <div className="col-lg-6 col-md-12">
                                    <strong>Tipo:</strong> {report.TypeReport?.name || 'N/A'}
                                  </div>
                                </div>
                                
                                {report.description && (
                                  <p className="card-text text-muted small">
                                    {report.description.length > 100 
                                      ? `${report.description.substring(0, 100)}...` 
                                      : report.description
                                    }
                                  </p>
                                )}
                                
                                <div className="d-flex justify-content-end">
                                  <button 
                                    className="btn btn-primary btn-sm"
                                    onClick={() => handleViewReport(report.id)}
                                    style={{
                                      transition: 'all 0.2s ease',
                                      transform: 'scale(1)'
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.transform = 'scale(1.05)';
                                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(13, 110, 253, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.transform = 'scale(1)';
                                      e.currentTarget.style.boxShadow = 'none';
                                    }}
                                  >
                                    <Eye className="me-1" size={14} />
                                    Ver reporte
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "../../../../../components/Header";
import { Sidebar } from "../../../../../components/Sidebard";
import { getPersonById } from "../../../../../hooks/handlePersons";
import { GetReportsByPersonId } from "../../../../../hooks/handleReports";
import useTheme from "../../../../../hooks/useTheme";
import { useAuth } from "../../../../../hooks/useAuth";
import { User, FileText, ArrowLeft, Eye, Mail, Phone, MapPin, Calendar, CreditCard, AlertCircle, Map } from "lucide-react";

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
        return "bg-warning bg-opacity-15 text-warning border border-warning";
      case "complete":
        return "bg-success bg-opacity-15 text-success border border-success";
      case "urgent":
        return "bg-danger bg-opacity-15 text-danger border border-danger";
      default:
        return "bg-secondary bg-opacity-15 text-secondary border border-secondary";
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

          {!sidebarCollapsed && windowWidth < 768 && (
            <div
              className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
              style={{ zIndex: 1040 }}
              onClick={() => setSidebarCollapsed(true)}
            />
          )}

          <main
            className={`flex-grow-1 ${isDark ? 'bg-dark' : 'bg-light'}`}
            style={{
              marginLeft: windowWidth >= 768 ? (sidebarCollapsed ? '70px' : '250px') : '0',
              width: windowWidth >= 768 ? (sidebarCollapsed ? 'calc(100% - 70px)' : 'calc(100% - 250px)') : '100%',
              transition: 'margin-left 0.3s ease, width 0.3s ease'
            }}
          >
            <div className="container-fluid p-4">
              <div className={`p-5 rounded-4 shadow-sm ${isDark ? 'bg-dark border' : 'bg-white'}`}>
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
                  <div className="progress" style={{ height: '4px', borderRadius: '10px' }}>
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

          {!sidebarCollapsed && windowWidth < 768 && (
            <div
              className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
              style={{ zIndex: 1040 }}
              onClick={() => setSidebarCollapsed(true)}
            />
          )}

          <main
            className={`flex-grow-1 ${isDark ? 'bg-dark' : 'bg-light'}`}
            style={{
              marginLeft: windowWidth >= 768 ? (sidebarCollapsed ? '70px' : '250px') : '0',
              width: windowWidth >= 768 ? (sidebarCollapsed ? 'calc(100% - 70px)' : 'calc(100% - 250px)') : '100%',
              transition: 'margin-left 0.3s ease, width 0.3s ease'
            }}
          >
            <div className="container-fluid p-4">
              <div className={`alert border-0 rounded-4 ${isDark ? 'bg-danger bg-opacity-10 border-danger' : 'alert-danger'} d-flex align-items-start`} role="alert">
                <AlertCircle className="me-3 mt-1 flex-shrink-0" size={24} />
                <div className="flex-grow-1">
                  <h6 className="alert-heading mb-2 fw-bold">Error al cargar datos</h6>
                  <p className="mb-3">{error}</p>
                  <button
                    className="btn btn-outline-danger btn-sm rounded-pill"
                    onClick={handleBackToSearch}
                    style={{ transition: 'all 0.2s ease' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
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

          {!sidebarCollapsed && windowWidth < 768 && (
            <div
              className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
              style={{ zIndex: 1040 }}
              onClick={() => setSidebarCollapsed(true)}
            />
          )}

          <main
            className={`flex-grow-1 ${isDark ? 'bg-dark' : 'bg-light'}`}
            style={{
              marginLeft: windowWidth >= 768 ? (sidebarCollapsed ? '70px' : '250px') : '0',
              width: windowWidth >= 768 ? (sidebarCollapsed ? 'calc(100% - 70px)' : 'calc(100% - 250px)') : '100%',
              transition: 'margin-left 0.3s ease, width 0.3s ease'
            }}
          >
            <div className="container-fluid p-4">
              <div className={`text-center py-5 ${isDark ? 'bg-dark border' : 'bg-white'} rounded-4 shadow-sm`}>
                <div className="mb-4">
                  <div className={`d-inline-flex align-items-center justify-content-center rounded-circle mb-4 ${isDark ? 'bg-secondary bg-opacity-10' : 'bg-light'}`}
                    style={{ width: '100px', height: '100px' }}>
                    <User size={48} className="text-muted" />
                  </div>
                  <h5 className="mb-2">Persona no encontrada</h5>
                  <p className="text-muted mb-4">La persona que buscas no existe o no tienes permisos para verla.</p>
                  <button
                    className="btn btn-primary rounded-pill px-4"
                    onClick={handleBackToSearch}
                    style={{ transition: 'all 0.2s ease' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(13, 110, 253, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
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

        {!sidebarCollapsed && windowWidth < 768 && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
            style={{ zIndex: 1040 }}
            onClick={() => setSidebarCollapsed(true)}
          />
        )}

        <main
          className={`flex-grow-1 ${isDark ? 'bg-dark' : 'bg-light'}`}
          style={{
            marginLeft: windowWidth >= 768 ? (sidebarCollapsed ? '70px' : '250px') : '0',
            width: windowWidth >= 768 ? (sidebarCollapsed ? 'calc(100% - 70px)' : 'calc(100% - 250px)') : '100%',
            transition: 'margin-left 0.3s ease, width 0.3s ease'
          }}
        >
          <div className="container-fluid p-4">
            {/* Header con gradiente y botón de regreso */}
            <div className={`rounded-4 mb-4 overflow-hidden ${isDark ? 'bg-dark border' : 'bg-white'} shadow-sm`}>
              <div className="position-relative" style={{
                background: isDark
                  ? 'linear-gradient(135deg, #242527ff 0%, #183563ff 100%)'
                  : 'linear-gradient(135deg, #202122ff 0%, #676d74ff 100%)',
                padding: '2rem'
              }}>
                <button
                  className="btn btn-light btn-sm rounded-pill mb-3"
                  onClick={handleBackToSearch}
                  style={{ transition: 'all 0.2s ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(-4px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                >
                  <ArrowLeft className="me-2" size={16} />
                  Volver a búsqueda
                </button>

                <div className="d-flex align-items-center">
                  <div className="bg-white bg-opacity-20 backdrop-blur rounded-circle p-3 me-3">
                    <User size={32} className={isDark ? 'text-white' : 'text-dark'} />
                  </div>
                  <div className="text-white">
                    <h1 className="h3 mb-1 fw-bold">{person.name} {person.last_name}</h1>
                    <p className="mb-0 opacity-90">DNI: {person.dni ? person.dni : 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-4">
              {/* Información de la persona con iconos mejorados */}
              <div className="col-lg-4">
                <div className={`card border-0 rounded-4 h-100 ${isDark ? 'bg-dark' : 'bg-white'} shadow-sm`}
                  style={{ transition: 'all 0.3s ease' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = isDark ? '0 12px 40px rgba(255,255,255,0.1)' : '0 12px 40px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '';
                  }}
                >
                  <div className="card-body p-4">
                    <h5 className="card-title mb-4 pb-3 border-bottom d-flex align-items-center">
                      <div className="bg-primary bg-opacity-10 rounded-3 p-2 me-2">
                        <User className="text-primary" size={20} />
                      </div>
                      Datos Personales
                    </h5>

                    <div className="d-flex flex-column gap-3">
                      <div className="d-flex align-items-start">
                        <div className={`${isDark ? 'bg-secondary bg-opacity-10' : 'bg-light'} rounded-3 p-2 me-3`}>
                          <CreditCard size={18} className="text-primary" />
                        </div>
                        <div className="flex-grow-1">
                          <small className="text-muted d-block mb-1">DNI</small>
                          <p className="mb-0 fw-semibold">{person.dni ? person.dni : 'N/A'}</p>
                        </div>
                      </div>

                      {person.address && (
                        <div className="d-flex align-items-start">
                          <div className={`${isDark ? 'bg-secondary bg-opacity-10' : 'bg-light'} rounded-3 p-2 me-3`}>
                            <MapPin size={18} className="text-danger" />
                          </div>
                          <div className="flex-grow-1">
                            <small className="text-muted d-block mb-1">Dirección</small>
                            <p className="mb-0 fw-semibold">{person.address}</p>
                          </div>
                        </div>
                      )}

                      {person.locality && (
                        <div className="d-flex align-items-start">
                          <div className={`${isDark ? 'bg-secondary bg-opacity-10' : 'bg-light'} rounded-3 p-2 me-3`}>
                            <Map size={18} className="text-warning" />
                          </div>
                          <div className="flex-grow-1">
                            <small className="text-muted d-block mb-1">Localidad</small>
                            <p className="mb-0 fw-semibold">{person.locality}</p>
                          </div>
                        </div>
                      )}

                      {person.province && (
                        <div className="d-flex align-items-start">
                          <div className={`${isDark ? 'bg-secondary bg-opacity-10' : 'bg-light'} rounded-3 p-2 me-3`}>
                            <Map size={18} className="text-warning" />
                          </div>
                          <div className="flex-grow-1">
                            <small className="text-muted d-block mb-1">Provincia</small>
                            <p className="mb-0 fw-semibold">{person.province}</p>
                          </div>
                        </div>
                      )}

                      {person.phone && (
                        <div className="d-flex align-items-start">
                          <div className={`${isDark ? 'bg-secondary bg-opacity-10' : 'bg-light'} rounded-3 p-2 me-3`}>
                            <Phone size={18} className="text-warning" />
                          </div>
                          <div className="flex-grow-1">
                            <small className="text-muted d-block mb-1">Teléfono</small>
                            <p className="mb-0 fw-semibold">{person.phone}</p>
                          </div>
                        </div>
                      )}

                      {person.email && (
                        <div className="d-flex align-items-start">
                          <div className={`${isDark ? 'bg-secondary bg-opacity-10' : 'bg-light'} rounded-3 p-2 me-3`}>
                            <Mail size={18} className="text-warning" />
                          </div>
                          <div className="flex-grow-1">
                            <small className="text-muted d-block mb-1">Email</small>
                            <p className="mb-0 fw-semibold">{person.email}</p>
                          </div>
                        </div>
                      )}

                      {person.description && (
                        <div className="d-flex align-items-start">
                          <div className={`${isDark ? 'bg-secondary bg-opacity-10' : 'bg-light'} rounded-3 p-2 me-3`}>
                            <Map size={18} className="text-warning" />
                          </div>
                          <div className="flex-grow-1">
                            <small className="text-muted d-block mb-1">Descripción</small>
                            <p className="mb-0 fw-semibold">{person.description}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Reportes vinculados mejorado */}
              <div className="col-lg-8">
                <div className={`card border-0 rounded-4 h-100 ${isDark ? 'bg-dark' : 'bg-white'} shadow-sm`}>
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                      <h5 className="card-title mb-0 d-flex align-items-center">
                        <div className="bg-primary bg-opacity-10 rounded-3 p-2 me-2">
                          <FileText className="text-primary" size={20} />
                        </div>
                        Reportes Vinculados
                      </h5>
                      <span className="badge bg-primary rounded-pill px-3 py-2">
                        {reports.length} {reports.length === 1 ? 'reporte' : 'reportes'}
                      </span>
                    </div>

                    {reports.length === 0 ? (
                      <div className="text-center py-5">
                        <div className={`d-inline-flex align-items-center justify-content-center rounded-circle mb-3 ${isDark ? 'bg-secondary bg-opacity-10' : 'bg-light'}`}
                          style={{ width: '80px', height: '80px' }}>
                          <FileText size={36} className="text-muted" />
                        </div>
                        <h6 className="text-muted mb-2">Sin reportes vinculados</h6>
                        <p className="text-muted small">Esta persona no está vinculada a ningún reporte.</p>
                      </div>
                    ) : (
                      <div className="row g-3">
                        {reports.map((report) => (
                          <div key={report.id} className="col-12">
                            <div className={`card border-0 rounded-4 ${isDark ? 'bg-secondary bg-opacity-10' : 'bg-light'}`}
                              style={{
                                transition: 'all 0.2s ease',
                                borderLeft: '4px solid #0d6efd !important'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateX(4px)';
                                e.currentTarget.style.boxShadow = isDark ? '0 4px 20px rgba(255,255,255,0.1)' : '0 4px 20px rgba(0,0,0,0.1)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateX(0)';
                                e.currentTarget.style.boxShadow = 'none';
                              }}
                            >
                              <div className="card-body p-3">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                  <h6 className="card-title mb-0 fw-semibold">{report.title}</h6>
                                  <span className={`badge rounded-pill ${getStatusBadgeClass(report.status)}`}>
                                    {getStatusDisplayText(report.status)}
                                  </span>
                                </div>

                                <div className="row g-2 mb-3">
                                  <div className="col-md-6">
                                    <small className="text-muted d-flex align-items-center">
                                      <Calendar size={14} className="me-1" />
                                      {new Date(report.date).toLocaleDateString()}
                                    </small>
                                  </div>
                                  <div className="col-md-6">
                                    <small className="text-muted">
                                      <strong>Dpto:</strong> {report.department.name || 'N/A'}
                                    </small>
                                  </div>
                                  <div className="col-md-6">
                                    <small className="text-muted">
                                      <strong>Localidad:</strong> {report.locality.name || 'N/A'}
                                    </small>
                                  </div>
                                  <div className="col-md-6">
                                    <small className="text-muted">
                                      <strong>Tipo:</strong> {report.type_report.name || 'N/A'}
                                    </small>
                                  </div>
                                </div>

                                {report.description && (
                                  <p className="card-text text-muted small mb-3">
                                    {report.description.length > 100
                                      ? `${report.description.substring(0, 100)}...`
                                      : report.description
                                    }
                                  </p>
                                )}

                                <div className="d-flex justify-content-end">
                                  <button
                                    className="btn btn-primary btn-sm rounded-pill px-3"
                                    onClick={() => handleViewReport(report.id)}
                                    style={{ transition: 'all 0.2s ease' }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.transform = 'translateY(-2px)';
                                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(13, 110, 253, 0.4)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.transform = 'translateY(0)';
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
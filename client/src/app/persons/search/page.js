"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "../../../../components/Header";
import { Sidebar } from "../../../../components/Sidebard";
import { getPersons } from "../../../../hooks/handlePersons";
import useTheme from "../../../../hooks/useTheme";
import { searchPersons } from "../../../../hooks/handlePersons";
import { useAuth } from "../../../../hooks/useAuth";
import { Search, Users, Eye, Filter, SortAsc, Grid, List } from "lucide-react";

export default function PersonsSearch() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const { theme, toggleTheme, isDark } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebarCollapsed');
      return saved !== null ? JSON.parse(saved) : true;
    }
    return true;
  });
  const [isMobile, setIsMobile] = useState(false);

  const [persons, setPersons] = useState([]);
  const [filteredPersons, setFilteredPersons] = useState({ count: 0, data: [] });
  const [searchFilters, setSearchFilters] = useState({
    name: '',
    last_name: '',
    dni: '',
    address: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1024);

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
    if (isAuthenticated) {
      fetchPersons();
    }
  }, [isAuthenticated]);

  const fetchPersons = async () => {
    try {
      setLoading(true);
      const data = await getPersons();
      setPersons(data);
      setFilteredPersons({ count: data.length, data: data });
    } catch (err) {
      setError("Error al cargar las personas");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    const { name, last_name, dni, address } = searchFilters;
    if (!name && !last_name && !dni && !address) {
      fetchPersons();
      return;
    }

    try {
      setLoading(true);
      const data = await searchPersons(searchFilters);
      console.log(data);
      setFilteredPersons(data);
    } catch (err) {
      setError("Error al buscar personas");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPerson = (id) => {
    router.push(`/persons/view/${id}`);
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

  return (
    <div className={`min-vh-100 ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light'}`}>
      <Header
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        isDark={theme === 'dark'}
        toggleTheme={toggleTheme}
        isMobile={isMobile}
      />

      <div className="d-flex position-relative">
        <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} isDark={true} />

        {!sidebarCollapsed && (
          <div
            className="d-md-none position-fixed w-100 h-100"
            style={{
              top: 0,
              left: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 999
            }}
            onClick={() => setSidebarCollapsed(true)}
          />
        )}

        <main
          className="flex-grow-1 p-3 p-md-4"
          style={{
            marginLeft: windowWidth >= 768 ? (sidebarCollapsed ? '80px' : '250px') : '0',
            width: windowWidth >= 768 ? (sidebarCollapsed ? 'calc(100% - 80px)' : 'calc(100% - 250px)') : '100%',
            transition: 'all 0.3s ease',
            minHeight: 'calc(100vh - 60px)'
          }}
        >
          <div className={isDark ? "p-4 rounded shadow-sm border-start border-4 border-primary bg-dark" : "p-4 rounded shadow-sm border-start border-4 border-secondary bg-white"}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h1 className="h3 mb-1">Buscar Personas</h1>
                  <p className="text-muted mb-0">Encuentra y gestiona información de personas en el sistema</p>
                </div>
                <div className="d-flex align-items-center">
                  <Users className="text-primary me-3" size={32} />
                </div>
              </div>
            </div>
          </div>

          <div className={`mt-4 p-4 rounded shadow-sm ${isDark ? 'bg-dark border' : 'bg-white'}`}>
            <div className="row mb-3 g-3">
              <div className="col-12 col-md-3">
                <label className="form-label small">Nombre</label>
                <input
                  type="text"
                  className={`form-control ${isDark ? 'bg-dark text-light border-secondary' : ''}`}
                  placeholder="Nombre..."
                  value={searchFilters.name}
                  onChange={(e) => setSearchFilters({ ...searchFilters, name: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="col-12 col-md-3">
                <label className="form-label small">Apellido</label>
                <input
                  type="text"
                  className={`form-control ${isDark ? 'bg-dark text-light border-secondary' : ''}`}
                  placeholder="Apellido..."
                  value={searchFilters.last_name}
                  onChange={(e) => setSearchFilters({ ...searchFilters, last_name: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="col-12 col-md-3">
                <label className="form-label small">DNI</label>
                <input
                  type="text"
                  className={`form-control ${isDark ? 'bg-dark text-light border-secondary' : ''}`}
                  placeholder="DNI..."
                  value={searchFilters.dni}
                  onChange={(e) => setSearchFilters({ ...searchFilters, dni: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="col-12 col-md-3">
                <label className="form-label small">Domicilio</label>
                <input
                  type="text"
                  className={`form-control ${isDark ? 'bg-dark text-light border-secondary' : ''}`}
                  placeholder="Domicilio..."
                  value={searchFilters.address}
                  onChange={(e) => setSearchFilters({ ...searchFilters, address: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex gap-2">
                <button
                  className="btn btn-primary"
                  onClick={handleSearch}
                  disabled={loading}
                >
                  {loading ? <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> : <Search className="me-2" size={16} />}
                  Buscar
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setSearchFilters({ name: '', last_name: '', dni: '', address: '' });
                    fetchPersons();
                  }}
                  disabled={loading}
                >
                  Limpiar
                </button>
              </div>

              <button
                className={`btn ${showFilters ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={16} className="me-1" />
                Más Filtros
              </button>
            </div>

            {showFilters && (
              <div className={`p-3 rounded mb-3 ${isDark ? 'bg-secondary bg-opacity-25' : 'bg-light'}`}>
                <div className="row">
                  <div className="col-12 col-md-4 mb-2">
                    <label className="form-label small">Ordenar por:</label>
                    <select
                      className={`form-select form-select-sm ${isDark ? 'bg-dark text-light border-secondary' : ''}`}
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="name">Nombre</option>
                      <option value="dni">DNI</option>
                      <option value="phone">Teléfono</option>
                    </select>
                  </div>
                  <div className="col-12 col-md-4 mb-2">
                    <label className="form-label small">Orden:</label>
                    <select
                      className={`form-select form-select-sm ${isDark ? 'bg-dark text-light border-secondary' : ''}`}
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                    >
                      <option value="asc">Ascendente</option>
                      <option value="desc">Descendente</option>
                    </select>
                  </div>
                  <div className="col-12 col-md-4 mb-2">
                    <label className="form-label small">Vista:</label>
                    <div className="btn-group w-100" role="group">
                      <button
                        type="button"
                        className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setViewMode('grid')}
                      >
                        <Grid size={14} />
                      </button>
                      <button
                        type="button"
                        className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setViewMode('list')}
                      >
                        <List size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="d-flex justify-content-between align-items-center">
              <small className="text-muted">
                {filteredPersons.count} persona(s) encontrada(s)
              </small>
              <div className="d-flex align-items-center gap-2">
                <SortAsc size={14} className="text-muted" />
                <small className="text-muted">
                  Ordenado por {sortBy === 'name' ? 'nombre' : sortBy === 'dni' ? 'DNI' : 'teléfono'} ({sortOrder === 'asc' ? 'A-Z' : 'Z-A'})
                </small>
              </div>
            </div>
          </div>

          {loading ? (
            <div className={`mt-4 p-5 rounded shadow-sm ${isDark ? 'bg-dark border' : 'bg-white'}`}>
              <div className="text-center">
                <div className="d-flex justify-content-center align-items-center mb-3">
                  <div className="spinner-border text-primary me-3" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                  <div>
                    <h6 className="mb-1">Cargando personas...</h6>
                    <small className="text-muted">Obteniendo datos del servidor</small>
                  </div>
                </div>
                <div className="progress" style={{ height: '4px' }}>
                  <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="mt-4">
              <div className={`alert ${isDark ? 'alert-dark border-danger' : 'alert-danger'} d-flex align-items-center`} role="alert">
                <div className="me-3">
                  <svg className="bi flex-shrink-0" width="24" height="24" role="img" aria-label="Danger:">
                    <use xlinkHref="#exclamation-triangle-fill" />
                  </svg>
                </div>
                <div>
                  <h6 className="alert-heading mb-1">Error al cargar datos</h6>
                  <p className="mb-2">{error}</p>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={fetchPersons}
                  >
                    Reintentar
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              {filteredPersons.count === 0 ? (
                <div className={`text-center py-5 ${isDark ? 'bg-dark border' : 'bg-white'} rounded shadow-sm`}>
                  <div className="mb-4">
                    <Users className="text-muted mb-3" size={64} />
                    <h5 className="text-muted mb-2">No se encontraron personas</h5>
                    <p className="text-muted mb-3">
                      No hay personas registradas en el sistema o no coinciden con la búsqueda.
                    </p>
                  </div>
                </div>
              ) : (
                <div className={viewMode === 'grid' ? 'row' : ''}>
                  {filteredPersons.data.map((person) => (
                    viewMode === 'grid' ? (
                      <div key={person.id} className="col-12 col-sm-6 col-lg-4 col-xl-3 mb-4">
                        <div
                          className={`card h-100 border-0 overflow-hidden ${isDark ? 'bg-dark' : 'bg-white'}`}
                          style={{
                            cursor: 'pointer',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            transform: 'translateY(0) scale(1)',
                            boxShadow: isDark
                              ? '0 4px 12px rgba(13, 110, 253, 0.15), 0 2px 4px rgba(0, 0, 0, 0.3)'
                              : '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)',
                            borderRadius: '12px',
                            position: 'relative'
                          }}
                          onClick={() => handleViewPerson(person.id)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
                            e.currentTarget.style.boxShadow = isDark
                              ? '0 20px 40px rgba(13, 110, 253, 0.3), 0 8px 16px rgba(0, 0, 0, 0.4)'
                              : '0 20px 40px rgba(13, 110, 253, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            e.currentTarget.style.boxShadow = isDark
                              ? '0 4px 12px rgba(13, 110, 253, 0.15), 0 2px 4px rgba(0, 0, 0, 0.3)'
                              : '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)';
                          }}
                        >
                          <div
                            style={{
                              height: '4px',
                              background: 'linear-gradient(90deg, #0d6efd 0%, #0dcaf0 100%)',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              zIndex: 1
                            }}
                          />

                          <div className="card-body p-4" style={{ paddingTop: '1.5rem' }}>
                            <div className="d-flex align-items-start mb-3">
                              <div
                                className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                style={{
                                  width: '56px',
                                  height: '56px',
                                  background: isDark
                                    ? 'linear-gradient(135deg, rgba(13, 110, 253, 0.2) 0%, rgba(13, 202, 240, 0.2) 100%)'
                                    : 'linear-gradient(135deg, rgba(13, 110, 253, 0.1) 0%, rgba(13, 202, 240, 0.1) 100%)',
                                  border: isDark ? '2px solid rgba(13, 110, 253, 0.3)' : '2px solid rgba(13, 110, 253, 0.2)',
                                  flexShrink: 0
                                }}
                              >
                                <Users
                                  style={{
                                    color: '#0d6efd',
                                    filter: 'drop-shadow(0 2px 4px rgba(13, 110, 253, 0.3))'
                                  }}
                                  size={28}
                                />
                              </div>
                              <div className="flex-grow-1 min-w-0">
                                <h6 className="card-title mb-1 fw-bold" style={{
                                  fontSize: '1.05rem',
                                  lineHeight: '1.3',
                                  color: isDark ? '#fff' : '#1a1a1a'
                                }}>
                                  {person.name} {person.last_name}
                                </h6>
                                <div className="d-flex align-items-center">
                                  <span
                                    className="badge"
                                    style={{
                                      background: isDark
                                        ? 'rgba(13, 110, 253, 0.2)'
                                        : 'rgba(13, 110, 253, 0.1)',
                                      color: '#0d6efd',
                                      fontSize: '0.75rem',
                                      fontWeight: '600',
                                      padding: '0.25rem 0.6rem',
                                      borderRadius: '6px'
                                    }}
                                  >
                                    DNI: {person.dni}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="card-text" style={{ fontSize: '0.875rem' }}>

                              {person.address && (
                                <div
                                  className="mb-0 p-2 rounded d-flex align-items-start"
                                  style={{
                                    background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)'
                                  }}
                                >
                                  <span className="me-2" style={{ fontSize: '1.1rem', marginTop: '2px' }}>📍</span>
                                  <small className={isDark ? 'text-light' : 'text-dark'} style={{
                                    fontWeight: '500',
                                    lineHeight: '1.4',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                  }}>
                                    {person.address} - {person.province || 'Provincia No especificada'}
                                  </small>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="card-footer bg-transparent border-0 p-4 pt-0">
                            <button
                              className="btn btn-primary w-100 d-flex align-items-center justify-content-center fw-semibold"
                              style={{
                                transition: 'all 0.3s ease',
                                transform: 'scale(1)',
                                borderRadius: '8px',
                                padding: '0.6rem 1rem',
                                fontSize: '0.875rem',
                                background: 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)',
                                border: 'none',
                                boxShadow: '0 2px 8px rgba(13, 110, 253, 0.3)'
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewPerson(person.id);
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.03)';
                                e.currentTarget.style.boxShadow = '0 4px 16px rgba(13, 110, 253, 0.5)';
                                e.currentTarget.style.background = 'linear-gradient(135deg, #0a58ca 0%, #084298 100%)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(13, 110, 253, 0.3)';
                                e.currentTarget.style.background = 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)';
                              }}
                            >
                              <Eye className="me-2" size={16} />
                              Ver detalles
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div key={person.id} className="mb-3">
                        <div
                          className={`card border-0 ${isDark ? 'bg-dark' : 'bg-white'}`}
                          style={{
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            borderLeft: '4px solid transparent',
                            borderRadius: '8px',
                            boxShadow: isDark
                              ? '0 2px 8px rgba(13, 110, 253, 0.1)'
                              : '0 2px 8px rgba(0, 0, 0, 0.06)'
                          }}
                          onClick={() => handleViewPerson(person.id)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderLeftColor = '#0d6efd';
                            e.currentTarget.style.transform = 'translateX(8px)';
                            e.currentTarget.style.boxShadow = isDark
                              ? '0 8px 25px rgba(13, 110, 253, 0.25)'
                              : '0 8px 25px rgba(13, 110, 253, 0.15)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderLeftColor = 'transparent';
                            e.currentTarget.style.transform = 'translateX(0)';
                            e.currentTarget.style.boxShadow = isDark
                              ? '0 2px 8px rgba(13, 110, 253, 0.1)'
                              : '0 2px 8px rgba(0, 0, 0, 0.06)';
                          }}
                        >
                          <div className="card-body p-3">
                            <div className="row align-items-center">
                              <div className="col-12 col-md-4">
                                <div className="d-flex align-items-center">
                                  <div
                                    className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                    style={{
                                      width: '48px',
                                      height: '48px',
                                      background: isDark
                                        ? 'linear-gradient(135deg, rgba(13, 110, 253, 0.2) 0%, rgba(13, 202, 240, 0.2) 100%)'
                                        : 'linear-gradient(135deg, rgba(13, 110, 253, 0.1) 0%, rgba(13, 202, 240, 0.1) 100%)',
                                      border: isDark ? '2px solid rgba(13, 110, 253, 0.3)' : '2px solid rgba(13, 110, 253, 0.2)'
                                    }}
                                  >
                                    <Users style={{ color: '#0d6efd' }} size={20} />
                                  </div>
                                  <div>
                                    <h6 className="mb-0 fw-bold">{person.name} {person.last_name}</h6>
                                    <span
                                      className="badge mt-1"
                                      style={{
                                        background: isDark ? 'rgba(13, 110, 253, 0.2)' : 'rgba(13, 110, 253, 0.1)',
                                        color: '#0d6efd',
                                        fontSize: '0.7rem'
                                      }}
                                    >
                                      DNI: {person.dni}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12 col-md-3 mt-2 mt-md-0">
                                <small className="text-muted d-block">📞 {person.phone}</small>
                                {person.email && (
                                  <small className="text-muted d-block text-truncate">✉️ {person.email}</small>
                                )}
                              </div>
                              <div className="col-12 col-md-4 mt-2 mt-md-0">
                                {person.address && (
                                  <small className="text-muted d-block text-truncate">📍 {person.address}</small>
                                )}
                              </div>
                              <div className="col-12 col-md-1 mt-2 mt-md-0 text-end">
                                <button
                                  className="btn btn-primary btn-sm"
                                  style={{
                                    borderRadius: '6px',
                                    padding: '0.4rem 0.8rem'
                                  }}
                                >
                                  <Eye size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
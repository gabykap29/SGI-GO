"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "../../../../components/Header";
import { Sidebar } from "../../../../components/Sidebard";
import { getPersons } from "../../../../hooks/handlePersons";
import useTheme from "../../../../hooks/useTheme";
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
  const [filteredPersons, setFilteredPersons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('name'); // 'name', 'dni', 'phone'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [showFilters, setShowFilters] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1024);

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
    if (isAuthenticated) {
      fetchPersons();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    filterPersons();
  }, [searchTerm, persons, sortBy, sortOrder]);

  const fetchPersons = async () => {
    try {
      setLoading(true);
      const data = await getPersons();
      setPersons(data);
      setFilteredPersons(data);
    } catch (err) {
      setError("Error al cargar las personas");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

// Función helper para validar si una persona es válida
const isValidPerson = (person) => {
  return person && 
         typeof person === 'object' && 
         person.id !== undefined &&
         person.id !== null;
};

// Función helper para obtener valor seguro de una propiedad
const getSafeValue = (value, defaultValue = '') => {
  return value !== null && value !== undefined ? value : defaultValue;
};

// Versión más robusta de filterPersons usando los helpers
const filterPersons = () => {
  // Filtrar primero personas válidas
  let filtered = persons.filter(isValidPerson);
  
  // Aplicar filtro de búsqueda
  if (searchTerm.trim()) {
    filtered = filtered.filter(person => {
      const name = getSafeValue(person.name).toLowerCase();
      const lastName = getSafeValue(person.last_name).toLowerCase();
      const dni = getSafeValue(person.dni);
      const phone = getSafeValue(person.phone);
      const email = getSafeValue(person.email).toLowerCase();
      const address = getSafeValue(person.address).toLowerCase();
      
      const searchTermLower = searchTerm.toLowerCase();
      
      return (
        name.includes(searchTermLower) ||
        lastName.includes(searchTermLower) ||
        dni.includes(searchTerm) ||
        phone.includes(searchTerm) ||
        email.includes(searchTermLower) ||
        address.includes(searchTermLower)
      );
    });
  }
  
  // Aplicar ordenamiento
  filtered.sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'name':
        aValue = `${getSafeValue(a.name)} ${getSafeValue(a.last_name)}`.toLowerCase();
        bValue = `${getSafeValue(b.name)} ${getSafeValue(b.last_name)}`.toLowerCase();
        break;
      case 'dni':
        aValue = getSafeValue(a.dni);
        bValue = getSafeValue(b.dni);
        break;
      case 'phone':
        aValue = getSafeValue(a.phone);
        bValue = getSafeValue(b.phone);
        break;
      default:
        aValue = getSafeValue(a.name).toLowerCase();
        bValue = getSafeValue(b.name).toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });
  
  setFilteredPersons(filtered);
};

  const handleViewPerson = (personId) => {
    router.push(`/persons/view/${personId}`);
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
        {/* Sidebar */}
        <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} isDark={true} />

        {/* Overlay para móviles */}
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

        {/* Main content */}
        <main 
          className="flex-grow-1 p-3 p-md-4" 
          style={{ 
             marginLeft: windowWidth >= 768 ? (sidebarCollapsed ? '80px' : '250px') : '0',
            width: windowWidth >= 768 ? (sidebarCollapsed ? 'calc(100% - 80px)' : 'calc(100% - 250px)') : '100%',
             transition: 'all 0.3s ease',
             minHeight: 'calc(100vh - 60px)'
           }}
        >
          {/* Title Card */}
          <div className={isDark ? "p-4 rounded shadow-sm border-start border-4 border-primary bg-dark": "p-4 rounded shadow-sm border-start border-4 border-secondary bg-white"}>
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

          {/* Search and Controls Card */}
          <div className={`mt-4 p-4 rounded shadow-sm ${isDark ? 'bg-dark border' : 'bg-white'}`}>
            {/* Search Input */}
            <div className="row mb-3">
              <div className="col-12 col-md-8">
                <label htmlFor="searchInput" className="form-label">
                  <Search className="me-2" size={16} />
                  Buscar personas
                </label>
                <input
                  id="searchInput"
                  type="text"
                  className={`form-control ${isDark ? 'bg-dark text-light border-secondary' : ''}`}
                  placeholder="Buscar por nombre, apellido, DNI, teléfono, email o dirección..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="col-12 col-md-4 d-flex align-items-end gap-2">
                <button 
                  className={`btn ${showFilters ? 'btn-primary' : 'btn-outline-primary'} flex-fill filter-toggle ${showFilters ? 'active' : ''}`}
                  style={{
                    transition: 'all 0.3s ease',
                    transform: 'scale(1)',
                    backgroundColor: showFilters ? '#0d6efd' : 'transparent',
                    color: showFilters ? 'white' : '#0d6efd',
                    borderColor: '#0d6efd'
                  }}
                  onClick={() => setShowFilters(!showFilters)}
                  title="Mostrar/Ocultar filtros"
                  onMouseEnter={(e) => {
                    if (!showFilters) {
                      e.currentTarget.style.backgroundColor = '#0d6efd';
                      e.currentTarget.style.color = 'white';
                    }
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    if (!showFilters) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#0d6efd';
                    }
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <Filter size={16} className="me-1" />
                  Filtros
                </button>
              </div>
            </div>

            {/* Advanced Filters */}
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
                        className={`btn btn-sm view-mode-btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-primary'}`}
                        style={{
                          transition: 'all 0.2s ease',
                          transform: 'scale(1)'
                        }}
                        onClick={() => setViewMode('grid')}
                        title="Vista en cuadrícula"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05)';
                          if (viewMode !== 'grid') {
                            e.currentTarget.style.backgroundColor = '#0d6efd';
                            e.currentTarget.style.color = 'white';
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          if (viewMode !== 'grid') {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#0d6efd';
                          }
                        }}
                      >
                        <Grid size={14} />
                      </button>
                      <button 
                        type="button" 
                        className={`btn btn-sm view-mode-btn ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'}`}
                        style={{
                          transition: 'all 0.2s ease',
                          transform: 'scale(1)'
                        }}
                        onClick={() => setViewMode('list')}
                        title="Vista en lista"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05)';
                          if (viewMode !== 'list') {
                            e.currentTarget.style.backgroundColor = '#0d6efd';
                            e.currentTarget.style.color = 'white';
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          if (viewMode !== 'list') {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#0d6efd';
                          }
                        }}
                      >
                        <List size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Results Summary */}
            <div className="d-flex justify-content-between align-items-center">
              <small className="text-muted">
                {filteredPersons.length} persona(s) encontrada(s)
                {searchTerm && ` para "${searchTerm}"`}
              </small>
              <div className="d-flex align-items-center gap-2">
                <SortAsc size={14} className="text-muted" />
                <small className="text-muted">
                  Ordenado por {sortBy === 'name' ? 'nombre' : sortBy === 'dni' ? 'DNI' : 'teléfono'} ({sortOrder === 'asc' ? 'A-Z' : 'Z-A'})
                </small>
              </div>
            </div>
          </div>

          {/* Results */}
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
                    <use xlinkHref="#exclamation-triangle-fill"/>
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
              {filteredPersons.length === 0 ? (
                <div className={`text-center py-5 ${isDark ? 'bg-dark border' : 'bg-white'} rounded shadow-sm`}>
                  <div className="mb-4">
                    <Users className="text-muted mb-3" size={64} />
                    <h5 className="text-muted mb-2">No se encontraron personas</h5>
                    <p className="text-muted mb-3">
                      {searchTerm 
                        ? `No hay resultados para "${searchTerm}"` 
                        : 'No hay personas registradas en el sistema'
                      }
                    </p>
                    {searchTerm && (
                      <button 
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => setSearchTerm('')}
                      >
                        Limpiar búsqueda
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className={viewMode === 'grid' ? 'row' : ''}>
                  {filteredPersons.map((person) => (
                    viewMode === 'grid' ? (
                      // Vista en cuadrícula
                      <div key={person.id} className="col-12 col-sm-6 col-lg-4 col-xl-3 mb-3">
                        <div 
                          className={`card h-100 shadow-sm border-0 person-card ${isDark ? 'bg-dark border-secondary' : 'bg-white'}`} 
                          style={{ 
                            cursor: 'pointer', 
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            transform: 'translateY(0)',
                            boxShadow: isDark ? '0 2px 8px rgba(255,255,255,0.1)' : '0 2px 8px rgba(0,0,0,0.1)'
                          }} 
                          onClick={() => handleViewPerson(person.id)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-8px)';
                            e.currentTarget.style.boxShadow = isDark ? '0 12px 30px rgba(255,255,255,0.2)' : '0 12px 30px rgba(0,0,0,0.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = isDark ? '0 2px 8px rgba(255,255,255,0.1)' : '0 2px 8px rgba(0,0,0,0.1)';
                          }}
                        >
                          <div className="card-body p-3">
                            <div className="d-flex align-items-center mb-2">
                              <div className={`rounded-circle d-flex align-items-center justify-content-center me-3 ${isDark ? 'bg-primary bg-opacity-25' : 'bg-primary bg-opacity-10'}`} style={{ width: '40px', height: '40px' }}>
                                <Users className="text-primary" size={20} />
                              </div>
                              <div className="flex-grow-1">
                                <h6 className="card-title mb-0 fw-bold">
                                  {person.name} {person.last_name}
                                </h6>
                                <small className="text-muted">DNI: {person.dni}</small>
                              </div>
                            </div>
                            <div className="card-text">
                              <div className="mb-1 d-flex align-items-center">
                                <small className="text-muted me-2">📞</small>
                                <small>{person.phone}</small>
                              </div>
                              {person.email && (
                                <div className="mb-1 d-flex align-items-center">
                                  <small className="text-muted me-2">✉️</small>
                                  <small className="text-truncate">{person.email}</small>
                                </div>
                              )}
                              {person.address && (
                                <div className="mb-1 d-flex align-items-center">
                                  <small className="text-muted me-2">📍</small>
                                  <small className="text-truncate">{person.address}</small>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="card-footer bg-transparent border-0 p-3 pt-0">
                            <button 
                              className="btn btn-primary btn-sm w-100 d-flex align-items-center justify-content-center detail-button"
                              style={{
                                transition: 'all 0.2s ease',
                                transform: 'scale(1)'
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewPerson(person.id);
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
                              <Eye className="me-2" size={14} />
                              Ver detalles
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Vista en lista
                      <div key={person.id} className="mb-2">
                        <div 
                          className={`card border-0 shadow-sm person-list-card ${isDark ? 'bg-dark' : 'bg-white'}`}
                          style={{ 
                            cursor: 'pointer', 
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            borderLeft: '4px solid transparent'
                          }}
                          onClick={() => handleViewPerson(person.id)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderLeftColor = '#0d6efd';
                            e.currentTarget.style.transform = 'translateX(8px)';
                            e.currentTarget.style.boxShadow = isDark ? '0 8px 25px rgba(255,255,255,0.15)' : '0 8px 25px rgba(0,0,0,0.15)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderLeftColor = 'transparent';
                            e.currentTarget.style.transform = 'translateX(0)';
                            e.currentTarget.style.boxShadow = isDark ? '0 2px 8px rgba(255,255,255,0.1)' : '0 2px 8px rgba(0,0,0,0.1)';
                          }}
                        >
                          <div className="card-body p-3">
                            <div className="row align-items-center">
                              <div className="col-12 col-md-4">
                                <div className="d-flex align-items-center">
                                  <div className={`rounded-circle d-flex align-items-center justify-content-center me-3 ${isDark ? 'bg-primary bg-opacity-25' : 'bg-primary bg-opacity-10'}`} style={{ width: '35px', height: '35px' }}>
                                    <Users className="text-primary" size={16} />
                                  </div>
                                  <div>
                                    <h6 className="mb-0 fw-bold">{person.name} {person.last_name}</h6>
                                    <small className="text-muted">DNI: {person.dni}</small>
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
                                <button className="btn btn-primary btn-sm">
                                  <Eye size={14} />
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
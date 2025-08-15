import {
    FileText,
    TrendingUp,
    Users,
    Filter
  } from 'lucide-react';
  
  export function Sidebar({ isCollapsed, onToggle }) {
    return (
      <div 
        className={`bg-dark text-white transition-width ${
          isCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'
        }`}
        style={{ 
          minHeight: '100vh',
          zIndex: 1000
        }}
      >
        <div className="p-3 d-flex justify-content-between align-items-center">
          {!isCollapsed && (
            <h5 className="fw-bold text-white mb-0">
              <FileText className="me-2 text-primary text-white" size={24} />
              SGI
            </h5>
          )}
          {isCollapsed && (
            <div className="w-100 text-center">
              <a href="/home" className="text-decoration-none">
                <FileText className="text-info" size={24} />
                <span className="text-white"></span>
              </a>
            </div>
          )}
        </div>
  
        <ul className="nav flex-column p-2">
          <li className="nav-item mb-2">
            <a href="/home" className="nav-link text-white d-flex align-items-center" title="Dashboard">
              <TrendingUp className="text-info flex-shrink-0" size={20} />
              {!isCollapsed && <span className="ms-2">Dashboard</span>}
            </a>
          </li>
          <li className="nav-item mb-2">
            <a href="/reports/create" className="nav-link text-white d-flex align-items-center" title="Crear Informe">
              <FileText className="text-white flex-shrink-0" size={20} />
              {!isCollapsed && <span className="ms-2">Crear Informe</span>}
            </a>
          </li>
          <li className="nav-item mb-2">
            <a href="/reports/list" className="nav-link text-white d-flex align-items-center" title="Filtrar Informes">
              <Filter className="text-warning flex-shrink-0" size={20} />
              {!isCollapsed && <span className="ms-2">Filtrar Informes</span>}
            </a>
          </li>
          <li className="nav-item mb-2">
            <a href="/users" className="nav-link text-white d-flex align-items-center" title="Usuarios">

              <Users className="text-danger flex-shrink-0" size={20} />
              {!isCollapsed && <span className="ms-2">Usuarios</span>}
            </a>
          </li>
          <li className="nav-item mt-4">
            <button className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center" title="Cerrar sesión">
              {!isCollapsed ? 'Cerrar sesión' : '↩'}
            </button>
          </li>
        </ul>
      </div>
    );
  }
  
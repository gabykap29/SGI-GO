"use client"
import { useState, useEffect } from 'react';
import { FileText, Users, Map, LogOut, TrendingUp, Filter } from 'lucide-react';
// Asumiendo que esta función de logout existe
import { useAuth } from '../hooks/useAuth';

/**
 * Componente de barra lateral (Sidebar)
 * @param {boolean} isCollapsed - Si la barra está colapsada.
 * @param {function} onToggle - Función para alternar el estado de colapso.
 * @param {boolean} isDark - Si el tema oscuro está activado (Aunque el CSS interno lo ignora).
 * @param {boolean} isMobile - Estado del padre para modo móvil.
 */
export function Sidebar({ isCollapsed, onToggle, isDark = true }) {
  // 1. ESTADOS FALTANTES
  const [isMobile, setIsMobile] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const { logout } = useAuth(); // Asumiendo que useAuth proporciona el logout

  // 2. EFECTOS
  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
    };

    if (typeof window !== 'undefined') {
      checkMobile();
      window.addEventListener('resize', checkMobile);

      // Obtener rol del usuario desde localStorage
      const role = localStorage.getItem('userRole');
      setUserRole(role);

      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  // 3. LÓGICA DE ROLES
  // Check if user is admin or moderator
  const canViewUsers = userRole === 'admin' || userRole === 'moderator';

  // 4. FUNCIÓN DE LOGOUT
  const handleLogout = () => {
    // Ejecutar la lógica de cerrar sesión, por ejemplo:
    // logout(); // Esto dependerá de cómo tengas implementado el useAuth
    console.log("Cerrando sesión...");
    alert("Sesión cerrada (Simulación)");
    // Redirigir o limpiar tokens
  }


  return (
    <>
      <style jsx>{`
                /* ... TU CSS EXISTENTE ... */
                .sidebar {
                    position: fixed;
                    top: 0;
                    left: 0;
                    height: 100vh;
                    background: linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%);
                    color: #ffffff;
                    transition: width 0.3s ease;
                    z-index: 1000;
                    overflow-y: auto;
                    border-right: 1px solid #444;
                    box-shadow: 2px 0 10px rgba(0,0,0,0.3);
                }
                
                .sidebar-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 999;
                    opacity: 0;
                    visibility: hidden;
                    transition: opacity 0.3s ease, visibility 0.3s ease;
                }
                
                .sidebar-overlay.show {
                    opacity: 1;
                    visibility: visible;
                }
                
                .sidebar-expanded {
                    width: 250px;
                }
                
                .sidebar-collapsed {
                    width: 80px;
                }
                
                .sidebar-link {
                    border-radius: 8px;
                    margin: 2px 0;
                    transition: all 0.3s ease;
                    padding: 8px 12px !important;
                    color: #ffffff !important;
                }
                
                .sidebar-link:hover {
                    background-color: rgba(255, 255, 255, 0.1);
                    transform: translateX(5px);
                    color: #ffffff !important;
                }
                
                .sidebar-link span {
                    color: #ffffff !important;
                }
                
                .sidebar h5 {
                    color: #ffffff !important;
                }
                
                .sidebar .text-white {
                    color: #ffffff !important;
                }
                
                .logout-btn {
                    border-radius: 8px;
                    transition: all 0.3s ease;
                    background-color: transparent;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    color: #ffffff !important;
                }
                
                .logout-btn:hover {
                    background-color: rgba(220, 53, 69, 0.2);
                    border-color: #dc3545;
                    transform: scale(1.02);
                    color: #ffffff !important;
                }
                
                @media (max-width: 767.98px) {
                    .sidebar {
                        transform: translateX(-100%);
                        transition: transform 0.3s ease;
                        width: 280px !important;
                        z-index: 9998;
                    }
                    
                    .sidebar.show {
                        transform: translateX(0);
                    }
                    
                    .sidebar-expanded,
                    .sidebar-collapsed {
                        width: 280px !important;
                    }
                }
            `}</style>

      {/* Overlay para móviles */}
      {isMobile && !isCollapsed && (
        <div
          className="sidebar-overlay show"
          onClick={onToggle}
        />
      )}

      <div
        className={`sidebar ${isCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'} ${isMobile && !isCollapsed ? 'show' : ''}`}
      // Nota: Usé `isMobile && !isCollapsed ? 'show' : ''` para controlar la visibilidad móvil
      >
        <div className={`p-3 d-flex justify-content-between align-items-center text-white ${isMobile ? 'pt-5' : ''}`}>
          {!isCollapsed && (
            <h5 className="fw-bold mb-0 text-white">
              <FileText className="me-2 text-info" size={24} />
              SGI
            </h5>
          )}
          {isCollapsed && (
            <div className="w-100 text-center">
              <a href="/home" className="text-decoration-none">
                <FileText className="text-info" size={24} />
                <span></span>
              </a>
            </div>
          )}
        </div>

        <ul className="nav flex-column p-2">
          <li className="nav-item mb-2">
            <a href="/home" className="nav-link text-white d-flex align-items-center sidebar-link" title="Dashboard">
              <TrendingUp className="text-info flex-shrink-0" size={20} />
              {!isCollapsed && <span className="ms-2">Dashboard</span>}
            </a>
          </li>
          <li className="nav-item mb-2">
            <a href="/reports/create" className="nav-link text-white d-flex align-items-center sidebar-link" title="Crear Informe">
              <FileText className="text-success flex-shrink-0" size={20} />
              {!isCollapsed && <span className="ms-2">Crear Informe</span>}
            </a>
          </li>
          <li className="nav-item mb-2">
            <a href="/reports/list" className="nav-link text-white d-flex align-items-center sidebar-link" title="Filtrar Informes">
              <Filter className="text-warning flex-shrink-0" size={20} />
              {!isCollapsed && <span className="ms-2">Filtrar Informes</span>}
            </a>
          </li>
          <li className="nav-item mb-2">
            <a href="/persons/search" className="nav-link text-white d-flex align-items-center sidebar-link" title="Buscar Personas">
              <Users className="text-white flex-shrink-0" size={20} />
              {!isCollapsed && <span className="ms-2">Buscar Personas</span>}
            </a>
          </li>

          {/* 5. ARREGLO DE RENDERING CONDICIONAL Y ROL */}
          {canViewUsers && (
            <>
              <li className="nav-item mb-2">
                <a href="/users" className="nav-link text-white d-flex align-items-center sidebar-link" title="Usuarios">
                  <Users className="text-danger flex-shrink-0" size={20} />
                  {!isCollapsed && <span className="ms-2">Usuarios</span>}
                </a>
              </li>
              <li className="nav-item mb-2">
                <a href="/reports/map" className="nav-link text-white d-flex align-items-center sidebar-link" title="Mapa de Reportes">
                  <Map className="text-white flex-shrink-0" size={20} />
                  {!isCollapsed && <span className="ms-2">Mapa de Reportes</span>}
                </a>
              </li>
            </>
          )}
          {/* FIN DEL ARREGLO DE RENDERING CONDICIONAL */}

          <li className="nav-item mt-4">
            <button
              className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center logout-btn"
              title="Cerrar sesión"
              onClick={handleLogout} // AGREGADO EL MANEJADOR
            >
              <LogOut size={18} className={!isCollapsed ? "me-1" : ""} />
              {!isCollapsed ? 'Cerrar sesión' : ''}
              {/* Ajuste: Si está colapsado, solo mostramos el ícono LogOut, no '↩' */}
            </button>
          </li>
        </ul>
      </div>
    </>
  );
}
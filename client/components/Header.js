"use client"
import { useState, useEffect } from 'react';
import { FileText, Menu, Users, Sun, Moon, LogOut, X } from 'lucide-react';
import { getUsername } from '../hooks/handleUser';
import { handleError } from '../hooks/toaster';
import { logoutUser } from '../hooks/auth';

export function Header({ 
  sidebarCollapsed, 
  setSidebarCollapsed, 
  isDark, 
  toggleTheme,
  isMobile 
}) {
  const [username, setUsername] = useState('Usuario');

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const user = await getUsername();
        setUsername(user);
      } catch (error) {
        console.error('Error al obtener username:', error);
        handleError('Error al cargar el nombre de usuario');
      }
    };

    fetchUsername();
  }, []);

  return (
    <>
      <style jsx>{`
        .navbar {
          background: ${isDark ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' : 'linear-gradient(135deg, #1a1a1a 100%)'};
          border-bottom: 1px solid ${isDark ? '#444' : '#dee2e6'};
          box-shadow: 0 2px 10px rgba(0,0,0,${isDark ? '0.3' : '0.1'});
          backdrop-filter: blur(10px);
          z-index: 1030;
          position: sticky;
          top: 0;
        }
        
        .theme-toggle {
          background: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'};
          border-radius: 8px;
          padding: 8px;
          color: ${isDark ? '#ffffff' : '#000000'};
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .theme-toggle:hover {
          background: ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'};
          transform: scale(1.05);
        }
        
        .sidebar-toggle {
          background: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'};
          border-radius: 8px;
          color: ${isDark ? '#ffffff' : '#000000'};
          transition: all 0.3s ease;
        }
        
        .sidebar-toggle:hover {
          background: ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'};
          transform: scale(1.05);
        }
        
        .sidebar-close-btn {
          background: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'};
          border-radius: 8px;
          color: ${isDark ? '#ffffff' : '#000000'};
          transition: all 0.3s ease;
          display: none;
        }
        
        .sidebar-close-btn:hover {
          background: ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'};
          transform: scale(1.05);
        }
        
        .navbar-brand {
          font-weight: 700;
          font-size: 1.1rem;
          transition: all 0.3s ease;
        }
        
        .navbar-brand:hover {
          transform: scale(1.02);
        }
        
        @media (max-width: 767.98px) {
          .navbar-brand {
            font-size: 0.9rem;
          }
          
          .navbar-brand span {
            display: none;
          }
          
          .sidebar-close-btn {
            display: ${!sidebarCollapsed ? 'flex' : 'none'};
            align-items: center;
            justify-content: center;
            padding: 8px;
          }
        }
      `}</style>
      
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid px-3">
          <div className="d-flex align-items-center">
            <button 
              className="sidebar-toggle me-3 btn text-white"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              aria-label="Contraer/Expandir sidebar"
            >
              <Menu size={20} />
            </button>
            <a className="navbar-brand fw-bold" href="#" style={{color: isDark ? '#ffffff' : 'inherit'}}>
              <FileText className="me-2" size={24} />
              <span>SGI - Sistema de Gestión de Informes</span>
            </a>
          </div>
          <div className="navbar-nav ms-auto d-flex align-items-center gap-2">
            {isMobile && !sidebarCollapsed && (
              <button 
                className="sidebar-close-btn btn"
                onClick={() => setSidebarCollapsed(true)}
                title="Cerrar sidebar"
              >
                <X size={18} />
              </button>
            )}
            <button 
              className="theme-toggle"
              onClick={toggleTheme}
              title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <span className="nav-link d-none d-md-flex align-items-center" style={{color: isDark ? '#ffffff' : 'inherit'}}>
              <Users size={18} className="me-1" />
              {username}
            </span>
            <button 
              className="btn btn-outline-danger btn-sm"
              onClick={logoutUser}
              title="Cerrar sesión"
            >
              <LogOut size={16} className="me-1 d-none d-sm-inline" />
              <span className="d-none d-sm-inline">Salir</span>
              <LogOut size={16} className="d-sm-none" />
            </button>
          </div>
        </div>
      </nav>
    </>
  );}

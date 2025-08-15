"use client"
import { useState, useEffect } from 'react';
import { FileText, Menu, Users, Sun, Moon, LogOut } from 'lucide-react';
import { getUsername } from '../hooks/handleUser';
import { handleError } from '../hooks/toaster';
import { logoutUser } from '../hooks/auth';

export function Header({ 
  sidebarCollapsed, 
  setSidebarCollapsed, 
  isDark, 
  toggleTheme 
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
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <div className="d-flex align-items-center">
          <a className="navbar-brand fw-bold" href="#" style={{color: isDark ? '#ffffff' : 'inherit'}}>
            <FileText className="me-2" size={24} />
            SGI - Sistema de Gestión de Informes
          </a>
        </div>
        <div className="navbar-nav ms-auto d-flex align-items-center">
          <button 
            className="theme-toggle me-3"
            onClick={toggleTheme}
            title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <span className="nav-link me-3" style={{color: isDark ? '#ffffff' : 'inherit'}}>
            <Users size={18} className="me-1" />
            {username}
          </span>
          <button 
            className="btn btn-secondary me-3"
            style={{ zIndex: 1001 }}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label="Contraer/Expandir sidebar"
          >
            <Menu size={20} />
          </button>
          <button 
            className="btn btn-outline-danger btn-sm"
            onClick={logoutUser}
            title="Cerrar sesión"
          >
            <LogOut size={16} className="me-1" />
            Salir
          </button>
        </div>
      </div>
    </nav>
  );
}
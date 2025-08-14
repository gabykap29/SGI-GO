"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, TrendingUp, AlertTriangle, CheckCircle, Clock, Users, Menu, X } from 'lucide-react';
import { Sidebar } from '../../../components/Sidebard';
import { getReports } from '../../../hooks/handleReports';

export default function DashboardInicio() {
  const router = useRouter();
  const [informes, setInformes] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
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
        return 'bg-danger text-white'; // más suave pero visible
      case 'Salud':
        return 'bg-success';
      case 'Seguridad':
        return 'bg-dark text-white';
      case 'Eventos Climaticos':
        return 'bg-warning text-dark';
      case 'Hídricos':
        return 'bg-primary-subtle text-dark';
      case 'Económicos':
        return 'bg-secondary';
      case 'Ambientales':
        return 'bg-success text-dark';
      case 'Sociales':
        return 'bg-info text-dark';
      case 'Turismo':
        return 'bg-pink text-white';
      case 'Deportivos':
        return 'bg-indigo text-white';
      case 'OTROS':
        return 'bg-secondary';
      default:
        return 'bg-light text-dark';
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
            background-color: #f8f9fa;
            border-radius: 4px;
          }
        `}
      </style>
      <div className="d-flex">
        <Sidebar 
          isCollapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        <div className="flex-grow-1 bg-light min-vh-100">
          {/* Header */}
          <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
              <div className="d-flex align-items-center">
                <button 
                  className="btn btn-dark me-2"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  aria-label="Contraer/Expandir sidebar"
                >
                  <Menu size={20} />
                </button>
                <a className="navbar-brand fw-bold" href="#">
                  <FileText className="me-2" size={24} />
                  SGI - Sistema de Gestión de Informes
                </a>
              </div>
              <div className="navbar-nav ms-auto">
                <a className="nav-link" href="#">
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
            <div className="p-4 rounded shadow-sm bg-white border-start border-4 border-dark">
              <div className="d-flex align-items-center mb-2">
                <FileText size={28} className="me-2 text-dark" />
                <h1 className="h3 mb-0 text-dark">Dashboard</h1>
              </div>
              <p className="text-muted mb-1">Bienvenido al sistema de gestión de informes.</p>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <a href="#" className="text-decoration-none">Inicio</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Dashboard
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>


            {/* Cards de estadísticas */}
            <div className="row mb-4 ">
              <div className="col-xl-4 col-md-4 col-sm-6 mb-3">
                <div className="card border-0 shadow-sm border-start border-4 border-danger">
                  <div className="card-body">
                    <div className="d-flex align-items-center ">
                      <div className="flex-shrink-0">
                        <AlertTriangle className="text-danger" size={32} />
                      </div>
                      <div className="flex-grow-1 ms-3 ">
                        <div className="fw-bold fs-4 text-dark ">{stats.Urgente || 0}</div>
                        <div className="text-muted small">Urgentes</div>
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
                        <div className="fw-bold fs-4 text-dark">{stats.Completado || 0}</div>
                        <div className="text-muted small">Completados</div>
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
                        <Clock className="text-secondary" size={32} />
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <div className="fw-bold fs-4 text-dark">{stats.Pendiente || 0}</div>
                        <div className="text-muted small">Pendientes</div>
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
                  <div className="card-header bg-white border-bottom">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0 fw-bold text-dark">Últimos Informes Cargados</h5>
                      <button className="btn btn-dark btn-sm">
                        Ver Todos
                      </button>
                    </div>
                  </div>
                  <div className="card-body p-4 bg-white rounded-bottom shadow-sm">
                  <div className="table-responsive">
                    <table className="table table-hover align-middle text-nowrap">
                      <thead className="table-light">
                        <tr>
                          <th className="fw-bold text-secondary">Departamento</th>
                          <th className="fw-bold text-secondary">Localidad</th>
                          <th className="fw-bold text-secondary">Tipo</th>
                          <th className="fw-bold text-secondary">Fecha</th>
                          <th className="fw-bold text-secondary">Título</th>
                          <th className="fw-bold text-secondary">Estado</th>
                          <th className="fw-bold text-secondary text-center">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        { informes.length > 0 ? informes.map((informe) => (
                          <tr key={informe.id} className="border-bottom">
                            <td className="py-3">
                              <span className="fw-semibold text-dark">{informe.department.name}</span>
                            </td>
                            <td className="py-3 text-muted">
                              {informe.locality.name}
                            </td>
                            <td className="py-3">
                              <span className={`badge rounded-pill ${getBadgeClass(informe.type_report.name)} text-white px-3`}>
                                {informe.type_report.name}
                              </span>
                            </td>
                            <td className="py-3 text-muted">
                              {formatFecha(informe.date)}
                            </td>
                            <td className="py-3 text-dark">
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
                                  className="btn btn-sm btn-outline-primary d-flex align-items-center"
                                  onClick={() => router.push(`/reports/view/${informe.id}`)}
                                >
                                  <i className="bi bi-eye me-1"></i> Ver
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-secondary d-flex align-items-center"
                                  onClick={() => router.push(`/reports/edit/${informe.id}`)}
                                >
                                  <i className="bi bi-pencil me-1"></i> Editar
                                </button>
                              </div>
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={7} className="text-center">
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
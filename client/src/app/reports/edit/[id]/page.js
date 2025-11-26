"use client"
import { useState, useEffect } from 'react';
import { FileText, Save, ArrowLeft, Menu, Users, Calendar, MapPin, FileType, User, AlertCircle, Edit, Import, UserPlus } from 'lucide-react';
import { Sidebar } from '../../../../../components/Sidebard';
import { Header } from '../../../../../components/Header';
import { AddPersonModal } from '../../../../../components/AddPersonModal';
import { getDepartments } from '../../../../../hooks/handleDepartments';
import { getLocalities } from '../../../../../hooks/handleLocalities';
import { getTypeReports } from '../../../../../hooks/handleTypeReports';
import { UpdateReport, getReportById, addPersonToReport, removePersonFromReport } from '../../../../../hooks/handleReports';
import { useRouter } from 'next/navigation';
import { handleError, handleSuccess } from '../../../../../hooks/toaster';
import { Toaster } from 'sonner';
import useTheme from '../../../../../hooks/useTheme';
import { Sun, Moon } from 'lucide-react';
import { useAuth } from '../../../../../hooks/useAuth';

export default function EditarInforme({ params }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const reportId = params?.id;

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebarCollapsed');
      return saved !== null ? JSON.parse(saved) : true;
    }
    return true;
  });
  const [isMobile, setIsMobile] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [departments, setDepartments] = useState([]);
  const [localities, setLocalities] = useState([]);
  const [typeReports, setTypeReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme, toggleTheme, isDark } = useTheme();
  const [formData, setFormData] = useState({
    id: 0,
    department_id: 0,
    locality_id: 0,
    date: '',
    type_report_id: 0,
    status: '',
    title: '',
    content: '',
    description: '',
    coordinates: '',

  });

  // Estados para el modal de personas
  const [showPersonModal, setShowPersonModal] = useState(false);
  const [reportPersons, setReportPersons] = useState([]);

  useEffect(() => {
    async function fetchInitialData() {
      try {
        setLoading(true);

        // Cargar departamentos
        const departmentsData = await getDepartments();
        setDepartments(departmentsData);

        // Cargar tipos de informes
        const typeReportsData = await getTypeReports();
        setTypeReports(typeReportsData);

        // Cargar datos del informe específico
        if (reportId) {
          const reportData = await getReportById(reportId);
          if (reportData) {
            setFormData({
              id: reportData.id,
              department_id: reportData.department_id,
              locality_id: reportData.locality_id,
              date: reportData.date,
              type_report_id: reportData.type_report_id,
              status: reportData.status,
              title: reportData.title,
              content: reportData.content,
              description: reportData.description || '',
              user: reportData.user || null,
              user_id: reportData.user_id,
              coordinates: reportData.latitude + ',' + reportData.longitude,
            });

            // Cargar localidades del departamento del informe
            if (reportData.department_id) {
              const localitiesData = await getLocalities(reportData.department_id);
              setLocalities(localitiesData);
            }

            // Cargar personas vinculadas al informe
            if (reportData.persons && Array.isArray(reportData.persons)) {
              setReportPersons(reportData.persons);
            }
          }
        }

        console.log('Datos cargados exitosamente');
      } catch (error) {
        console.error('Error al cargar datos:', error);
        handleError('Error al cargar los datos del informe');
      } finally {
        setLoading(false);
      }
    }

    fetchInitialData();
  }, [reportId]);

  // Cargar localidades cuando cambie el departamento
  useEffect(() => {
    async function loadLocalitiesForDepartment() {
      if (formData.department_id && formData.department_id !== 0) {
        try {
          const localitiesData = await getLocalities(formData.department_id);
          setLocalities(localitiesData);
        } catch (error) {
          console.error('Error al cargar localidades:', error);
        }
      }
    }

    loadLocalitiesForDepartment();
  }, [formData.department_id]);

  // Filtrar localidades según departamento seleccionado
  const filteredLocalities = localities.filter(
    locality => locality.department_id == formData.department_id
  );

  // Auto-colapsar en pantallas pequeñas y manejar responsive
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
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Guardar estado del sidebar en localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
    }
  }, [sidebarCollapsed]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar localidad cuando cambie el departamento
    if (name === 'department_id') {
      setFormData(prev => ({
        ...prev,
        locality_id: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log('Datos del formulario a actualizar:', formData);

      if (formData.coordinates && formData.coordinates.trim()) {
        console.log('Coordenadas:', formData.coordinates);
        const coords = formData.coordinates.split(',').map(coord => coord.trim());
        console.log('Coordenadas parseadas:', coords);
        if (coords.length === 2) {
          const latitude = parseFloat(coords[0]);
          const longitude = parseFloat(coords[1]);
          console.log('Latitud:', latitude);
          console.log('Longitud:', longitude);
          formData.latitude = latitude;
          formData.longitude = longitude;
        }
      }
      let reportData = { ...formData };
      // Eliminar el campo coordinates del objeto a enviar
      delete reportData.coordinates;

      const result = await UpdateReport(formData.id, reportData);

      if (!result) {
        handleError('Error al actualizar el informe. Por favor, intente nuevamente.');
        return;
      }

      console.log('Informe actualizado:', result);
      handleSuccess('Informe actualizado exitosamente');

      // Opcional: redirigir a la lista de informes o a la vista del informe
      // router.push('/informes');
    } catch (error) {
      console.error('Error al actualizar:', error);
      handleError('Error al actualizar el informe');
    }
  };

  const handleCancel = () => {
    if (confirm('¿Está seguro que desea cancelar? Los cambios no guardados se perderán.')) {
      router.back();
    }
  };

  // Funciones para manejar el modal de personas
  const handleOpenPersonModal = () => {
    setShowPersonModal(true);
  };

  const handleClosePersonModal = () => {
    setShowPersonModal(false);
  };

  const handlePersonAdded = async (person) => {
    // Verificar si la persona ya está en la lista
    const personExists = reportPersons.some(p => p.id === person.id);
    if (personExists) {
      handleError('Esta persona ya está agregada al informe');
      return;
    }

    try {
      // Vincular la persona al informe en el backend
      await addPersonToReport(formData.id, person.id);

      // Agregar a la lista local
      setReportPersons(prev => [...prev, person]);
      handleSuccess(`${person.name} ${person.last_name} agregado al informe`);
    } catch (error) {
      console.error('Error al vincular persona:', error);
      handleError(error.message || 'Error al vincular persona al informe');
    }
  };

  const handleRemovePerson = async (personId) => {
    try {
      // Desvincular la persona del informe en el backend
      await removePersonFromReport(formData.id, personId);

      // Remover de la lista local
      setReportPersons(prev => prev.filter(p => p.id !== personId));
      handleSuccess('Persona removida del informe');
    } catch (error) {
      console.error('Error al desvincular persona:', error);
      handleError(error.message || 'Error al remover persona del informe');
    }
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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.0/font/bootstrap-icons.min.css"
        rel="stylesheet"
      />

      <style jsx>{`
        .main-content {
          margin-left: ${windowWidth >= 768 ? (sidebarCollapsed ? '70px' : '250px') : '0'};
          width: ${windowWidth >= 768 ? (sidebarCollapsed ? 'calc(100% - 70px)' : 'calc(100% - 250px)') : '100%'};
          transition: margin-left 0.3s ease, width 0.3s ease;
          min-height: 100vh;
          background-color: ${isDark ? '#1a1a1a' : '#f8f9fa'};
          color: ${isDark ? '#ffffff' : '#000000'};
          position: relative;
          z-index: 1;
        }
        
        .edit-card {
          background-color: ${isDark ? '#2d2d2d' : '#ffffff'};
          border: 1px solid ${isDark ? '#444' : '#e9ecef'};
          border-radius: 15px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }
        
        .edit-card:hover {
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }
        
        .card-header-custom {
          background: ${isDark ? 'linear-gradient(135deg, #333 0%, #444 100%)' : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'};
          border-bottom: 1px solid ${isDark ? '#555' : '#dee2e6'};
          border-radius: 15px 15px 0 0;
        }
        
        .form-control {
          background-color: ${isDark ? '#444' : '#ffffff'};
          border-color: ${isDark ? '#555' : '#ced4da'};
          color: ${isDark ? '#ffffff' : '#000000'};
          border-radius: 10px;
        }
        
        .form-control:focus {
          background-color: ${isDark ? '#444' : '#ffffff'};
          border-color: #007bff;
          color: ${isDark ? '#ffffff' : '#000000'};
          box-shadow: 0 0 0 0.2rem rgba(0,123,255,0.25);
        }
        
        .form-control:disabled {
          background-color: ${isDark ? '#333' : '#e9ecef'};
          color: ${isDark ? '#888' : '#6c757d'};
        }
        
        .form-select {
          background-color: ${isDark ? '#444' : '#ffffff'};
          border-color: ${isDark ? '#555' : '#ced4da'};
          color: ${isDark ? '#ffffff' : '#000000'};
          border-radius: 10px;
        }
        
        .form-select:focus {
          background-color: ${isDark ? '#444' : '#ffffff'};
          border-color: #007bff;
          color: ${isDark ? '#ffffff' : '#000000'};
          box-shadow: 0 0 0 0.2rem rgba(0,123,255,0.25);
        }
        
        .form-label {
          color: ${isDark ? '#ffffff' : '#000000'};
          font-weight: 500;
        }
        
        .btn-custom {
          border-radius: 10px;
          padding: 0.75rem 1.5rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .btn-custom:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        
        .alert-custom {
          background-color: ${isDark ? '#2d2d2d' : '#fff3cd'};
          border-color: ${isDark ? '#444' : '#ffeaa7'};
          color: ${isDark ? '#ffffff' : '#856404'};
          border-radius: 10px;
        }
        
        .title-card {
          background-color: ${isDark ? '#2d2d2d' : '#ffffff'};
          border: 1px solid ${isDark ? '#444' : '#e9ecef'};
          color: ${isDark ? '#ffffff' : '#000000'};
        }
        
        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 999;
          display: none;
        }
        
        @media (max-width: 768px) {
          .main-content {
            margin-left: 0 !important;
            width: 100% !important;
            padding: 0.5rem;
          }
          
          .container-fluid {
            padding-left: 0.5rem;
            padding-right: 0.5rem;
          }
          
          .edit-card {
            margin-bottom: 1rem;
            border-radius: 10px;
          }
          
          .card-header-custom {
            padding: 1rem;
            border-radius: 10px 10px 0 0;
          }
          
          .card-body {
            padding: 1rem;
          }
          
          .form-floating {
            margin-bottom: 1rem;
          }
          
          .btn-custom {
            width: 100%;
            margin-bottom: 0.5rem;
          }
          
          .d-flex.gap-3 {
            flex-direction: column;
            gap: 0.5rem !important;
          }
          
          .sidebar-overlay.show {
            display: block;
          }
        }
        
        @media (max-width: 576px) {
          .main-content {
            padding: 0.25rem;
          }
          
          .container-fluid {
            padding-left: 0.25rem;
            padding-right: 0.25rem;
          }
          
          .title-card .card-body {
            padding: 1rem;
          }
          
          .title-card h1 {
            font-size: 1.5rem;
          }
          
          .title-card .d-flex {
            flex-direction: column;
            gap: 1rem;
          }
          
          .form-floating textarea {
            min-height: 100px !important;
          }
          
          .alert-custom {
            padding: 0.75rem;
            font-size: 0.875rem;
          }
        }
      `}</style>

      <div className={`sidebar-overlay ${!sidebarCollapsed && windowWidth < 768 ? 'show' : ''}`} onClick={() => setSidebarCollapsed(true)}></div>
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        isDark={true}
      />
      <div className="main-content">
        <Header
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          isDark={isDark}
          toggleTheme={toggleTheme}
          isMobile={isMobile}
        />

        <div className="container-fluid py-4 min-vh-100">
          {/* Title Card */}
          <div className="card title-card shadow-sm mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h1 className="h3 mb-1">Editar Informe #{formData.id}</h1>
                  <p className="text-muted mb-0">Modifica los campos necesarios para actualizar el informe</p>
                </div>
                <div className="d-flex align-items-center">
                  <Edit size={32} className="text-primary me-3" />
                  <button
                    className="btn btn-outline-secondary btn-custom d-flex align-items-center"
                    onClick={handleCancel}
                  >
                    <ArrowLeft size={16} className="me-1" />
                    Volver
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <div className="row">
            <div className="col-12">
              <div className="card edit-card border-0 shadow-sm">
                <div className="card-header card-header-custom border-bottom">
                  <h5 className="mb-0 fw-bold text-primary d-flex align-items-center">
                    <Edit size={20} className="me-2 text-warning" />
                    Modificar Información del Informe
                  </h5>
                </div>
                <div className="card-body p-4">
                  <form onSubmit={handleSubmit}>
                    <div className="row g-4">
                      {/* ID del informe (solo lectura) */}
                      <div className="col-md-6">
                        <div className="form-floating">
                          <input
                            type="text"
                            className="form-control"
                            id="report_id"
                            value={`#${formData.id}`}
                            readOnly
                            disabled
                          />
                          <label htmlFor="report_id">
                            <FileText size={16} className="me-1" />
                            ID del Informe
                          </label>
                        </div>
                      </div>

                      {/* Usuario creador (solo lectura) */}
                      <div className="col-md-6">
                        <div className="form-floating">
                          <input
                            type="text"
                            className="form-control"
                            id="created_by"
                            value={formData.user ? `${formData.user.name} ${formData.user.last_name} (@${formData.user.username})` : 'Cargando...'}
                            readOnly
                            disabled
                          />
                          <label htmlFor="created_by">
                            <User size={16} className="me-1" />
                            Creado por
                          </label>
                        </div>
                      </div>

                      {/* Estado */}
                      <div className="col-md-6">
                        <div className="form-floating">
                          <select
                            className="form-select"
                            id="status"
                            name="status"
                            value={formData.status || ''}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="pending">Seleccionar estado</option>
                            <option value="pending">Pendiente</option>
                            <option value="urgent">Urgente</option>
                            <option value="complete">Completado</option>
                          </select>
                          <label htmlFor="status">
                            <FileType size={16} className="me-1" />
                            Estado *
                          </label>
                        </div>
                      </div>

                      {/* Primera fila - Ubicación */}
                      <div className="col-md-6">
                        <div className="form-floating">
                          <select
                            className="form-select"
                            id="department_id"
                            name="department_id"
                            value={formData.department_id}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">Seleccionar departamento</option>
                            {departments.map(dept => (
                              <option key={dept.id} value={dept.id}>{dept.name}</option>
                            ))}
                          </select>
                          <label htmlFor="department_id">
                            <MapPin size={16} className="me-1" />
                            Departamento *
                          </label>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-floating">
                          <select
                            className="form-select"
                            id="locality_id"
                            name="locality_id"
                            value={formData.locality_id}
                            onChange={handleInputChange}
                            required
                            disabled={!formData.department_id}
                          >
                            <option value="">Seleccionar localidad</option>
                            {filteredLocalities.map(locality => (
                              <option key={locality.id} value={locality.id}>{locality.name}</option>
                            ))}
                          </select>
                          <label htmlFor="locality_id">
                            <MapPin size={16} className="me-1" />
                            Localidad *
                          </label>
                        </div>
                      </div>

                      {/* Segunda fila - Fecha y Tipo */}
                      <div className="col-md-6">
                        <div className="form-floating">
                          <input
                            type="datetime-local"
                            className="form-control"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            required
                          />
                          <label htmlFor="date">
                            <Calendar size={16} className="me-1" />
                            Fecha *
                          </label>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-floating">
                          <select
                            className="form-select"
                            id="type_report_id"
                            name="type_report_id"
                            value={formData.type_report_id}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">Seleccionar tipo de informe</option>
                            {typeReports.map(type => (
                              <option key={type.id} value={type.id}>{type.name}</option>
                            ))}
                          </select>
                          <label htmlFor="type_report_id">
                            <FileType size={16} className="me-1" />
                            Tipo de Informe *
                          </label>
                        </div>
                      </div>

                      {/* Tercera fila - Título */}
                      <div className="col-12">
                        <div className="form-floating">
                          <input
                            type="text"
                            className="form-control"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Ingrese el título del informe"
                            required
                          />
                          <label htmlFor="title">
                            <FileText size={16} className="me-1" />
                            Título del Informe *
                          </label>
                        </div>
                      </div>

                      {/* Cuarta fila - Contenido */}
                      <div className="col-12">
                        <div className="form-floating">
                          <textarea
                            className="form-control"
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleInputChange}
                            placeholder="Ingrese el contenido detallado del informe"
                            style={{ height: '150px' }}
                            required
                          ></textarea>
                          <label htmlFor="content">
                            <FileText size={16} className="me-1" />
                            Contenido del Informe *
                          </label>
                        </div>
                      </div>

                      {/* Quinta fila - Descripción */}
                      <div className="col-12">
                        <div className="form-floating">
                          <textarea
                            className="form-control"
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Ingrese una descripción adicional (opcional)"
                            style={{ height: '100px' }}
                          ></textarea>
                          <label htmlFor="description">
                            <FileText size={16} className="me-1" />
                            Descripción Adicional
                          </label>
                        </div>
                      </div>

                      {/* Coordenadas */}
                      <div className="col-12">
                        <div className="form-floating">
                          <input
                            type="text"
                            className="form-control"
                            id="coordinates"
                            name="coordinates"
                            value={formData.coordinates}
                            onChange={handleInputChange}
                            placeholder="Latitud, Longitud"
                          />
                          <label htmlFor="coordinates">
                            <MapPin size={16} className="me-1" />
                            Coordenadas (Latitud, Longitud)
                          </label>
                        </div>
                      </div>

                      {/* Sexta fila - Personas involucradas */}
                      <div className="col-12">
                        <div className="card border-0 bg-light">
                          <div className="card-header bg-transparent border-0 pb-0">
                            <div className="d-flex justify-content-between align-items-center">
                              <h6 className="mb-0 fw-bold text-primary d-flex align-items-center">
                                <Users size={18} className="me-2" />
                                Personas Involucradas
                              </h6>
                              <button
                                type="button"
                                className="btn btn-outline-primary btn-sm d-flex align-items-center"
                                onClick={handleOpenPersonModal}
                              >
                                <UserPlus size={16} className="me-1" />
                                Agregar Persona
                              </button>
                            </div>
                          </div>
                          <div className="card-body pt-2">
                            {reportPersons.length === 0 ? (
                              <div className="text-center py-3 text-muted">
                                <Users size={32} className="mb-2 opacity-50" />
                                <p className="mb-0">No hay personas agregadas al informe</p>
                                <small>Haga clic en &quot;Agregar Persona&quot; para comenzar</small>
                              </div>
                            ) : (
                              <div className="row g-2">
                                {reportPersons.map((person) => (
                                  <div key={person.id} className="col-md-6 col-lg-4">
                                    <div className="card border border-primary border-opacity-25 h-100">
                                      <div className="card-body p-3">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                          <div className="d-flex align-items-center">
                                            <User size={16} className="text-primary me-2" />
                                            <h6 className="mb-0 fw-semibold">{person.name} {person.last_name}</h6>
                                          </div>
                                          <button
                                            type="button"
                                            className="btn btn-outline-danger btn-sm p-1"
                                            onClick={() => handleRemovePerson(person.id)}
                                            title="Remover persona"
                                          >
                                            <AlertCircle size={14} />
                                          </button>
                                        </div>
                                        <div className="small text-muted">
                                          <p className="mb-1"><strong>DNI:</strong> {person.dni}</p>
                                          <p className="mb-1"><strong>Dirección:</strong> {person.address}</p>
                                          <p className="mb-0"><strong>Localidad:</strong> {person.locality}</p>
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

                      {/* Botones de acción */}
                      <div className="col-12">
                        <div className="d-flex justify-content-end gap-3 pt-3 border-top">
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-custom"
                            onClick={handleCancel}
                          >
                            <ArrowLeft size={18} className="me-1" />
                            Cancelar
                          </button>
                          <button type="submit" className="btn btn-warning btn-custom">
                            <Save size={18} className="me-1" />
                            Guardar Cambios
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Nota informativa */}
          <div className="row mt-4">
            <div className="col-12">
              <div className="alert alert-custom border-0 shadow-sm">
                <div className="d-flex align-items-center">
                  <AlertCircle size={20} className="me-2" />
                  <div>
                    <strong>Atención:</strong> Está editando un informe existente. Los campos marcados con (*) son obligatorios.
                    Asegúrese de revisar todos los cambios antes de guardar.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal para agregar personas */}
        <AddPersonModal
          isOpen={showPersonModal}
          onClose={handleClosePersonModal}
          onPersonAdded={handlePersonAdded}
          isDark={isDark}
        />

        <Toaster
          position="top-right"
          richColors
          closeButton
          duration={4000}
        />
      </div>
    </>
  );
}
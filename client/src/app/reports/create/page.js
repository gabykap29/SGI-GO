"use client"
import { useState, useEffect } from 'react';
import { FileText, Save, ArrowLeft, Menu, Users, Calendar, MapPin, FileType, User, AlertCircle } from 'lucide-react';
import { Sidebar } from '../../../../components/Sidebard';
import { Header } from '../../../../components/Header';
import { getDepartments } from '../../../../hooks/handleDepartments';
import { getLocalities } from '../../../../hooks/handleLocalities';
import { getTypeReports } from '../../../../hooks/handleTypeReports';
import { CreateReport } from '../../../../hooks/handleReports';
import { handleError, handleSuccess } from '../../../../hooks/toaster';
import { Toaster } from 'sonner';
import useTheme from '../../../../hooks/useTheme';
import { Sun, Moon } from 'lucide-react';
import { useAuth } from '../../../../hooks/useAuth';


export default function CreateReportPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebarCollapsed');
      return saved !== null ? JSON.parse(saved) : true;
    }
    return true;
  });
  const [isMobile, setIsMobile] = useState(false);
  const { theme, toggleTheme, isDark } = useTheme();
  const [departments, setDepartments] = useState([]);
  const [localities, setLocalities] = useState([]);
  const [typeReports, setTypeReports] = useState([]);
  const [formData, setFormData] = useState({
    department_id: 0,
    locality_id: 0,
    date: '',
    type_report_id: 0,
    status: '',
    title: '',
    content: '',
    description: ''
  });


  useEffect(() => {
    async function fetchDepartments() {
      const data = await getDepartments();
      setDepartments(data);
        // Cargar localidades al seleccionar un departamento
        if (data.length > 0) {
            const firstDepartmentId = data[0].id;
            const localitiesData = await getLocalities(firstDepartmentId);
            setLocalities(localitiesData);
            setFormData(prev => ({
              ...prev,
              department_id: firstDepartmentId,
              locality_id: localitiesData.length > 0 ? localitiesData[0].id : ''
            }));
        }
      console.log('Departamentos cargados:', data);
        const typeReportsData = await getTypeReports();
        setTypeReports(typeReportsData);
        console.log('Tipos de informes cargados:', typeReportsData);
    }
    fetchDepartments();
  }, [])



  // Filtrar localidades según departamento seleccionado
  const filteredLocalities = localities.filter(
    locality => locality.department_id == formData.department_id
  );

  // Auto-colapsar en pantallas pequeñas
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      }
    };
    
    // Ejecutar inmediatamente al cargar
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Guardar estado del sidebar en localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
    }
  }, [sidebarCollapsed]);

useEffect(() => {
  const now = new Date().toISOString(); 
  setFormData(prev => ({ ...prev, date: now }));
}, []);


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

  const handleSubmit =  async (e) => {
    e.preventDefault();
    console.log('Datos del formulario:', formData);
    const result = await CreateReport(formData);
    if (!result) {
      handleError('Error al crear el informe. Por favor, intente nuevamente.');
      console.log(result);
      
    return;
    }
    

    
    console.log('Informe creado:', result);
    handleSuccess('Informe creado exitosamente');
    setTimeout(()=> {
      window.location.href = '/reports/view/' + result.id;
    }, 2000)
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
      
      <style>
        {`
          /* Estilos para modo oscuro */
          ${isDark ? `
            .text-primary {
              color: #ffffff !important;
            }
            .text-muted {
              color: #d4d4d4 !important;
            }
            .text-secondary {
              color: #d4d4d4 !important;
            }
            .breadcrumb-item a {
              color: #d4d4d4 !important;
            }
            .breadcrumb-item.active {
              color: #ffffff !important;
            }
            .form-label {
              color: #ffffff !important;
            }
            .alert {
              color: #ffffff !important;
            }
            .alert-info {
              background-color: rgba(59, 130, 246, 0.1) !important;
              border-color: var(--primary-color) !important;
              color: #ffffff !important;
            }
          ` : ''}
        `}
      </style>
      
      <div className="d-flex">
        <Sidebar 
          isCollapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          isDark={true}
        />
        <div 
          className={`flex-grow-1 min-vh-100 ${isDark ? 'bg-dark text-light' : 'bg-light text-dark'}`}
          style={{ 
            marginLeft: isMobile ? '0' : (sidebarCollapsed ? '70px' : '250px'), 
            transition: 'margin-left 0.3s ease' 
          }}
        >
          <Header 
            sidebarCollapsed={sidebarCollapsed}
            setSidebarCollapsed={setSidebarCollapsed}
            isDark={isDark}
            toggleTheme={toggleTheme}
            isMobile={isMobile}
          />
          
          <div className={isDark? "container-fluid py-4 bg-black" : "container-fluid py-4 bg-light"}>

            {/* Título de la página */}
            <div className="row mb-4">
              <div className="col-12">
                <div className={isDark ? "p-4 rounded shadow-sm border-start border-4 border-primary bg-dark": "p-4 rounded shadow-sm border-start border-4 border-secondary"}>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="d-flex align-items-center">
                      <FileText size={28} className="me-2" style={{color: isDark ? '#ffffff' : '#0d6efd'}} />
                      <h1 className="h3 mb-0" style={{color: isDark ? '#ffffff' : '#0d6efd'}}>
                        Crear Nuevo Informe
                      </h1>
                    </div>
                    <button className={`btn ${isDark ? 'btn-outline-light' : 'btn-outline-secondary'} d-flex align-items-center`}>
                      <ArrowLeft size={18} className="me-1" />
                      Volver
                    </button>
                  </div>
                  <p className="mb-1" style={{color: isDark ? '#d4d4d4' : '#6c757d'}}>
                    Complete todos los campos para crear un nuevo informe.
                  </p>
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-0">
                      <li className="breadcrumb-item">
                        <a href="#" className="text-decoration-none" style={{color: isDark ? '#d4d4d4' : '#6c757d'}}>
                          Inicio
                        </a>
                      </li>
                      <li className="breadcrumb-item">
                        <a href="#" className="text-decoration-none" style={{color: isDark ? '#d4d4d4' : '#6c757d'}}>
                          Informes
                        </a>
                      </li>
                      <li className="breadcrumb-item active" aria-current="page" style={{color: isDark ? '#ffffff' : 'inherit'}}>
                        Crear Informe
                      </li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>

            {/* Formulario */}
            <div className="row">
              <div className="col-12">
                <div className="card border-0 shadow-sm">
                  <div className="card-header ">
                    <h5 className={isDark ? "mb-0 fw-bold d-flex align-items-center " : "mb-0 fw-bold d-flex align-items-center"} >

                      <AlertCircle size={20} className={isDark ? "me-2 text-primary" : "me-2"} />

                      Información del Informe
                    </h5>
                  </div>
                  <div className="card-body p-4">
                    <div onSubmit={handleSubmit}>
                      <div className="row g-4">
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
                            <label htmlFor="department_id" style={{color: isDark ? '' : 'inherit'}}>
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
                            <label htmlFor="locality_id" style={{color: isDark ? '' : 'inherit'}}>
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
                            <label htmlFor="date" style={{color: isDark ? '' : 'inherit'}}>
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
                            <label htmlFor="type_report_id" style={{color: isDark ? '' : 'inherit'}}>
                              <FileType size={16} className="me-1" />
                              Tipo de Informe *
                            </label>
                          </div>
                        </div>

                        {/* Tercera fila - Título */}
                        <div className="col-md-6">
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
                            <label htmlFor="title" style={{color: isDark ? '' : 'inherit'}}>
                              <FileText size={16} className="me-1" />
                              Título del Informe *
                            </label>
                          </div>
                        </div>
                        
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
                              <option value="">Seleccionar estado</option>
                              <option value="Pendiente">Pendiente</option>
                              <option value="Urgente">Urgente</option>
                              <option value="Completado">Completado</option>
                            </select>
                            <label htmlFor="status" style={{color: isDark ? '' : 'inherit'}}>
                              <FileType size={16} className="me-1" />
                              Estado *
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
                            <label htmlFor="content" style={{color: isDark ? '' : 'inherit'}}>
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
                            <label htmlFor="description" style={{color: isDark ? '#ffffff' : 'inherit'}}>
                              <FileText size={16} className="me-1" />
                              Descripción Adicional
                            </label>
                          </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="col-12">
                          <div className="d-flex justify-content-end gap-3 pt-3 border-top">
                            <button 
                              type="button" 
                              className={`btn ${isDark ? 'btn-outline-light' : 'btn-outline-secondary'}`}
                            >
                              <ArrowLeft size={18} className="me-1" />
                              Cancelar
                            </button>
                            <button 
                              type="submit" 
                              className={`btn ${isDark ? 'btn-light' : 'btn-dark'}`}
                              onClick={handleSubmit}
                            >
                              <Save size={18} className="me-1" />
                              Crear Informe
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Nota informativa */}
            <div className="row mt-4">
              <div className="col-12">
                <div className={`alert ${isDark ? 'alert-primary' : 'alert-info'} border-0 shadow-sm`}>
                  <div className="d-flex align-items-center">
                    <AlertCircle size={20} className="me-2" style={{color: isDark ? '#ffffff' : 'inherit'}} />
                    <div style={{color: isDark ? '#ffffff' : 'inherit'}}>
                      <strong>Información:</strong> Los campos marcados con (*) son obligatorios. 
                      Asegúrese de completar toda la información requerida antes de guardar el informe.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster 
        position="top-right"
        richColors
        closeButton
        duration={4000}
      />  
    </>
  );
}
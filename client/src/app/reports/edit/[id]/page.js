"use client"
import { useState, useEffect } from 'react';
import { FileText, Save, ArrowLeft, Menu, Users, Calendar, MapPin, FileType, User, AlertCircle, Edit, Import } from 'lucide-react';
import { Sidebar } from '../../../../../components/Sidebard';
import { Header } from '../../../../../components/Header';
import { getDepartments } from '../../../../../hooks/handleDepartments';
import { getLocalities } from '../../../../../hooks/handleLocalities';
import { getTypeReports } from '../../../../../hooks/handleTypeReports';
import { UpdateReport, getReportById } from '../../../../../hooks/handleReports';
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
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
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
    description: ''
  });

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
              description: reportData.description || ''
            });
            
            // Cargar localidades del departamento del informe
            if (reportData.department_id) {
              const localitiesData = await getLocalities(reportData.department_id);
              setLocalities(localitiesData);
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

  // Auto-colapsar en pantallas pequeñas
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 992) {
        setSidebarCollapsed(true);
      }
    };

    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      console.log('Datos del formulario a actualizar:', formData);
      const result = await UpdateReport(formData.id, formData);
      
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
      
      <div className="d-flex">
        <Sidebar 
          isCollapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        <div className={`flex-grow-1 `}>
          <Header 
            sidebarCollapsed={sidebarCollapsed}
            setSidebarCollapsed={setSidebarCollapsed}
            isDark={isDark}
            toggleTheme={toggleTheme}
          />
          
          <div className="container-fluid py-4 min-vh-100">
            {/* Title Card */}
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h1 className="h3 mb-1">Editar Informe #{formData.id}</h1>
                    <p className="text-muted mb-0">Modifica los campos necesarios para actualizar el informe</p>
                  </div>
                  <div className="d-flex align-items-center">
                    <i className="fas fa-edit fa-2x text-primary me-3"></i>
                    <button 
                      className="btn btn-outline-secondary d-flex align-items-center"
                      onClick={handleCancel}
                    >
                      <i className="fas fa-arrow-left me-1"></i>
                      Volver
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulario */}
            <div className="row">
              <div className="col-12">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-secondary border-bottom">
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
                              <option value="">Seleccionar estado</option>
                              <option value="Pendiente">Pendiente</option>
                              <option value="Urgente">Urgente</option>
                              <option value="Completado">Completado</option>
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

                        {/* Botones de acción */}
                        <div className="col-12">
                          <div className="d-flex justify-content-end gap-3 pt-3 border-top">
                            <button 
                              type="button" 
                              className="btn btn-outline-secondary"
                              onClick={handleCancel}
                            >
                              <ArrowLeft size={18} className="me-1" />
                              Cancelar
                            </button>
                            <button type="submit" className="btn btn-warning">
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
                <div className="alert alert-warning border-0 shadow-sm">
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
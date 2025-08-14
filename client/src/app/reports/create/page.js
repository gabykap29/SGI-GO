"use client"
import { useState, useEffect } from 'react';
import { FileText, Save, ArrowLeft, Menu, Users, Calendar, MapPin, FileType, User, AlertCircle } from 'lucide-react';
import { Sidebar } from '../../../../components/Sidebard';
import { getDepartments } from '../../../../hooks/handleDepartments';
import { getLocalities } from '../../../../hooks/handleLocalities';
import { getTypeReports } from '../../../../hooks/handleTypeReports';
import { CreateReport } from '../../../../hooks/handleReports';


export default function CrearInforme() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
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
      alert('Error al crear el informe. Por favor, intente nuevamente.');
      console.log(result);
      
    return;
    }
    

    
    console.log('Informe creado:', result);
    alert('Informe creado exitosamente');
  };



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
          
          <div className="container-fluid py-4 bg-light min-vh-100">
            {/* Título de la página */}
            <div className="row mb-4">
              <div className="col-12">
                <div className="p-4 rounded shadow-sm bg-white border-start border-4 border-dark">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="d-flex align-items-center">
                      <FileText size={28} className="me-2 text-dark" />
                      <h1 className="h3 mb-0 text-dark">Crear Nuevo Informe</h1>
                    </div>
                    <button className="btn btn-outline-secondary d-flex align-items-center">
                      <ArrowLeft size={18} className="me-1" />
                      Volver
                    </button>
                  </div>
                  <p className="text-muted mb-1">Complete todos los campos para crear un nuevo informe.</p>
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-0">
                      <li className="breadcrumb-item">
                        <a href="#" className="text-decoration-none">Inicio</a>
                      </li>
                      <li className="breadcrumb-item">
                        <a href="#" className="text-decoration-none">Informes</a>
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">
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
                  <div className="card-header bg-white border-bottom">
                    <h5 className="mb-0 fw-bold text-dark d-flex align-items-center">
                      <AlertCircle size={20} className="me-2 text-primary" />
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
                            <label htmlFor="title">
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
                            <label htmlFor="status">
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
                            <button type="button" className="btn btn-outline-secondary">
                              <ArrowLeft size={18} className="me-1" />
                              Cancelar
                            </button>
                            <button 
                              type="submit" 
                              className="btn btn-dark" 
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
                <div className="alert alert-info border-0 shadow-sm">
                  <div className="d-flex align-items-center">
                    <AlertCircle size={20} className="me-2" />
                    <div>
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
    </>
  );
}
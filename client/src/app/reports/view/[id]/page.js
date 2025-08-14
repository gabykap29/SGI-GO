"use client"
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FileText, ArrowLeft, Menu, Users, Calendar, MapPin, FileType, User, AlertCircle, Download, Eye, Image as ImageIcon, Upload, X, File, Plus } from 'lucide-react';
import { Sidebar } from '../../../../../components/Sidebard';
import { getReportById } from '../../../../../hooks/handleReports';
import { getFileUrl, getFileType, formatFileSize, uploadFile, validateFileType, validateFileSize, getAuthenticatedFileUrl, deleteFile } from '../../../../../hooks/handleFiles';
import { handleError, handleSuccess } from '../../../../../hooks/toaster';
import { Toaster } from 'sonner';
import useTheme from '../../../../../hooks/useTheme';
import { Sun, Moon } from 'lucide-react';
import dayjs from 'dayjs'

export default function VisualizarInforme() {
  const { id } = useParams();
  const router = useRouter();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [fileUrls, setFileUrls] = useState({});
  const { theme, toggleTheme, isDark } = useTheme();

  const getBadgeClass = (tipo) => {
    switch (tipo) {
      case 'Seguridad':
        return 'bg-danger text-white';
      case 'Infraestructura':
        return 'bg-dark text-white';
      case 'Eventos Climaticos':
        return 'bg-warning';
      case 'Hídricos':
        return 'bg-primary-subtle';
      case 'Económicos':
        return 'bg-secondary';
      case 'Ambientales':
        return 'bg-success';
      case 'Sociales':
        return 'bg-info';
      case 'Turismo':
        return 'bg-pink text-white';
      case 'Deportivos':
        return 'bg-indigo text-white';
      case 'OTROS':
        return 'bg-secondary';
      default:
        return 'bg-light';
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setSidebarCollapsed(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const data = await getReportById(id);
        setReport(data);
        
        // Cargar URLs de archivos de manera asíncrona
        if (data.files && data.files.length > 0) {
          const urls = {};
          for (const file of data.files) {
            let filename = file.filename;
            if (!filename && file.path) {
              const pathParts = file.path.replace(/\\/g, '/').split('/');
              filename = pathParts[pathParts.length - 1];
            }
            if (filename) {
              const url = await getAuthenticatedFileUrl(filename);
              if (url) {
                urls[filename] = url;
              }
            }
          }
          setFileUrls(urls);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchReport();
    }
  }, [id]);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = [];
    
    files.forEach(file => {
      if (!validateFileType(file)) {
        handleError(`El archivo ${file.name} no es de un tipo permitido`);
        return;
      }
      
      if (!validateFileSize(file)) {
        handleError(`El archivo ${file.name} es demasiado grande (máximo 10MB)`);
        return;
      }
      
      validFiles.push(file);
    });
    
    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadFiles = async () => {
    if (selectedFiles.length === 0) return;
    
    setUploadingFiles(true);
    
    try {
      for (const file of selectedFiles) {
        const response = await uploadFile(file, id);
        // Verificar si la respuesta es exitosa (200 o 201)
        if (response && (response.status === 200 || response.status === 201)) {
          // Actualizar después de 1.5 segundos
          setTimeout(async () => {
            try {
              const updatedReport = await getReportById(id);
              setReport(updatedReport);
              
              // Recargar URLs de archivos
              if (updatedReport.files && updatedReport.files.length > 0) {
                const urls = {};
                for (const file of updatedReport.files) {
                  let filename = file.filename;
                  if (!filename && file.path) {
                    const pathParts = file.path.replace(/\\/g, '/').split('/');
                    filename = pathParts[pathParts.length - 1];
                  }
                  if (filename) {
                    const url = await getAuthenticatedFileUrl(filename);
                    if (url) {
                      urls[filename] = url;
                    }
                  }
                }
                setFileUrls(urls);
              }
            } catch (error) {
              console.error('Error updating report after upload:', error);
            }
          }, 1500);
        }
      }
      
      // Limpiar archivos seleccionados
      setSelectedFiles([]);
      setShowFileUpload(false);
      
      handleSuccess('Archivos subidos exitosamente');
    } catch (error) {
      console.error('Error uploading files:', error);
      handleError('Error al subir archivos: ' + error.message);
    } finally {
      setUploadingFiles(false);
    }
  };

  const handleDeleteFile = async (fileId, fileName) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar el archivo "${fileName}"?`)) {
      return;
    }

    try {
      await deleteFile(fileId);
      
      // Recargar el reporte para actualizar la lista de archivos
      const updatedReport = await getReportById(id);
      setReport(updatedReport);
      
      // Recargar URLs de archivos
      if (updatedReport.files && updatedReport.files.length > 0) {
        const urls = {};
        for (const file of updatedReport.files) {
          let filename = file.filename;
          if (!filename && file.path) {
            const pathParts = file.path.replace(/\\/g, '/').split('/');
            filename = pathParts[pathParts.length - 1];
          }
          if (filename) {
            const url = await getAuthenticatedFileUrl(filename);
            if (url) {
              urls[filename] = url;
            }
          }
        }
        setFileUrls(urls);
      } else {
        setFileUrls({});
      }
      
      handleSuccess('Archivo eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting file:', error);
      handleError('Error al eliminar archivo: ' + error.message);
    }
  };

  const handleCancelUpload = () => {
    setSelectedFiles([]);
    setShowFileUpload(false);
  };

  if (loading) {
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
        
        <Sidebar collapsed={sidebarCollapsed} />
        <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <div className="container-fluid py-4">
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
              <div className="text-center">
                <div className="spinner-border text-primary mb-3" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="text-muted">Cargando informe...</p>
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

  if (!report) {
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
        
        <Sidebar collapsed={sidebarCollapsed} />
        <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <div className="container-fluid py-4">
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
              <div className="text-center">
                <AlertCircle size={48} className="text-danger mb-3" />
                <h5 className="text-danger mb-2">Informe no encontrado</h5>
                <p className="text-muted mb-3">El informe que buscas no existe o no tienes permisos para verlo.</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => router.push('/reports')}
                >
                  <ArrowLeft size={16} className="me-2" />
                  Volver a Informes
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
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
          .main-content {
            margin-left: 250px;
            transition: margin-left 0.3s ease-in-out;
          }
          .main-content.sidebar-collapsed {
            margin-left: 70px;
          }
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
        <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <div className="flex-grow-1 min-vh-100">
          {/* Header */}
          <nav className="navbar navbar-expand-lg">
            <div className="container-fluid">
              <div className="d-flex align-items-center">
                <button 
                  className="btn btn-secondary me-2"
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
                <button 
                  className="theme-toggle me-3"
                  onClick={toggleTheme}
                  title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                >
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <a className="nav-link" href="#">
                  <Users size={18} className="me-1" />
                  Usuario Admin
                </a>
              </div>
            </div>
          </nav>
          
        <div className="container-fluid py-4">
          {/* Título de la página */}
          <div className="row mb-4">
            <div className="col-12">
              <div className={isDark? "p-4 rounded shadow-sm border-start border-4 border-primary bg-dark": "p-4 rounded shadow-sm border-start border-4 border-primary"}>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className="d-flex align-items-center">
                    <Eye size={28} className="me-2 text-primary" />
                    <h1 className="h3 mb-0 text-primary">Visualizar Informe</h1>
                  </div>
                  <button 
                    className="btn btn-outline-primary"
                    onClick={() => router.push('/reports')}
                  >
                    <ArrowLeft size={16} className="me-2" />
                    Volver a Informes
                  </button>
                </div>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                      <a href="#" className="text-decoration-none">Inicio</a>
                    </li>
                    <li className="breadcrumb-item">
                      <a href="/reports" className="text-decoration-none">Informes</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      {report.title}
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-12">

              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="row g-4">
                    <div className="col-lg-12">
                      <div className="mb-4">
                        <h6 className="fw-bold mb-3" style={{color: isDark ? '#ffffff' : '#000000'}}>
                          <FileType size={16} className="me-2" />
                          Detalles del Informe
                        </h6>
                        <div className={isDark ? "p-4 rounded-3 border bg-dark": "p-4 rounded-3 border"} >
                          <div className="row g-3">
                            <div className="col-md-6">
                              <div className="d-flex align-items-center mb-4 p-3 rounded-2" style={{backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'}}>
                                <MapPin size={18} className="me-2 text-primary" />
                                <div>
                                  <small className="d-block" style={{color: isDark ? '#d4d4d4' : '#6c757d'}}>Ubicación</small>
                                  <strong>
                                    {report.department?.name} - {report.locality?.name}
                                  </strong>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="d-flex align-items-center mb-4 p-3 rounded-2" style={{backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'}}>
                                <Calendar size={18} className="me-2 text-primary" />
                                <div>
                                  <small className="d-block" style={{color: isDark ? '#d4d4d4' : '#6c757d'}}>Fecha de creación</small>
                                  <strong>
                                    {dayjs(report.created_at).format('DD/MM/YYYY HH:mm')}
                                  </strong>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="d-flex align-items-center mb-4 p-3 rounded-2" style={{backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'}}>
                                <FileText size={18} className="me-2 text-primary" />
                                <div>
                                  <small className="d-block" style={{color: isDark ? '#d4d4d4' : '#6c757d'}}>Tipo de informe</small>
                                  <span className={`badge ${getBadgeClass(report.type_report?.name)} px-2 py-1`}>
                                    {report.type_report?.name}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Título del Informe */}
                      {report.title && (
                        <div className="mb-4">
                          <h6 className="fw-bold mb-3" style={{color: isDark ? '#ffffff' : '#000000'}}>
                            <FileText size={16} className="me-2" />
                            Título del Informe
                          </h6>
                          <div className="p-4 rounded-3 border" style={{backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f8f9fa'}}>
                            <h5 className="mb-0 fw-bold" style={{color: isDark ? '#ffffff' : '#000000'}}>
                              {report.title}
                            </h5>
                          </div>
                        </div>
                      )}

                      {/* Reportado por */}
                      <div className="mb-4">
                        <h6 className="fw-bold mb-3" style={{color: isDark ? '#ffffff' : '#000000'}}>
                          <User size={16} className="me-2" />
                          Reportado por
                        </h6>
                        <div className="p-4 rounded-3 border" style={{backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f8f9fa'}}>
                          <div className="d-flex align-items-center">
                            <User size={24} className="me-3 text-primary" />
                            <div>
                              <h6 className="mb-0 fw-bold" style={{color: isDark ? '#ffffff' : '#000000'}}>
                                {report.user?.name || 'Usuario'}
                              </h6>
                              <small style={{color: isDark ? '#a3a3a3' : '#6c757d'}}>
                                {report.user?.email || 'Sin email'}
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Contenido del Informe */}
                      {report.content && (
                        <div className="mb-4">
                          <h6 className="fw-bold mb-3" style={{color: isDark ? '#ffffff' : '#000000'}}>
                            <FileText size={16} className="me-2" />
                            Contenido del Informe
                          </h6>
                          <div className="p-4 rounded-3 border" style={{backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f8f9fa'}}>
                            <div className="mb-0" style={{ whiteSpace: 'pre-wrap', color: isDark ? '#ffffff' : '#000000' }}>
                              {report.content}
                            </div>
                          </div>
                        </div>
                      )}

                      {report.description && (
                        <div className="mb-4">
                          <h6 className="fw-bold mb-3" style={{color: isDark ? '#ffffff' : '#000000'}}>
                            <FileText size={16} className="me-2" />
                            Descripción
                          </h6>
                          <div className="p-4 rounded-3 border" style={{backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f8f9fa'}}>
                            <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                              {report.description}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Archivos e imágenes */}
                      <div className="mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h6 className="fw-bold mb-0" style={{color: isDark ? '#ffffff' : '#000000'}}>
                            <ImageIcon size={16} className="me-2" />
                            Archivos Adjuntos ({report.files ? report.files.length : 0})
                          </h6>
                          <button 
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => setShowFileUpload(!showFileUpload)}
                          >
                            <Plus size={16} className="me-1" />
                            Agregar Archivos
                          </button>
                        </div>

                        {/* Sección de carga de archivos */}
                        {showFileUpload && (
                          <div className="card border-0 shadow-sm mb-3">
                            <div className="card-header border-0">
                              <h6 className="mb-0" style={{color: isDark ? '#ffffff' : '#000000'}}>
                                <Upload size={16} className="me-2" />
                                Subir Nuevos Archivos
                              </h6>
                            </div>
                            <div className="card-body">
                              <div className="mb-3">
                                <input
                                  type="file"
                                  className="form-control"
                                  multiple
                                  onChange={handleFileSelect}
                                  accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt"
                                />
                                <small className="mt-1 d-block" style={{color: isDark ? '#a3a3a3' : '#6c757d'}}>
                                  Formatos permitidos: JPG, PNG, GIF, PDF, DOC, DOCX, TXT (máximo 10MB por archivo)
                                </small>
                              </div>

                              {selectedFiles.length > 0 && (
                                <div className="mb-3">
                                  <h6 className="small fw-bold mb-2" style={{color: isDark ? '#ffffff' : '#000000'}}>Archivos seleccionados:</h6>
                                  <div className="list-group list-group-flush">
                                    {selectedFiles.map((file, index) => (
                                      <div key={index} className="list-group-item d-flex justify-content-between align-items-center px-0">
                                        <div className="d-flex align-items-center">
                                          <File size={16} className="me-2 text-muted" />
                                          <div>
                                            <div className="fw-medium">{file.name}</div>
                                            <small style={{color: isDark ? '#a3a3a3' : '#6c757d'}}>{formatFileSize(file.size)}</small>
                                          </div>
                                        </div>
                                        <button
                                          type="button"
                                          className="btn btn-sm btn-outline-danger"
                                          onClick={() => removeFile(index)}
                                          disabled={uploadingFiles}
                                        >
                                          <X size={14} />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <div className="d-flex gap-2">
                                <button 
                                  type="button" 
                                  className="btn btn-secondary btn-sm"
                                  onClick={handleCancelUpload}
                                  disabled={uploadingFiles}
                                >
                                  Cancelar
                                </button>
                                <button 
                                  type="button" 
                                  className="btn btn-primary btn-sm"
                                  onClick={handleUploadFiles}
                                  disabled={uploadingFiles || selectedFiles.length === 0}
                                >
                                  {uploadingFiles ? (
                                    <>
                                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                      Subiendo...
                                    </>
                                  ) : (
                                    <>
                                      <Upload size={14} className="me-1" />
                                      Subir Archivos
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Lista de archivos existentes */}
                        {report.files && report.files.length > 0 && (
                          <div className="row g-4">
                            {report.files.map((file, index) => {
                              if (!file) {
                                return null;
                              }
                              
                              // Para archivos existentes sin filename, extraer del path
                              let filename = file.filename;
                              if (!filename && file.path) {
                                // Extraer solo el nombre del archivo, sin la carpeta uploads/
                                const pathParts = file.path.replace(/\\/g, '/').split('/');
                                filename = pathParts[pathParts.length - 1];
                              }
                              if (!filename) {
                                return null;
                              }
                              
                              const fileUrl = fileUrls[filename];
                              const fileType = getFileType(file.name);
                              const isImage = fileType === 'image';
                              
                              return (
                                <div key={index} className="col-md-4 col-lg-3">
                                  <div className="card border-0 shadow-sm h-100" style={{transition: 'transform 0.3s ease, box-shadow 0.3s ease'}} onMouseEnter={(e) => {e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';}} onMouseLeave={(e) => {e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';}}>
                                    {isImage ? (
                                      <>
                                        <div className="position-relative overflow-hidden" style={{ borderRadius: '0.375rem 0.375rem 0 0' }}>
                                          {fileUrl ? (
                                            <img 
                                              src={fileUrl} 
                                              alt={file.name || `Imagen ${index + 1}`}
                                              className="card-img-top image-thumbnail"
                                              style={{ 
                                                height: '200px', 
                                                objectFit: 'cover', 
                                                cursor: 'pointer',
                                                transition: 'transform 0.3s ease, filter 0.3s ease'
                                              }}
                                              onClick={() => setSelectedImage(fileUrl)}
                                            onMouseEnter={(e) => {
                                              e.target.style.transform = 'scale(1.05)';
                                              e.target.style.filter = 'brightness(1.1)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.transform = 'scale(1)';
                                                e.target.style.filter = 'brightness(1)';
                                              }}
                                            />
                                          ) : (
                                            <div 
                                              className="d-flex align-items-center justify-content-center"
                                              style={{ 
                                                height: '200px', 
                                                backgroundColor: '#f8f9fa',
                                                color: '#6c757d'
                                              }}
                                            >
                                              <div className="text-center">
                                                <ImageIcon size={48} className="mb-2" />
                                                <div>Cargando imagen...</div>
                                              </div>
                                            </div>
                                          )}
                                          {/* Overlay con botones */}
                                          <div 
                                            className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                                            style={{ 
                                              background: 'rgba(0,0,0,0.4)', 
                                              opacity: 0,
                                              transition: 'opacity 0.3s ease',
                                              cursor: 'pointer'
                                            }}
                                            onClick={() => fileUrl && setSelectedImage(fileUrl)}
                                            onMouseEnter={(e) => e.target.style.opacity = 1}
                                            onMouseLeave={(e) => e.target.style.opacity = 0}
                                          >
                                            <button 
                                              className="btn btn-light rounded-circle me-2"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedImage(fileUrl);
                                              }}
                                              title="Ver imagen completa"
                                            >
                                              <Eye size={16} />
                                            </button>
                                            <a 
                                              href={fileUrl}
                                              download={file.file_name}
                                              className="btn btn-light rounded-circle me-2"
                                              onClick={(e) => e.stopPropagation()}
                                              title="Descargar imagen"
                                            >
                                              <Download size={16} />
                                            </a>
                                            <button 
                                              className="btn btn-danger rounded-circle"
                                              onClick={(e) => {
                                                 e.stopPropagation();
                                                 handleDeleteFile(file.id, file.name);
                                               }}
                                              title="Eliminar archivo"
                                            >
                                              <X size={16} />
                                            </button>
                                          </div>
                                        </div>
                                        <div className="card-body p-3">
                                          <small className="d-block text-truncate" style={{color: isDark ? '#d4d4d4' : '#6c757d'}} title={file.file_name}>
                                            {file.file_name || `Imagen ${index + 1}`}
                                          </small>
                                          {file.file_size && (
                                            <small style={{color: isDark ? '#a3a3a3' : '#6c757d'}}>
                                              {formatFileSize(file.file_size)}
                                            </small>
                                          )}
                                        </div>
                                      </>
                                    ) : (
                                      <div className="card-body text-center d-flex flex-column justify-content-center p-4">
                                        <Download size={32} className="text-muted mb-2" />
                                        <small className="d-block text-truncate mb-2" style={{color: isDark ? '#d4d4d4' : '#6c757d'}} title={file.file_name}>
                                          {file.file_name || `Archivo ${index + 1}`}
                                        </small>
                                        {file.file_size && (
                                          <small className="mb-2" style={{color: isDark ? '#a3a3a3' : '#6c757d'}}>
                                            {formatFileSize(file.file_size)}
                                          </small>
                                        )}
                                        <div className="d-flex gap-2">
                                          <a 
                                            href={fileUrl} 
                                            download={file.file_name}
                                            className="btn btn-sm btn-outline-primary"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            <Download size={14} className="me-1" />
                                            Descargar
                                          </a>
                                          <button 
                                             className="btn btn-sm btn-outline-danger"
                                             onClick={() => handleDeleteFile(file.id, file.name)}
                                             title="Eliminar archivo"
                                           >
                                            <X size={14} />
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Personas involucradas */}
                      {report.persons && report.persons.length > 0 && (
                        <div className="mb-4">
                          <h6 className="fw-bold mb-3" style={{color: isDark ? '#ffffff' : '#000000'}}>
                            <Users size={16} className="me-2" />
                            Personas Involucradas ({report.persons.length})
                          </h6>
                          <div className="row g-3">
                            {report.persons.map((person, index) => (
                              <div key={index} className="col-md-6 col-lg-4">
                                <div className="p-3 rounded-3 border d-flex align-items-center shadow-sm" style={{backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff', transition: 'transform 0.2s ease, box-shadow 0.2s ease'}} onMouseEnter={(e) => {e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';}} onMouseLeave={(e) => {e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';}}>
                                  <User size={16} className="me-2 text-primary" />
                                  <div>
                                    <div className="fw-semibold">{person.name}</div>
                                    {person.email && (
                                      <small style={{color: isDark ? '#a3a3a3' : '#6c757d'}}>{person.email}</small>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

        {/* Modal para ver imagen ampliada */}
        {selectedImage && (
          <div 
            className="modal fade show d-block" 
            style={{ backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 1055 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedImage(null);
              }
            }}
          >
            <div className="modal-dialog modal-xl modal-dialog-centered">
              <div className="modal-content bg-transparent border-0">
                <div className="modal-body p-0 text-center position-relative">
                  {/* Botón de cerrar */}
                  <button 
                    className="btn btn-light position-absolute top-0 end-0 m-3"
                    style={{ zIndex: 1060, borderRadius: '50%', width: '40px', height: '40px' }}
                    onClick={() => setSelectedImage(null)}
                    title="Cerrar"
                  >
                    <X size={20} />
                  </button>
                  
                  {/* Imagen principal */}
                  <img 
                    src={selectedImage} 
                    alt="Imagen ampliada"
                    className="img-fluid rounded shadow-lg"
                    style={{ 
                      maxHeight: '90vh', 
                      maxWidth: '90vw',
                      objectFit: 'contain',
                      cursor: 'zoom-in'
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  
                  {/* Información de la imagen */}
                  <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3">
                    <div className="bg-dark bg-opacity-75 text-white px-3 py-2 rounded">
                      <small>Haz clic fuera de la imagen para cerrar</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
    </>
  );
}
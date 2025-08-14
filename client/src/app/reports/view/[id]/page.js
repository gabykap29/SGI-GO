"use client"
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FileText, ArrowLeft, Menu, Users, Calendar, MapPin, FileType, User, AlertCircle, Download, Eye, Image as ImageIcon, Upload, X, File, Plus } from 'lucide-react';
import { Sidebar } from '../../../../../components/Sidebard';
import { getReportById } from '../../../../../hooks/handleReports';
import { getFileUrl, getFileType, formatFileSize, uploadFile, validateFileType, validateFileSize, getAuthenticatedFileUrl } from '../../../../../hooks/handleFiles';

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
        alert(`El archivo ${file.name} no es de un tipo permitido`);
        return;
      }
      
      if (!validateFileSize(file)) {
        alert(`El archivo ${file.name} es demasiado grande (máximo 10MB)`);
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
        await uploadFile(file, id);
      }
      
      // Recargar el reporte para mostrar los nuevos archivos
      const updatedReport = await getReportById(id);
      setReport(updatedReport);
      
      // Limpiar archivos seleccionados
      setSelectedFiles([]);
      setShowFileUpload(false);
      
      alert('Archivos subidos exitosamente');
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Error al subir archivos: ' + error.message);
    } finally {
      setUploadingFiles(false);
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
        <div className="flex-grow-1 bg-light min-vh-100">
        <div className="container-fluid py-4">
          <div className="row">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center">
                  <button 
                    className="btn btn-link text-decoration-none p-0 me-3"
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    title={sidebarCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
                  >
                    <Menu size={20} className="text-primary" />
                  </button>
                  <button 
                    className="btn btn-link text-decoration-none p-0 me-3"
                    onClick={() => router.push('/reports')}
                  >
                    <ArrowLeft size={20} className="text-primary" />
                  </button>
                  <div>
                    <h4 className="mb-1 fw-bold text-dark">
                      <FileText size={24} className="me-2 text-primary" />
                      {report.title}
                    </h4>
                    <p className="text-muted mb-0 small">
                      Informe #{report.id} • {report.type_report?.name}
                    </p>
                  </div>
                </div>
                <button 
                  className="btn btn-outline-secondary d-md-none"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                >
                  <Menu size={20} />
                </button>
              </div>

              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="row">
                    <div className="col-md-8">
                      <div className="mb-4">
                        <h6 className="fw-bold text-dark mb-3">
                          <FileType size={16} className="me-2" />
                          Detalles del Informe
                        </h6>
                        <div className="bg-light p-3 rounded">
                          <div className="row g-3">
                            <div className="col-md-6">
                              <div className="d-flex align-items-center mb-3">
                                <User size={18} className="me-2 text-primary" />
                                <div>
                                  <small className="text-muted d-block">Reportado por</small>
                                  <strong>{report.user?.name || 'Usuario'}</strong>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="d-flex align-items-center mb-3">
                                <MapPin size={18} className="me-2 text-primary" />
                                <div>
                                  <small className="text-muted d-block">Ubicación</small>
                                  <strong>
                                    {report.department?.name} - {report.locality?.name}
                                  </strong>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="d-flex align-items-center mb-3">
                                <Calendar size={18} className="me-2 text-primary" />
                                <div>
                                  <small className="text-muted d-block">Fecha de creación</small>
                                  <strong>
                                    {new Date(report.created_at).toLocaleDateString('es-ES', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </strong>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="d-flex align-items-center mb-3">
                                <FileText size={18} className="me-2 text-primary" />
                                <div>
                                  <small className="text-muted d-block">Tipo de informe</small>
                                  <strong>{report.type_report?.name}</strong>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {report.description && (
                        <div className="mb-4">
                          <h6 className="fw-bold text-dark mb-3">
                            <FileText size={16} className="me-2" />
                            Descripción
                          </h6>
                          <div className="bg-light p-3 rounded">
                            <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                              {report.description}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Archivos e imágenes */}
                      <div className="mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h6 className="fw-bold text-dark mb-0">
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
                            <div className="card-header bg-light border-0">
                              <h6 className="mb-0">
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
                                <small className="text-muted mt-1 d-block">
                                  Formatos permitidos: JPG, PNG, GIF, PDF, DOC, DOCX, TXT (máximo 10MB por archivo)
                                </small>
                              </div>

                              {selectedFiles.length > 0 && (
                                <div className="mb-3">
                                  <h6 className="small fw-bold mb-2">Archivos seleccionados:</h6>
                                  <div className="list-group list-group-flush">
                                    {selectedFiles.map((file, index) => (
                                      <div key={index} className="list-group-item d-flex justify-content-between align-items-center px-0">
                                        <div className="d-flex align-items-center">
                                          <File size={16} className="me-2 text-muted" />
                                          <div>
                                            <div className="fw-medium">{file.name}</div>
                                            <small className="text-muted">{formatFileSize(file.size)}</small>
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
                          <div className="row g-3">
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
                                  <div className="card border-0 shadow-sm h-100">
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
                                              className="btn btn-light rounded-circle"
                                              onClick={(e) => e.stopPropagation()}
                                              title="Descargar imagen"
                                            >
                                              <Download size={16} />
                                            </a>
                                          </div>
                                        </div>
                                        <div className="card-body p-2">
                                          <small className="text-muted d-block text-truncate" title={file.file_name}>
                                            {file.file_name || `Imagen ${index + 1}`}
                                          </small>
                                          {file.file_size && (
                                            <small className="text-muted">
                                              {formatFileSize(file.file_size)}
                                            </small>
                                          )}
                                        </div>
                                      </>
                                    ) : (
                                      <div className="card-body text-center d-flex flex-column justify-content-center">
                                        <Download size={32} className="text-muted mb-2" />
                                        <small className="text-muted d-block text-truncate mb-2" title={file.file_name}>
                                          {file.file_name || `Archivo ${index + 1}`}
                                        </small>
                                        {file.file_size && (
                                          <small className="text-muted mb-2">
                                            {formatFileSize(file.file_size)}
                                          </small>
                                        )}
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
                          <h6 className="fw-bold text-dark mb-3">
                            <Users size={16} className="me-2" />
                            Personas Involucradas ({report.persons.length})
                          </h6>
                          <div className="row g-2">
                            {report.persons.map((person, index) => (
                              <div key={index} className="col-md-6 col-lg-4">
                                <div className="bg-light p-3 rounded d-flex align-items-center">
                                  <User size={16} className="me-2 text-primary" />
                                  <div>
                                    <div className="fw-semibold">{person.name}</div>
                                    {person.email && (
                                      <small className="text-muted">{person.email}</small>
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
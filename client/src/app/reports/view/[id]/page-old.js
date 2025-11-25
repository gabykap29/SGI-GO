"use client"
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FileText, ArrowLeft, Users, Calendar, MapPin, User, AlertCircle, Download, Eye, Image as ImageIcon, Upload, X, File, Plus, Edit, CheckCircle, Trash2, FileSpreadsheet, FileImage, Archive, Music, Video, FileCode, Info } from 'lucide-react';
import { Sidebar } from '../../../../../components/Sidebard';
import { Header } from '../../../../../components/Header';
import { getReportById, UpdateReport, UpdateReportStatus, addPersonToReport, removePersonFromReport } from '../../../../../hooks/handleReports';
import { AddPersonModal } from '../../../../../components/AddPersonModal';
import { getFileUrl, getFileType, formatFileSize, uploadFile, validateFileType, validateFileSize, getAuthenticatedFileUrl, deleteFile } from '../../../../../hooks/handleFiles';
import { handleError, handleSuccess } from '../../../../../hooks/toaster';
import { Toaster } from 'sonner';
import useTheme from '../../../../../hooks/useTheme';
import { Sun, Moon } from 'lucide-react';
import dayjs from 'dayjs';
import { useAuth } from '../../../../../hooks/useAuth';
import "./style.css"
// Función para obtener el icono apropiado según el tipo de archivo
const getFileIcon = (mimeType, size = 48) => {
    if (!mimeType) return <File size={size} className="text-muted" />;

    const type = mimeType.toLowerCase();

    if (type.includes('pdf') || type.includes('text')) {
        return <FileText size={size} className="text-danger" />;
    }
    if (type.includes('spreadsheet') || type.includes('excel') || type.includes('csv')) {
        return <FileSpreadsheet size={size} className="text-success" />;
    }
    if (type.includes('word') || type.includes('document')) {
        return <FileText size={size} className="text-primary" />;
    }
    if (type.includes('zip') || type.includes('rar') || type.includes('archive')) {
        return <Archive size={size} className="text-warning" />;
    }
    if (type.includes('audio') || type.includes('music')) {
        return <Music size={size} className="text-info" />;
    }
    if (type.includes('video')) {
        return <Video size={size} className="text-purple" />;
    }
    if (type.includes('code') || type.includes('javascript') || type.includes('html') || type.includes('css')) {
        return <FileCode size={size} className="text-dark" />;
    }

    return <File size={size} className="text-muted" />;
};

export default function VisualizarInforme() {
    const { isAuthenticated, isLoading } = useAuth();
    const { id } = useParams();
    const router = useRouter();
    const { theme, toggleTheme, isDark } = useTheme();

    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('sidebarCollapsed');
            return saved !== null ? JSON.parse(saved) : true;
        }
        return true;
    });
    const [isMobile, setIsMobile] = useState(false);
    const [reportPersons, setReportPersons] = useState([]);
    const [showPersonModal, setShowPersonModal] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadingFiles, setUploadingFiles] = useState(false);
    const [showFileUpload, setShowFileUpload] = useState(false);
    const [fileUrls, setFileUrls] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editData, setEditData] = useState({ status: '', description: '' });
    const [updating, setUpdating] = useState(false);
    const [showPersonDetailsModal, setShowPersonDetailsModal] = useState(false);
    const [selectedPersonDetails, setSelectedPersonDetails] = useState(null);

    // Redirección por autenticación
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/auth/login');
        }
    }, [isAuthenticated, isLoading, router]);

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

    // Cargar datos del informe
    useEffect(() => {
        const fetchReport = async () => {
            try {
                setLoading(true);
                const data = await getReportById(id);
                setReport(data);

                if (data.persons && Array.isArray(data.persons)) {
                    setReportPersons(data.persons);
                }

                // Cargar URLs de archivos
                if (data.files && data.files.length > 0) {
                    const urls = {};
                    for (const file of data.files) {

                        // El filename es el UUID que se usa para acceder al archivo
                        let filename = file.filename;
                        if (!filename && file.path) {
                            // Extraer el filename del path si no está disponible directamente
                            const pathParts = file.path.split(/[\/\\]/);
                            filename = pathParts[pathParts.length - 1];
                        }
                        console.log('Filename UUID extraído:', filename);
                        if (filename) {
                            // Usar getAuthenticatedFileUrl para manejar la autenticación correctamente
                            const url = await getAuthenticatedFileUrl(filename);
                            console.log('URL generada para', filename, ':', url);
                            if (url) {
                                urls[file.id] = url;
                                console.log('URL almacenada para file.id:', file.id);
                            } else {
                                console.error('Error: No se pudo generar URL para:', filename);
                            }
                        } else {
                            console.error('Error: No se encontró filename para el archivo:', file);
                        }
                    }
                    setFileUrls(urls);
                }
            } catch (err) {
                handleError('Error al cargar el informe');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchReport();
        }
    }, [id]);



    // Manejo de archivos
    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files);

        files.forEach(file => {
            if (!validateFileType(file)) {
                handleError(`El archivo ${file.name} no es de un tipo permitido`);
                return;
            }

            if (!validateFileSize(file)) {
                handleError(`El archivo ${file.name} es demasiado grande (máximo 10MB)`);
                return;
            }
        });

        setSelectedFiles(prev => [...prev, ...files]);
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleUploadFiles = async () => {
        if (selectedFiles.length === 0) {
            handleError('Debe adjuntar un archivo!');
            return;
        }

        setUploadingFiles(true);
        try {
            for (const file of selectedFiles) {
                const response = await uploadFile(file, id);

                if (response && (response.status === 200 || response.status === 201)) {
                    handleSuccess(`Archivo ${file.name} subido correctamente`);
                    setTimeout(async () => {
                        try {
                            const updatedReport = await getReportById(id);
                            setReport(updatedReport);

                            if (updatedReport.files && updatedReport.files.length > 0) {
                                const urls = {};
                                for (const file of updatedReport.files) {
                                    // El filename es el UUID que se usa para acceder al archivo
                                    let filename = file.filename;
                                    if (!filename && file.path) {
                                        // Extraer el filename del path si no está disponible directamente
                                        const pathParts = file.path.split(/[\/\\]/);
                                        filename = pathParts[pathParts.length - 1];
                                    }
                                    if (filename) {
                                        // Usar getAuthenticatedFileUrl para manejar la autenticación correctamente
                                        const url = await getAuthenticatedFileUrl(filename);
                                        if (url) {
                                            urls[file.id] = url;
                                        }
                                    }
                                }
                                setFileUrls(urls);
                            }
                        } catch (error) {
                            console.error('Error al actualizar el informe:', error);
                        }
                    }, 1500);
                }
            }

            setSelectedFiles([]);
            setShowFileUpload(false);
            handleSuccess('Todos los archivos se han subido correctamente');
        } catch (error) {
            handleError('Error al subir archivos');
            console.error('Error uploading files:', error);
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
            handleSuccess(`Archivo "${fileName}" eliminado correctamente`);

            const updatedReport = await getReportById(id);
            setReport(updatedReport);

            if (updatedReport.files && updatedReport.files.length > 0) {
                const urls = {};
                for (const file of updatedReport.files) {
                    // El filename es el UUID que se usa para acceder al archivo
                    let filename = file.filename;
                    if (!filename && file.path) {
                        // Extraer el filename del path si no está disponible directamente
                        const pathParts = file.path.split(/[\/\\]/);
                        filename = pathParts[pathParts.length - 1];
                    }
                    if (filename) {
                        // Usar getAuthenticatedFileUrl para manejar la autenticación correctamente
                        const url = await getAuthenticatedFileUrl(filename);
                        if (url) {
                            urls[file.id] = url;
                        }
                    }
                }
                setFileUrls(urls);
            } else {
                setFileUrls({});
            }
        } catch (error) {
            handleError('Error al eliminar el archivo');
            console.error('Error deleting file:', error);
        }
    };

    // Manejo de personas
    const handlePersonAdded = async (person) => {
        if (reportPersons.some(p => p.id === person.id)) {
            handleError('Esta persona ya está vinculada al informe');
            return;
        }
        try {
            await addPersonToReport(id, person.id);
            setReportPersons(prev => [...prev, person]);
            handleSuccess(`${person.name} vinculado al informe`);
        } catch (error) {
            handleError('Error al vincular la persona');
            console.error('Error adding person:', error);
        }
    };

    const handleRemovePerson = async (personId) => {
        try {
            await removePersonFromReport(id, personId);
            setReportPersons(prev => prev.filter(p => p.id !== personId));
            handleSuccess('Persona desvinculada del informe');
        } catch (error) {
            handleError('Error al desvincular la persona');
            console.error('Error removing person:', error);
        }
    };

    // Manejo de edición
    const handleEditClick = () => {
        setEditData({
            status: report.status || '',
            description: report.description || ''
        });
        setShowEditModal(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);

        try {
            // Si solo se está cambiando el estado, usar la función específica
            if (editData.status !== report.status && editData.description === report.description) {
                await UpdateReportStatus(id, editData.status);
            } else {
                // Si se cambian otros campos, usar la función general
                const updateData = {
                    ...report,
                    status: editData.status,
                    description: editData.description
                };
                await UpdateReport(id, updateData);
            }

            setReport(prev => ({
                ...prev,
                status: editData.status,
                description: editData.description
            }));

            setShowEditModal(false);
            handleSuccess('Informe actualizado correctamente');
        } catch (error) {
            handleError('Error al actualizar el informe: ' + (error.message || error));
        } finally {
            setUpdating(false);
        }
    };

    const handleEditCancel = () => {
        setShowEditModal(false);
        setEditData({ status: '', description: '' });
    };

    // Estados de carga
    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
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
                    <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
                    <div className="flex-grow-1 min-vh-100">
                        <Header
                            sidebarCollapsed={sidebarCollapsed}
                            setSidebarCollapsed={setSidebarCollapsed}
                            isDark={isDark}
                            toggleTheme={toggleTheme}
                            isMobile={isMobile}
                        />
                        <div className="container-fluid py-4">
                            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Cargando informe...</span>
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

                <div className="d-flex">
                    <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
                    <div className="flex-grow-1 min-vh-100">
                        <Header
                            sidebarCollapsed={sidebarCollapsed}
                            setSidebarCollapsed={setSidebarCollapsed}
                            isDark={isDark}
                            toggleTheme={toggleTheme}
                        />
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
                <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
                <div
                    className={`flex-grow-1 min-vh-100 ${isDark ? 'bg-dark text-light' : 'bg-light text-dark'}`}
                    style={{
                        marginLeft: isMobile ? '0' : (sidebarCollapsed ? '70px' : '250px'),
                        transition: 'margin-left 0.3s ease',
                        backgroundColor: isDark ? '#1a1a1a' : '#f8f9fa'
                    }}
                >
                    <Header
                        sidebarCollapsed={sidebarCollapsed}
                        setSidebarCollapsed={setSidebarCollapsed}
                        isDark={isDark}
                        toggleTheme={toggleTheme}
                    />

                    <div className="container-fluid py-4">
                        {/* Header del informe */}
                        <div className="row mb-4">
                            <div className="col-12">
                                <div className={`p-4 rounded-3 shadow-sm border-start border-4 border-primary ${isDark ? 'bg-dark text-white' : 'bg-white'
                                    }`}>
                                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                                        <div className="d-flex align-items-center">
                                            <Eye size={28} className="me-3 text-primary" />
                                            <div>
                                                <h4 className="mb-1 fw-bold">Visualizar Informe</h4>
                                                <button
                                                    className="btn btn-link p-0 text-decoration-none"
                                                    onClick={() => router.push('/reports')}
                                                >
                                                    <ArrowLeft size={16} className="me-1" />
                                                    Volver a Informes
                                                </button>
                                            </div>
                                        </div>
                                        <button
                                            className="btn btn-outline-primary"
                                            onClick={handleEditClick}
                                        >
                                            <Edit size={16} className="me-2" />
                                            <span className="d-none d-sm-inline">Editar</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row g-4">
                            {/* Columna principal */}
                            <div className="col-12 col-lg-8">
                                {/* Información básica del informe */}
                                <div className={`card shadow-sm mb-4 ${isDark ? 'bg-dark text-white border-secondary' : 'bg-white'
                                    }`}>
                                    <div className="card-header border-0 pb-0">
                                        <h5 className="mb-0 fw-bold">
                                            <FileText size={20} className="me-2 text-primary" />
                                            {report.title}
                                        </h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="row g-3">
                                            <div className="col-12 col-sm-6 col-md-6">
                                                <div className={`p-3 rounded-2 ${isDark ? 'bg-secondary bg-opacity-25' : 'bg-light'
                                                    }`}>
                                                    <div className="d-flex align-items-center mb-2">
                                                        <MapPin size={16} className="me-2 text-primary" />
                                                        <small className="text-muted fw-semibold">UBICACIÓN</small>
                                                    </div>
                                                    <p className="mb-0 text-break">{report.department?.name} - {report.locality?.name}</p>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6 col-md-6">
                                                <div className={`p-3 rounded-2 ${isDark ? 'bg-secondary bg-opacity-25' : 'bg-light'
                                                    }`}>
                                                    <div className="d-flex align-items-center mb-2">
                                                        <Calendar size={16} className="me-2 text-primary" />
                                                        <small className="text-muted fw-semibold">FECHA</small>
                                                    </div>
                                                    <p className="mb-0">{dayjs(report.created_at).format('DD/MM/YYYY HH:mm')}</p>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6 col-md-6">
                                                <div className={`p-3 rounded-2 ${isDark ? 'bg-secondary bg-opacity-25' : 'bg-light'
                                                    }`}>
                                                    <div className="d-flex align-items-center mb-2">
                                                        <FileText size={16} className="me-2 text-primary" />
                                                        <small className="text-muted fw-semibold">TIPO</small>
                                                    </div>
                                                    <span>
                                                        {report.type_report?.name}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6 col-md-6">
                                                <div className={`p-3 rounded-2 ${isDark ? 'bg-secondary bg-opacity-25' : 'bg-light'
                                                    }`}>
                                                    <div className="d-flex align-items-center mb-2">
                                                        <CheckCircle size={16} className="me-2 text-primary" />
                                                        <small className="text-muted fw-semibold">ESTADO</small>
                                                    </div>
                                                    <span className={`${report.status === 'Urgente' ? 'badge badge-danger' : report.status === 'complete' ? 'badge badge-success' : 'badge badge-warning'
                                                        }`}>
                                                        {(report.status === 'complete' ? 'Completado' : report.status === "pending" ? "Pendiente" : report.status)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Contenido del informe */}
                                {report.content && (
                                    <div className={`card shadow-sm mb-4 ${isDark ? 'bg-dark text-white border-secondary' : 'bg-white'
                                        }`}>
                                        <div className="card-header border-0 pb-0">
                                            <h6 className="mb-0 fw-bold">
                                                <FileText size={16} className="me-2 text-primary" />
                                                Contenido del Informe
                                            </h6>
                                        </div>
                                        <div className="card-body">
                                            <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                                                {report.content}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Descripción adicional */}
                                {report.description && (
                                    <div className={`card shadow-sm mb-4 ${isDark ? 'bg-dark text-white border-secondary' : 'bg-white'
                                        }`}>
                                        <div className="card-header border-0 pb-0">
                                            <h6 className="mb-0 fw-bold">
                                                <FileText size={16} className="me-2 text-primary" />
                                                Observaciones
                                            </h6>
                                        </div>
                                        <div className="card-body">
                                            <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                                                {report.description}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Archivos e imágenes */}
                                <div className={`card shadow-sm mb-4 ${isDark ? 'bg-dark text-white border-secondary' : 'bg-white'
                                    }`}>
                                    <div className="card-header border-0 pb-0">
                                        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
                                            <h6 className="mb-0 fw-bold">
                                                <ImageIcon size={16} className="me-2 text-primary" />
                                                Archivos Adjuntos ({report.files ? report.files.length : 0})
                                            </h6>
                                            <button
                                                className="btn btn-outline-primary btn-sm"
                                                onClick={() => setShowFileUpload(!showFileUpload)}
                                            >
                                                <Plus size={16} className="me-1" />
                                                <span className="d-none d-sm-inline">Agregar</span>
                                                <span className="d-sm-none">+</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        {/* Área de carga de archivos */}
                                        {showFileUpload && (
                                            <div className="mb-4">
                                                <div className={`file-upload-area p-4 text-center ${isDark ? 'border-secondary' : ''
                                                    }`}>
                                                    <Upload size={32} className="text-muted mb-2" />
                                                    <h6 className="mb-2">Subir Archivos</h6>
                                                    <input
                                                        type="file"
                                                        multiple
                                                        accept="image/*,.pdf,.doc,.docx,.txt"
                                                        onChange={handleFileSelect}
                                                        className="form-control mb-3"
                                                    />
                                                    <small className="text-muted">
                                                        Formatos permitidos: Imágenes, PDF, DOC, DOCX, TXT (máx. 10MB)
                                                    </small>
                                                </div>

                                                {selectedFiles.length > 0 && (
                                                    <div className="mt-3">
                                                        <h6 className="small fw-bold mb-2">Archivos seleccionados:</h6>
                                                        <div className="list-group">
                                                            {selectedFiles.map((file, index) => (
                                                                <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                                                    <div className="d-flex align-items-center">
                                                                        <File size={16} className="me-2 text-muted" />
                                                                        <div>
                                                                            <div className="fw-medium">{file.name}</div>
                                                                            <small className="text-muted">{formatFileSize(file.size)}</small>
                                                                        </div>
                                                                    </div>
                                                                    <button
                                                                        className="btn btn-outline-danger btn-sm"
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

                                                <div className="d-flex gap-2 mt-3">
                                                    <button
                                                        className="btn btn-secondary"
                                                        onClick={() => {
                                                            setShowFileUpload(false);
                                                            setSelectedFiles([]);
                                                        }}
                                                        disabled={uploadingFiles}
                                                    >
                                                        <X size={14} className="me-1" />
                                                        Cancelar
                                                    </button>
                                                    <button
                                                        className="btn btn-primary"
                                                        onClick={handleUploadFiles}
                                                        disabled={uploadingFiles || selectedFiles.length === 0}
                                                    >
                                                        {uploadingFiles ? (
                                                            <>
                                                                <div className="spinner-border spinner-border-sm me-2" role="status">
                                                                    <span className="visually-hidden">Subiendo...</span>
                                                                </div>
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
                                        )}

                                        {/* Separar imágenes de otros archivos */}
                                        {report.files && report.files.length > 0 && (
                                            <>
                                                {/* Galería de imágenes */}
                                                {(() => {
                                                    const images = report.files.filter(file => {
                                                        if (!file) return false;
                                                        // Usar el campo type que contiene el MIME type
                                                        return file.type && file.type.startsWith('image/');
                                                    });

                                                    if (images.length === 0) return null;

                                                    return (
                                                        <div className="mb-4">
                                                            <h6 className="fw-bold mb-3">
                                                                <ImageIcon size={16} className="me-2 text-primary" />
                                                                Imágenes ({images.length})
                                                            </h6>
                                                            <div className="image-gallery">
                                                                {images.map((file, index) => {
                                                                    const fileUrl = fileUrls[file.id];
                                                                    // Usar el nombre original del archivo para mostrar al usuario
                                                                    const displayName = file.name || file.filename || 'Archivo sin nombre';

                                                                    return (
                                                                        <div key={index} className="image-card">
                                                                            {fileUrl ? (
                                                                                <>
                                                                                    <img
                                                                                        src={fileUrl}
                                                                                        alt={displayName || `Imagen ${index + 1}`}
                                                                                        className="image-thumbnail w-100"
                                                                                        style={{
                                                                                            height: '200px',
                                                                                            objectFit: 'cover',
                                                                                            cursor: 'pointer'
                                                                                        }}
                                                                                        onClick={() => setSelectedImage(fileUrl)}
                                                                                    />
                                                                                    <div className="image-overlay">
                                                                                        <div className="image-info">
                                                                                            <div className="text-truncate">{displayName}</div>
                                                                                            {file.file_size && (
                                                                                                <small className="opacity-75">
                                                                                                    {formatFileSize(file.file_size)}
                                                                                                </small>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="position-absolute top-0 end-0 p-2">
                                                                                        <div className="d-flex gap-1">
                                                                                            <a
                                                                                                href={fileUrl}
                                                                                                download={displayName}
                                                                                                className="btn btn-primary btn-sm"
                                                                                                onClick={(e) => e.stopPropagation()}
                                                                                                title="Descargar imagen"
                                                                                                style={{ opacity: 0.9 }}
                                                                                            >
                                                                                                <Download size={14} />
                                                                                            </a>
                                                                                            <button
                                                                                                className="btn btn-danger btn-sm"
                                                                                                onClick={(e) => {
                                                                                                    e.stopPropagation();
                                                                                                    handleDeleteFile(file.id, displayName);
                                                                                                }}
                                                                                                title="Eliminar imagen"
                                                                                                style={{ opacity: 0.9 }}
                                                                                            >
                                                                                                <Trash2 size={14} />
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                </>
                                                                            ) : (
                                                                                <div className="d-flex justify-content-center align-items-center bg-light" style={{ height: '200px' }}>
                                                                                    <ImageIcon size={48} className="text-muted" />
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    );
                                                })()}

                                                {/* Otros archivos */}
                                                {(() => {
                                                    const otherFiles = report.files.filter(file => {
                                                        if (!file) return false;
                                                        // Usar el campo type que contiene el MIME type
                                                        return file.type && !file.type.startsWith('image/');
                                                    });

                                                    if (otherFiles.length === 0) return null;

                                                    return (
                                                        <div>
                                                            <h6 className="fw-bold mb-3">
                                                                <File size={16} className="me-2 text-primary" />
                                                                Documentos ({otherFiles.length})
                                                            </h6>
                                                            <div className="row g-3">
                                                                {otherFiles.map((file, index) => {
                                                                    // Usar el nombre original del archivo para mostrar al usuario
                                                                    const displayName = file.name || file.filename || 'Archivo sin nombre';

                                                                    const fileUrl = fileUrls[file.id];

                                                                    return (
                                                                        <div key={index} className="col-12 col-sm-6 col-md-6 col-lg-4">
                                                                            <div className={`card h-100 card-hover ${isDark ? 'bg-secondary bg-opacity-25 border-secondary' : 'border-0 shadow-sm'
                                                                                }`}>
                                                                                <div className="card-body text-center">
                                                                                    <div className="mb-3">
                                                                                        {getFileIcon(file.type, 48)}
                                                                                    </div>
                                                                                    <h6 className="card-title text-truncate" title={displayName}>
                                                                                        {displayName}
                                                                                    </h6>
                                                                                    {file.file_size && (
                                                                                        <small className="text-muted d-block mb-3">
                                                                                            {formatFileSize(file.file_size)}
                                                                                        </small>
                                                                                    )}
                                                                                    <div className="d-flex gap-2 justify-content-center">
                                                                                        {fileUrl && (
                                                                                            <a
                                                                                                href={fileUrl}
                                                                                                download={displayName}
                                                                                                className="btn btn-outline-primary btn-sm"
                                                                                            >
                                                                                                <Download size={14} className="me-1" />
                                                                                                Descargar
                                                                                            </a>
                                                                                        )}
                                                                                        <button
                                                                                            className="btn btn-outline-danger btn-sm"
                                                                                            onClick={() => handleDeleteFile(file.id, displayName)}
                                                                                        >
                                                                                            <Trash2 size={14} className="me-1" />
                                                                                            Eliminar
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    );
                                                })()}
                                            </>
                                        )}

                                        {(!report.files || report.files.length === 0) && (
                                            <div className="text-center py-4">
                                                <ImageIcon size={48} className="text-muted mb-3" />
                                                <p className="text-muted mb-0">No hay archivos adjuntos</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Columna lateral */}
                            <div className="col-12 col-lg-4">
                                {/* Reportado por */}
                                <div className={`card shadow-sm mb-4 ${isDark ? 'bg-dark text-white border-secondary' : 'bg-white'
                                    }`}>
                                    <div className="card-header border-0 pb-0">
                                        <h6 className="mb-0 fw-bold">
                                            <User size={16} className="me-2 text-primary" />
                                            Reportado por
                                        </h6>
                                    </div>
                                    <div className="card-body">
                                        <div className="d-flex align-items-center">
                                            <div className={`rounded-circle d-flex align-items-center justify-content-center me-3 ${isDark ? 'bg-primary bg-opacity-25' : 'bg-primary bg-opacity-10'
                                                }`} style={{ width: '48px', height: '48px' }}>
                                                <User size={24} className="text-primary" />
                                            </div>
                                            <div>
                                                <h6 className="mb-0 fw-semibold">{report.user?.name || 'Usuario'}</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Personas vinculadas */}
                                <div className={`card shadow-sm mb-4 ${isDark ? 'bg-dark text-white border-secondary' : 'bg-white'
                                    }`}>
                                    <div className="card-header border-0 pb-0">
                                        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
                                            <h6 className="mb-0 fw-bold">
                                                <Users size={16} className="me-2 text-primary" />
                                                <span className="d-none d-sm-inline">Personas Involucradas</span>
                                                <span className="d-sm-none">Personas</span>
                                                <span className="ms-1">({reportPersons.length})</span>
                                            </h6>
                                            <button
                                                className="btn btn-outline-primary btn-sm"
                                                onClick={() => setShowPersonModal(true)}
                                            >
                                                <Plus size={16} className="me-1" />
                                                <span className="d-none d-sm-inline">Agregar</span>
                                                <span className="d-sm-none">+</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        {reportPersons.length > 0 ? (
                                            <div className="d-flex flex-column gap-2">
                                                {reportPersons.map((person, index) => (
                                                    <div key={index} className={`p-3 rounded-2 person-card d-flex justify-content-between align-items-center ${isDark ? 'bg-secondary bg-opacity-25' : 'bg-light'
                                                        }`}>
                                                        <div className="d-flex align-items-center flex-grow-1">
                                                            <div className={`rounded-circle d-flex align-items-center justify-content-center me-3 ${isDark ? 'bg-primary bg-opacity-25' : 'bg-primary bg-opacity-10'
                                                                }`} style={{ width: '40px', height: '40px' }}>
                                                                <User size={18} className="text-primary" />
                                                            </div>
                                                            <div className="flex-grow-1">
                                                                <div className="fw-semibold">{person.name} {person.last_name}</div>
                                                                <div className="d-flex flex-column flex-sm-row gap-1">
                                                                    <small className="text-muted">DNI: {person.dni}</small>
                                                                    {person.locality && (
                                                                        <small className="text-muted d-none d-sm-inline">• {person.locality}</small>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex gap-1">
                                                            <button
                                                                className="btn btn-outline-info btn-sm"
                                                                onClick={() => {
                                                                    setSelectedPersonDetails(person);
                                                                    setShowPersonDetailsModal(true);
                                                                }}
                                                                title="Ver detalles"
                                                            >
                                                                <Info size={14} />
                                                            </button>
                                                            <button
                                                                className="btn btn-outline-danger btn-sm"
                                                                onClick={() => handleRemovePerson(person.id)}
                                                                title="Desvincular persona"
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-3">
                                                <Users size={32} className="text-muted mb-2" />
                                                <p className="text-muted mb-0 small">No hay personas vinculadas</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal para editar estado y descripción */}
            {showEditModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-scrollable">
                        <div className={`modal-content ${isDark ? 'bg-dark text-white border-secondary' : ''
                            }`}>
                            <div className="modal-header border-0">
                                <h5 className="modal-title">
                                    <Edit size={20} className="me-2" />
                                    Editar Informe
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={handleEditCancel}
                                    aria-label="Close"
                                ></button>
                            </div>
                            <form onSubmit={handleEditSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label htmlFor="status" className="form-label fw-semibold">Estado</label>
                                        <select
                                            id="status"
                                            className={`form-select ${isDark ? 'bg-dark text-white border-secondary' : ''
                                                }`}
                                            value={editData.status}
                                            onChange={(e) => setEditData(prev => ({ ...prev, status: e.target.value }))}
                                        >
                                            <option value="">Seleccionar estado</option>
                                            <option value="pending">Pendiente</option>
                                            <option value="complete">Completado</option>
                                            <option value="urgent">Urgente</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="description" className="form-label fw-semibold">Observaciones</label>
                                        <textarea
                                            id="description"
                                            className={`form-control ${isDark ? 'bg-dark text-white border-secondary' : ''
                                                }`}
                                            rows="4"
                                            value={editData.description}
                                            onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                                            placeholder="Agregar observaciones adicionales..."
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer border-0">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={handleEditCancel}
                                        disabled={updating}
                                    >
                                        <X size={16} className="me-1" />
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={updating}
                                    >
                                        {updating ? (
                                            <>
                                                <div className="spinner-border spinner-border-sm me-2" role="status">
                                                    <span className="visually-hidden">Actualizando...</span>
                                                </div>
                                                Actualizando...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle size={16} className="me-1" />
                                                Guardar Cambios
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para agregar personas */}
            <AddPersonModal
                isOpen={showPersonModal}
                onClose={() => setShowPersonModal(false)}
                onPersonAdded={handlePersonAdded}
                isDark={isDark}
            />

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
                    <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                        <div className="position-relative">
                            {/* Botón de cerrar */}
                            <button
                                className="btn btn-light position-absolute top-0 end-0 m-3"
                                style={{ zIndex: 1060, borderRadius: '50%', width: '40px', height: '40px' }}
                                onClick={() => setSelectedImage(null)}
                            >
                                <X size={20} />
                            </button>

                            {/* Imagen principal */}
                            <img
                                src={selectedImage}
                                alt="Imagen ampliada"
                                className="img-fluid rounded"
                                style={{
                                    maxHeight: '90vh',
                                    maxWidth: '100%',
                                    objectFit: 'contain'
                                }}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de detalles de persona */}
            {showPersonDetailsModal && selectedPersonDetails && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className={`modal-content ${isDark ? 'bg-dark text-light' : ''}`}>
                            <div className="modal-header">
                                <h5 className="modal-title d-flex align-items-center">
                                    <User className="me-2" size={20} />
                                    Detalles de la Persona
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowPersonDetailsModal(false)}
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Nombre</label>
                                        <p className="form-control-plaintext">{selectedPersonDetails.name}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Apellido</label>
                                        <p className="form-control-plaintext">{selectedPersonDetails.last_name}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">DNI</label>
                                        <p className="form-control-plaintext">{selectedPersonDetails.dni}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Teléfono</label>
                                        <p className="form-control-plaintext">{selectedPersonDetails.phone || 'No especificado'}</p>
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label fw-semibold">Email</label>
                                        <p className="form-control-plaintext">{selectedPersonDetails.email || 'No especificado'}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Localidad</label>
                                        <p className="form-control-plaintext">{selectedPersonDetails.locality || 'No especificada'}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Provincia</label>
                                        <p className="form-control-plaintext">{selectedPersonDetails.province || 'No especificada'}</p>
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label fw-semibold">Dirección</label>
                                        <p className="form-control-plaintext">{selectedPersonDetails.address || 'No especificada'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowPersonDetailsModal(false)}
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Toaster
                position="top-right"
                richColors
                closeButton
                duration={4000}
            />
        </>
    );
}
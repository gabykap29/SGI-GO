"use client"
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Toaster } from 'sonner';
import { Sidebar } from '../../../../../components/Sidebard';
import { Header } from '../../../../../components/Header';
import { AddPersonModal } from '../../../../../components/AddPersonModal';
import useTheme from '../../../../../hooks/useTheme';
import { useAuth } from '../../../../../hooks/useAuth';

import { useReportData } from './hooks/useReportData';
import { useFileManagement } from './hooks/useFileManagement';
import { usePersonManagement } from './hooks/usePersonManagement';
import { useReportEditor } from './hooks/useReportEditor';

import { ReportHeader } from './components/ReportHeader';
import { ReportBasicInfo } from './components/ReportBasicInfo';
import { ReportContentSection } from './components/ReportContentSection';
import { FilesSection } from './components/FilesSection';
import { ReportedByCard } from './components/ReportedByCard';
import { PersonsLinkedCard } from './components/PersonsLinkedCard';
import { EditReportModal } from './components/EditReportModal';
import { ImageViewModal } from './components/ImageViewModal';
import { PersonDetailsModal } from './components/PersonDetailsModal';

import { useSidebar } from './hooks/useSidebar';
import "./style.css"

const BOOTSTRAP_CSS = "https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css";
const BOOTSTRAP_ICONS = "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.0/font/bootstrap-icons.min.css";

export default function VisualizarInforme() {
    const { isAuthenticated, isLoading } = useAuth();
    const { id } = useParams();
    const router = useRouter();
    const { theme, toggleTheme, isDark } = useTheme();

    const { sidebarCollapsed, setSidebarCollapsed, isMobile } = useSidebar();
    const { report, loading, fileUrls, refreshReport, setReport } = useReportData(id);

    const [reportPersons, setReportPersons] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    const fileManagement = useFileManagement(id, refreshReport);
    const personManagement = usePersonManagement(id, reportPersons, setReportPersons);
    const reportEditor = useReportEditor(report, setReport);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/auth/login');
        }
    }, [isAuthenticated, isLoading, router]);

    useEffect(() => {
        if (report?.persons && Array.isArray(report.persons)) {
            setReportPersons(report.persons);
        }
    }, [report]);

    const handleBack = () => router.push('/reports');

    if (isLoading) return <LoadingScreen />;
    if (!isAuthenticated) return null;

    if (loading) {
        return (
            <AppLayout
                sidebarCollapsed={sidebarCollapsed}
                setSidebarCollapsed={setSidebarCollapsed}
                isDark={isDark}
                toggleTheme={toggleTheme}
                isMobile={isMobile}
            >
                <LoadingContent />
            </AppLayout>
        );
    }

    if (!report) {
        return (
            <AppLayout
                sidebarCollapsed={sidebarCollapsed}
                setSidebarCollapsed={setSidebarCollapsed}
                isDark={isDark}
                toggleTheme={toggleTheme}
                isMobile={isMobile}
            >
                <NotFoundContent onBack={handleBack} />
            </AppLayout>
        );
    }

    return (
        <>
            <link href={BOOTSTRAP_CSS} rel="stylesheet" />
            <link href={BOOTSTRAP_ICONS} rel="stylesheet" />

            <div className="d-flex">
                <Sidebar
                    isCollapsed={sidebarCollapsed}
                    onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                />
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
                        <ReportHeader
                            onBack={handleBack}
                            onEdit={reportEditor.openEditModal}
                            isDark={isDark}
                        />

                        <div className="row g-4">
                            <div className="col-12 col-lg-8">
                                <ReportBasicInfo report={report} isDark={isDark} />
                                <ReportContentSection
                                    title="Contenido del Informe"
                                    content={report.content}
                                    isDark={isDark}
                                />
                                <ReportContentSection
                                    title="Observaciones"
                                    content={report.description}
                                    isDark={isDark}
                                />
                                <FilesSection
                                    files={report.files}
                                    fileUrls={fileUrls}
                                    showFileUpload={fileManagement.showFileUpload}
                                    setShowFileUpload={fileManagement.setShowFileUpload}
                                    selectedFiles={fileManagement.selectedFiles}
                                    uploadingFiles={fileManagement.uploadingFiles}
                                    onFileSelect={fileManagement.handleFileSelect}
                                    onRemoveFile={fileManagement.removeFile}
                                    onUpdateDescription={fileManagement.updateFileDescription}
                                    onUploadFiles={fileManagement.uploadFiles}
                                    onImageClick={setSelectedImage}
                                    onDeleteFile={fileManagement.deleteFileHandler}
                                    isDark={isDark}
                                />
                            </div>

                            <div className="col-12 col-lg-4">
                                <ReportedByCard user={report.user} isDark={isDark} />
                                <PersonsLinkedCard
                                    persons={reportPersons}
                                    onAddPerson={() => personManagement.setShowPersonModal(true)}
                                    onRemovePerson={personManagement.handleRemovePerson}
                                    onShowDetails={personManagement.showPersonDetails}
                                    isDark={isDark}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <EditReportModal
                isOpen={reportEditor.showEditModal}
                editData={reportEditor.editData}
                updating={reportEditor.updating}
                isDark={isDark}
                onUpdate={() => reportEditor.updateReport(id)}
                onCancel={reportEditor.closeEditModal}
                onDataChange={reportEditor.setEditData}
            />

            <AddPersonModal
                isOpen={personManagement.showPersonModal}
                onClose={() => personManagement.setShowPersonModal(false)}
                onPersonAdded={personManagement.handlePersonAdded}
                isDark={isDark}
            />

            <ImageViewModal
                imageUrl={selectedImage}
                onClose={() => setSelectedImage(null)}
            />

            <PersonDetailsModal
                person={personManagement.selectedPersonDetails}
                isDark={isDark}
                onClose={personManagement.hidePersonDetails}
            />

            <Toaster
                position="top-right"
                richColors
                closeButton
                duration={4000}
            />
        </>
    );
}

const AppLayout = ({ children, sidebarCollapsed, setSidebarCollapsed, isDark, toggleTheme, isMobile }) => {
    return (
        <>
            <link href={BOOTSTRAP_CSS} rel="stylesheet" />
            <link href={BOOTSTRAP_ICONS} rel="stylesheet" />

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
                        {children}
                    </div>
                </div>
            </div>

            <Toaster position="top-right" richColors closeButton duration={4000} />
        </>
    );
};

const LoadingScreen = () => {
    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>
        </div>
    );
};

const LoadingContent = () => {
    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando informe...</span>
            </div>
        </div>
    );
};

const NotFoundContent = ({ onBack }) => {
    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <div className="text-center">
                <AlertCircle size={48} className="text-danger mb-3" />
                <h5 className="text-danger mb-2">Informe no encontrado</h5>
                <p className="text-muted mb-3">El informe que buscas no existe o no tienes permisos para verlo.</p>
                <button className="btn btn-primary" onClick={onBack}>
                    <ArrowLeft size={16} className="me-2" />
                    Volver a Informes
                </button>
            </div>
        </div>
    );
};

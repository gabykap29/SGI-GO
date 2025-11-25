import { Image as ImageIcon, Plus } from 'lucide-react';
import { FileUploadArea } from './FileUploadArea';
import { ImageGallery } from './ImageGallery';
import { DocumentList } from './DocumentList';
import { separateFilesByType } from '../utils/fileHelpers';

export const FilesSection = ({
    files,
    fileUrls,
    showFileUpload,
    setShowFileUpload,
    selectedFiles,
    uploadingFiles,
    onFileSelect,
    onRemoveFile,
    onUpdateDescription,
    onUploadFiles,
    onImageClick,
    onDeleteFile,
    isDark
}) => {
    const { images, documents } = separateFilesByType(files);
    const hasFiles = files && files.length > 0;

    const handleCancelUpload = () => {
        setShowFileUpload(false);
    };

    return (
        <div className={`card shadow-sm mb-4 ${isDark ? 'bg-dark text-white border-secondary' : 'bg-white'
            }`}>
            <div className="card-header border-0 pb-0">
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
                    <h6 className="mb-0 fw-bold">
                        <ImageIcon size={16} className="me-2 text-primary" />
                        Archivos Adjuntos ({files?.length || 0})
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
                {showFileUpload && (
                    <FileUploadArea
                        selectedFiles={selectedFiles}
                        uploadingFiles={uploadingFiles}
                        onFileSelect={onFileSelect}
                        onRemoveFile={onRemoveFile}
                        onUpdateDescription={onUpdateDescription}
                        onUpload={onUploadFiles}
                        onCancel={handleCancelUpload}
                        isDark={isDark}
                    />
                )}

                {hasFiles ? (
                    <>
                        <ImageGallery
                            images={images}
                            fileUrls={fileUrls}
                            onImageClick={onImageClick}
                            onDelete={onDeleteFile}
                        />
                        <DocumentList
                            documents={documents}
                            fileUrls={fileUrls}
                            onDelete={onDeleteFile}
                            isDark={isDark}
                        />
                    </>
                ) : (
                    <EmptyState />
                )}
            </div>
        </div>
    );
};

const EmptyState = () => {
    return (
        <div className="text-center py-4">
            <ImageIcon size={48} className="text-muted mb-3" />
            <p className="text-muted mb-0">No hay archivos adjuntos</p>
        </div>
    );
};

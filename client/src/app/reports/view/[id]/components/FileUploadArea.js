import { Upload, X, File } from 'lucide-react';
import { formatFileSize } from '../../../../../../hooks/handleFiles';

export const FileUploadArea = ({
    selectedFiles,
    uploadingFiles,
    onFileSelect,
    onRemoveFile,
    onUpdateDescription,
    onUpload,
    onCancel,
    isDark
}) => {
    return (
        <div className="mb-4">
            <div className={`file-upload-area p-4 text-center ${isDark ? 'border-secondary' : ''
                }`}>
                <Upload size={32} className="text-muted mb-2" />
                <h6 className="mb-2">Subir Archivos</h6>
                <input
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx,.txt"
                    onChange={onFileSelect}
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
                        {selectedFiles.map((fileItem, index) => (
                            <FileListItem
                                key={index}
                                fileItem={fileItem}
                                onRemove={() => onRemoveFile(index)}
                                onUpdateDescription={(description) => onUpdateDescription(index, description)}
                                disabled={uploadingFiles}
                                isDark={isDark}
                            />
                        ))}
                    </div>
                </div>
            )}

            <div className="d-flex gap-2 mt-3">
                <button
                    className="btn btn-secondary"
                    onClick={onCancel}
                    disabled={uploadingFiles}
                >
                    <X size={14} className="me-1" />
                    Cancelar
                </button>
                <button
                    className="btn btn-primary"
                    onClick={onUpload}
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
    );
};

const FileListItem = ({ fileItem, onRemove, onUpdateDescription, disabled, isDark }) => {
    return (
        <div className={`list-group-item ${isDark ? 'bg-dark text-white border-secondary' : ''}`}>
            <div className="d-flex justify-content-between align-items-start mb-2">
                <div className="d-flex align-items-center flex-grow-1">
                    <File size={16} className="me-2 text-muted flex-shrink-0" />
                    <div className="flex-grow-1">
                        <div className="fw-medium">{fileItem.file.name}</div>
                        <small className="text-muted">{formatFileSize(fileItem.file.size)}</small>
                    </div>
                </div>
                <button
                    className="btn btn-outline-danger btn-sm ms-2"
                    onClick={onRemove}
                    disabled={disabled}
                >
                    <X size={14} />
                </button>
            </div>
            <div className="mt-2">
                <input
                    type="text"
                    className={`form-control form-control-sm ${isDark ? 'bg-dark text-white border-secondary' : ''
                        }`}
                    placeholder="Descripción del archivo (opcional)"
                    value={fileItem.description}
                    onChange={(e) => onUpdateDescription(e.target.value)}
                    disabled={disabled}
                />
            </div>
        </div>
    );
};

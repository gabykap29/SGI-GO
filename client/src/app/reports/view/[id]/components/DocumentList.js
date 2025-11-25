import { File, Download, Trash2 } from 'lucide-react';
import { formatFileSize } from '../../../../../../hooks/handleFiles';
import { getFileIcon, getDisplayFileName } from '../utils/fileHelpers';

export const DocumentList = ({ documents, fileUrls, onDelete, isDark }) => {
    if (!documents || documents.length === 0) return null;

    return (
        <div>
            <h6 className="fw-bold mb-3">
                <File size={16} className="me-2 text-primary" />
                Documentos ({documents.length})
            </h6>
            <div className="row g-3">
                {documents.map((file, index) => (
                    <DocumentCard
                        key={index}
                        file={file}
                        fileUrl={fileUrls[file.id]}
                        onDelete={onDelete}
                        isDark={isDark}
                    />
                ))}
            </div>
        </div>
    );
};

const DocumentCard = ({ file, fileUrl, onDelete, isDark }) => {
    const displayName = getDisplayFileName(file);

    return (
        <div className="col-12 col-sm-6 col-md-6 col-lg-4">
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
                            onClick={() => onDelete(file.id, displayName)}
                        >
                            <Trash2 size={14} className="me-1" />
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

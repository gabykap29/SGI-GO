import { Image as ImageIcon, Download, Trash2 } from 'lucide-react';
import { formatFileSize } from '../../../../../../hooks/handleFiles';
import { getDisplayFileName } from '../utils/fileHelpers';

export const ImageGallery = ({ images, fileUrls, onImageClick, onDelete }) => {
    if (!images || images.length === 0) return null;

    return (
        <div className="mb-4">
            <h6 className="fw-bold mb-3">
                <ImageIcon size={16} className="me-2 text-primary" />
                Imágenes ({images.length})
            </h6>
            <div className="image-gallery">
                {images.map((file, index) => (
                    <ImageCard
                        key={index}
                        file={file}
                        fileUrl={fileUrls[file.id]}
                        onImageClick={onImageClick}
                        onDelete={onDelete}
                    />
                ))}
            </div>
        </div>
    );
};

const ImageCard = ({ file, fileUrl, onImageClick, onDelete }) => {
    const displayName = getDisplayFileName(file);

    if (!fileUrl) {
        return (
            <div className="image-card">
                <div className="d-flex justify-content-center align-items-center bg-light" style={{ height: '200px' }}>
                    <ImageIcon size={48} className="text-muted" />
                </div>
            </div>
        );
    }

    return (
        <div className="image-card">
            <img
                src={fileUrl}
                alt={displayName}
                className="image-thumbnail w-100"
                style={{
                    height: '200px',
                    objectFit: 'cover',
                    cursor: 'pointer'
                }}
                onClick={() => onImageClick(fileUrl)}
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
                            onDelete(file.id, displayName);
                        }}
                        title="Eliminar imagen"
                        style={{ opacity: 0.9 }}
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

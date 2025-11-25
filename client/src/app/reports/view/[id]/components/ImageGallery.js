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
                <div className="d-flex justify-content-center align-items-center bg-light" style={{ height: '220px' }}>
                    <ImageIcon size={48} className="text-muted" />
                </div>
            </div>
        );
    }

    return (
        <div className="image-card position-relative overflow-hidden rounded-3 shadow-sm"
            style={{
                transition: 'all 0.3s ease',
                cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.12)';
            }}>
            <img
                src={fileUrl}
                alt={file.description || displayName}
                className="w-100"
                style={{
                    height: '220px',
                    objectFit: 'cover'
                }}
                onClick={() => onImageClick(fileUrl)}
            />
            <div className="image-overlay" style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
                padding: '1rem',
                color: 'white',
                transition: 'opacity 0.3s ease'
            }}>
                <div className="image-info">
                    {/* Mostrar descripción como título principal, o nombre si no hay descripción */}
                    <div className="fw-semibold mb-1" style={{ fontSize: '0.95rem' }}>
                        {file.description || displayName}
                    </div>

                    {/* Si hay descripción, mostrar el nombre del archivo como secundario */}
                    {file.description && (
                        <small className="text-white-50 d-block mb-1" style={{ fontSize: '0.75rem' }}>
                            {displayName}
                        </small>
                    )}

                    {file.file_size && (
                        <small className="opacity-75" style={{ fontSize: '0.75rem' }}>
                            {formatFileSize(file.file_size)}
                        </small>
                    )}
                </div>
            </div>
            <div className="position-absolute top-0 end-0 p-2" style={{ zIndex: 10 }}>
                <div className="d-flex gap-1">
                    <a
                        href={fileUrl}
                        download={displayName}
                        className="btn btn-light btn-sm rounded-circle"
                        onClick={(e) => e.stopPropagation()}
                        title="Descargar imagen"
                        style={{
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                        }}
                    >
                        <Download size={14} />
                    </a>
                    <button
                        className="btn btn-danger btn-sm rounded-circle"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(file.id, displayName);
                        }}
                        title="Eliminar imagen"
                        style={{
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                        }}
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

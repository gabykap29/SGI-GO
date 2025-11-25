import { X } from 'lucide-react';

export const ImageViewModal = ({ imageUrl, onClose }) => {
    if (!imageUrl) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="modal fade show d-block"
            style={{ backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 1055 }}
            onClick={handleBackdropClick}
        >
            <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                <div className="position-relative">
                    <button
                        className="btn btn-light position-absolute top-0 end-0 m-3"
                        style={{ zIndex: 1060, borderRadius: '50%', width: '40px', height: '40px' }}
                        onClick={onClose}
                    >
                        <X size={20} />
                    </button>
                    <img
                        src={imageUrl}
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
    );
};

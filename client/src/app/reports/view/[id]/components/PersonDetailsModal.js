import { User } from 'lucide-react';

export const PersonDetailsModal = ({ person, isDark, onClose }) => {
    if (!person) return null;

    return (
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
                            onClick={onClose}
                            aria-label="Close"
                        />
                    </div>
                    <div className="modal-body">
                        <div className="row g-3">
                            <DetailField label="Nombre" value={person.name} />
                            <DetailField label="Apellido" value={person.last_name} />
                            <DetailField label="DNI" value={person.dni} />
                            <DetailField label="Teléfono" value={person.phone || 'No especificado'} />
                            <DetailField
                                label="Email"
                                value={person.email || 'No especificado'}
                                fullWidth
                            />
                            <DetailField label="Localidad" value={person.locality || 'No especificada'} />
                            <DetailField label="Provincia" value={person.province || 'No especificada'} />
                            <DetailField
                                label="Dirección"
                                value={person.address || 'No especificada'}
                                fullWidth
                            />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DetailField = ({ label, value, fullWidth = false }) => {
    return (
        <div className={fullWidth ? "col-12" : "col-md-6"}>
            <label className="form-label fw-semibold">{label}</label>
            <p className="form-control-plaintext">{value}</p>
        </div>
    );
};

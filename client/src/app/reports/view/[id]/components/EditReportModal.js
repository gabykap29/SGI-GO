import { Edit, X, CheckCircle } from 'lucide-react';

export const EditReportModal = ({
    isOpen,
    editData,
    updating,
    isDark,
    onUpdate,
    onCancel,
    onDataChange
}) => {
    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate();
    };

    return (
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
                            onClick={onCancel}
                            aria-label="Close"
                        />
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="status" className="form-label fw-semibold">
                                    Estado
                                </label>
                                <select
                                    id="status"
                                    className={`form-select ${isDark ? 'bg-dark text-white border-secondary' : ''
                                        }`}
                                    value={editData.status}
                                    onChange={(e) => onDataChange({ ...editData, status: e.target.value })}
                                >
                                    <option value="">Seleccionar estado</option>
                                    <option value="pending">Pendiente</option>
                                    <option value="complete">Completado</option>
                                    <option value="urgent">Urgente</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="description" className="form-label fw-semibold">
                                    Observaciones
                                </label>
                                <textarea
                                    id="description"
                                    className={`form-control ${isDark ? 'bg-dark text-white border-secondary' : ''
                                        }`}
                                    rows="4"
                                    value={editData.description}
                                    onChange={(e) => onDataChange({ ...editData, description: e.target.value })}
                                    placeholder="Agregar observaciones adicionales..."
                                />
                            </div>
                        </div>
                        <div className="modal-footer border-0">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onCancel}
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
    );
};

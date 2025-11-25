import { Eye, ArrowLeft, Edit } from 'lucide-react';

export const ReportHeader = ({ onBack, onEdit, isDark }) => {
    return (
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
                                    onClick={onBack}
                                >
                                    <ArrowLeft size={16} className="me-1" />
                                    Volver a Informes
                                </button>
                            </div>
                        </div>
                        <button
                            className="btn btn-outline-primary"
                            onClick={onEdit}
                        >
                            <Edit size={16} className="me-2" />
                            <span className="d-none d-sm-inline">Editar</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

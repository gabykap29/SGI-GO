import { User } from 'lucide-react';

export const ReportedByCard = ({ user, isDark }) => {
    return (
        <div className={`card shadow-sm mb-4 ${isDark ? 'bg-dark text-white border-secondary' : 'bg-white'
            }`}>
            <div className="card-header border-0 pb-0">
                <h6 className="mb-0 fw-bold">
                    <User size={16} className="me-2 text-primary" />
                    Reportado por
                </h6>
            </div>
            <div className="card-body">
                <div className="d-flex align-items-center">
                    <div className={`rounded-circle d-flex align-items-center justify-content-center me-3 ${isDark ? 'bg-primary bg-opacity-25' : 'bg-primary bg-opacity-10'
                        }`} style={{ width: '48px', height: '48px' }}>
                        <User size={24} className="text-primary" />
                    </div>
                    <div>
                        <h6 className="mb-0 fw-semibold">{user?.name || 'Usuario'}</h6>
                    </div>
                </div>
            </div>
        </div>
    );
};

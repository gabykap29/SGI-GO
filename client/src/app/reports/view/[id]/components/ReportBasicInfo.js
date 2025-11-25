import { FileText, MapPin, Calendar, CheckCircle } from 'lucide-react';
import { getStatusBadgeClass, getStatusLabel } from '../utils/fileHelpers';
import dayjs from 'dayjs';

export const ReportBasicInfo = ({ report, isDark }) => {
    return (
        <div className={`card shadow-sm mb-4 ${isDark ? 'bg-dark text-white border-secondary' : 'bg-white'
            }`}>
            <div className="card-header border-0 pb-0">
                <h5 className="mb-0 fw-bold">
                    <FileText size={20} className="me-2 text-primary" />
                    {report.title}
                </h5>
            </div>
            <div className="card-body">
                <div className="row g-3">
                    <InfoField
                        icon={MapPin}
                        label="UBICACIÓN"
                        value={`${report.department?.name} - ${report.locality?.name}`}
                        isDark={isDark}
                    />
                    <InfoField
                        icon={Calendar}
                        label="FECHA"
                        value={dayjs(report.created_at).format('DD/MM/YYYY HH:mm')}
                        isDark={isDark}
                    />
                    <InfoField
                        icon={FileText}
                        label="TIPO"
                        value={report.type_report?.name}
                        isDark={isDark}
                    />
                    <div className="col-12 col-sm-6 col-md-6">
                        <div className={`p-3 rounded-2 ${isDark ? 'bg-secondary bg-opacity-25' : 'bg-light'
                            }`}>
                            <div className="d-flex align-items-center mb-2">
                                <CheckCircle size={16} className="me-2 text-primary" />
                                <small className="text-muted fw-semibold">ESTADO</small>
                            </div>
                            <span className={getStatusBadgeClass(report.status)}>
                                {getStatusLabel(report.status)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InfoField = ({ icon: Icon, label, value, isDark }) => {
    return (
        <div className="col-12 col-sm-6 col-md-6">
            <div className={`p-3 rounded-2 ${isDark ? 'bg-secondary bg-opacity-25' : 'bg-light'
                }`}>
                <div className="d-flex align-items-center mb-2">
                    <Icon size={16} className="me-2 text-primary" />
                    <small className="text-muted fw-semibold">{label}</small>
                </div>
                <p className="mb-0 text-break">{value}</p>
            </div>
        </div>
    );
};

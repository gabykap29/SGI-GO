import { FileText } from 'lucide-react';

export const ReportContentSection = ({ title, content, isDark }) => {
    if (!content) return null;

    return (
        <div className={`card shadow-sm mb-4 ${isDark ? 'bg-dark text-white border-secondary' : 'bg-white'
            }`}>
            <div className="card-header border-0 pb-0">
                <h6 className="mb-0 fw-bold">
                    <FileText size={16} className="me-2 text-primary" />
                    {title}
                </h6>
            </div>
            <div className="card-body">
                <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                    {content}
                </p>
            </div>
        </div>
    );
};

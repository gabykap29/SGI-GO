import { FileText, FileSpreadsheet, Archive, Music, Video, FileCode, File } from 'lucide-react';

export const getFileIcon = (mimeType, size = 48) => {
    if (!mimeType) return <File size={size} className="text-muted" />;

    const type = mimeType.toLowerCase();

    const iconMap = {
        pdf: { icon: FileText, className: 'text-danger' },
        text: { icon: FileText, className: 'text-danger' },
        spreadsheet: { icon: FileSpreadsheet, className: 'text-success' },
        excel: { icon: FileSpreadsheet, className: 'text-success' },
        csv: { icon: FileSpreadsheet, className: 'text-success' },
        word: { icon: FileText, className: 'text-primary' },
        document: { icon: FileText, className: 'text-primary' },
        zip: { icon: Archive, className: 'text-warning' },
        rar: { icon: Archive, className: 'text-warning' },
        archive: { icon: Archive, className: 'text-warning' },
        audio: { icon: Music, className: 'text-info' },
        music: { icon: Music, className: 'text-info' },
        video: { icon: Video, className: 'text-purple' },
        javascript: { icon: FileCode, className: 'text-dark' },
        html: { icon: FileCode, className: 'text-dark' },
        css: { icon: FileCode, className: 'text-dark' },
        code: { icon: FileCode, className: 'text-dark' },
    };

    const matchedKey = Object.keys(iconMap).find(key => type.includes(key));

    if (matchedKey) {
        const { icon: Icon, className } = iconMap[matchedKey];
        return <Icon size={size} className={className} />;
    }

    return <File size={size} className="text-muted" />;
};

export const getStatusBadgeClass = (status) => {
    const statusMap = {
        'Urgente': 'badge badge-danger',
        'urgent': 'badge badge-danger',
        'complete': 'badge badge-success',
        'pending': 'badge badge-warning',
    };

    return statusMap[status] || 'badge badge-warning';
};

export const getStatusLabel = (status) => {
    const labelMap = {
        'complete': 'Completado',
        'pending': 'Pendiente',
        'urgent': 'Urgente',
    };

    return labelMap[status] || status;
};

export const separateFilesByType = (files) => {
    const images = files?.filter(file => file?.type?.startsWith('image/')) || [];
    const documents = files?.filter(file => file && !file.type?.startsWith('image/')) || [];

    return { images, documents };
};

export const getDisplayFileName = (file) => {
    return file.name || file.filename || 'Archivo sin nombre';
};

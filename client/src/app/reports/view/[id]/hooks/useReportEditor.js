import { useState } from 'react';
import { UpdateReport, UpdateReportStatus } from '../../../../../../hooks/handleReports';
import { handleError, handleSuccess } from '../../../../../../hooks/toaster';

export const useReportEditor = (report, setReport) => {
    const [showEditModal, setShowEditModal] = useState(false);
    const [editData, setEditData] = useState({ status: '', description: '' });
    const [updating, setUpdating] = useState(false);

    const openEditModal = () => {
        setEditData({
            status: report?.status || '',
            description: report?.description || ''
        });
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        setShowEditModal(false);
        setEditData({ status: '', description: '' });
    };

    const updateReport = async (reportId) => {
        setUpdating(true);

        try {
            const statusChanged = editData.status !== report.status;
            const descriptionChanged = editData.description !== report.description;

            if (statusChanged && !descriptionChanged) {
                await UpdateReportStatus(reportId, editData.status);
            } else {
                const updateData = {
                    ...report,
                    status: editData.status,
                    description: editData.description
                };
                await UpdateReport(reportId, updateData);
            }

            setReport(prev => ({
                ...prev,
                status: editData.status,
                description: editData.description
            }));

            setShowEditModal(false);
            handleSuccess('Informe actualizado correctamente');
        } catch (error) {
            handleError('Error al actualizar el informe: ' + (error.message || error));
        } finally {
            setUpdating(false);
        }
    };

    return {
        showEditModal,
        editData,
        setEditData,
        updating,
        openEditModal,
        closeEditModal,
        updateReport,
    };
};

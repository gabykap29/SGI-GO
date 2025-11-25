import { useState } from 'react';
import { addPersonToReport, removePersonFromReport } from '../../../../../../hooks/handleReports';
import { handleError, handleSuccess } from '../../../../../../hooks/toaster';

export const usePersonManagement = (reportId, reportPersons, setReportPersons) => {
    const [showPersonModal, setShowPersonModal] = useState(false);
    const [showPersonDetailsModal, setShowPersonDetailsModal] = useState(false);
    const [selectedPersonDetails, setSelectedPersonDetails] = useState(null);

    const handlePersonAdded = async (person) => {
        if (reportPersons.some(p => p.id === person.id)) {
            handleError('Esta persona ya está vinculada al informe');
            return;
        }

        try {
            await addPersonToReport(reportId, person.id);
            setReportPersons(prev => [...prev, person]);
            handleSuccess(`${person.name} vinculado al informe`);
        } catch (error) {
            handleError('Error al vincular la persona');
        }
    };

    const handleRemovePerson = async (personId) => {
        try {
            await removePersonFromReport(reportId, personId);
            setReportPersons(prev => prev.filter(p => p.id !== personId));
            handleSuccess('Persona desvinculada del informe');
        } catch (error) {
            handleError('Error al desvincular la persona');
        }
    };

    const showPersonDetails = (person) => {
        setSelectedPersonDetails(person);
        setShowPersonDetailsModal(true);
    };

    const hidePersonDetails = () => {
        setShowPersonDetailsModal(false);
        setSelectedPersonDetails(null);
    };

    return {
        showPersonModal,
        setShowPersonModal,
        showPersonDetailsModal,
        selectedPersonDetails,
        handlePersonAdded,
        handleRemovePerson,
        showPersonDetails,
        hidePersonDetails,
    };
};

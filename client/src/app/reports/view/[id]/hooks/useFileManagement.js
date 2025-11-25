import { useState } from 'react';
import { uploadFile, deleteFile, validateFileType, validateFileSize } from '../../../../../../hooks/handleFiles';
import { handleError, handleSuccess } from '../../../../../../hooks/toaster';

export const useFileManagement = (reportId, refreshReport) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadingFiles, setUploadingFiles] = useState(false);
    const [showFileUpload, setShowFileUpload] = useState(false);

    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files);

        const validFiles = files.filter(file => {
            if (!validateFileType(file)) {
                handleError(`El archivo ${file.name} no es de un tipo permitido`);
                return false;
            }

            if (!validateFileSize(file)) {
                handleError(`El archivo ${file.name} es demasiado grande (máximo 10MB)`);
                return false;
            }

            return true;
        });

        // Crear objetos con file y descripción para cada archivo
        const filesWithDescription = validFiles.map(file => ({
            file,
            description: ''
        }));

        setSelectedFiles(prev => [...prev, ...filesWithDescription]);
    };

    const updateFileDescription = (index, description) => {
        setSelectedFiles(prev => prev.map((item, i) =>
            i === index ? { ...item, description } : item
        ));
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const uploadFiles = async () => {
        if (selectedFiles.length === 0) {
            handleError('Debe adjuntar un archivo!');
            return;
        }

        setUploadingFiles(true);
        try {
            for (const fileItem of selectedFiles) {
                const response = await uploadFile(fileItem.file, reportId, fileItem.description);

                if (response) {
                    handleSuccess(`Archivo ${fileItem.file.name} subido correctamente`);
                }
            }

            setTimeout(() => {
                refreshReport();
            }, 1500);

            setSelectedFiles([]);
            setShowFileUpload(false);
            handleSuccess('Todos los archivos se han subido correctamente');
        } catch (error) {
            handleError('Error al subir archivos');
        } finally {
            setUploadingFiles(false);
        }
    };

    const deleteFileHandler = async (fileId, fileName) => {
        if (!confirm(`¿Estás seguro de que deseas eliminar el archivo "${fileName}"?`)) {
            return;
        }

        try {
            await deleteFile(fileId);
            handleSuccess(`Archivo "${fileName}" eliminado correctamente`);
            await refreshReport();
        } catch (error) {
            handleError('Error al eliminar el archivo');
        }
    };

    return {
        selectedFiles,
        uploadingFiles,
        showFileUpload,
        setShowFileUpload,
        handleFileSelect,
        updateFileDescription,
        removeFile,
        uploadFiles,
        deleteFileHandler,
    };
};

'use client';
import { useState, useEffect } from 'react';
import { uploadFileToPerson, deleteFile, getAuthenticatedFileUrl } from '../../../../../../hooks/handleFiles';
import { getFilesByPersonId } from '../../../../../../hooks/handlePersons';
import { toast } from 'sonner';

export const usePersonFileManagement = (personId) => {
    const [files, setFiles] = useState([]);
    const [fileUrls, setFileUrls] = useState({});
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadingFiles, setUploadingFiles] = useState(false);
    const [showFileUpload, setShowFileUpload] = useState(false);

    // Cargar archivos de la persona
    useEffect(() => {
        if (personId) {
            fetchFiles();
        }
    }, [personId]);

    // Cargar URLs de archivos
    useEffect(() => {
        const loadFileUrls = async () => {
            const urls = {};
            for (const file of files) {
                if (file.filename) {
                    const url = await getAuthenticatedFileUrl(file.filename);
                    if (url) {
                        urls[file.id] = url;
                    }
                }
            }
            setFileUrls(urls);
        };

        if (files.length > 0) {
            loadFileUrls();
        }
    }, [files]);

    const fetchFiles = async () => {
        try {
            const data = await getFilesByPersonId(personId);
            setFiles(data || []);
        } catch (error) {
            console.error('Error al cargar archivos:', error);
            toast.error('Error al cargar archivos');
        }
    };

    const handleFileSelect = (event) => {
        const newFiles = event.target.files;
        if (!newFiles) return;

        const filesWithDescription = Array.from(newFiles).map(file => ({
            file,
            description: ''
        }));
        setSelectedFiles(prev => [...prev, ...filesWithDescription]);

        // Limpiar el input para permitir seleccionar el mismo archivo nuevamente
        event.target.value = '';
    };

    const handleRemoveFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpdateDescription = (index, description) => {
        setSelectedFiles(prev => prev.map((item, i) =>
            i === index ? { ...item, description } : item
        ));
    };

    const handleUploadFiles = async () => {
        if (selectedFiles.length === 0) {
            toast.error('No hay archivos seleccionados');
            return;
        }

        setUploadingFiles(true);

        try {
            const uploadPromises = selectedFiles.map(({ file, description }) =>
                uploadFileToPerson(file, personId, description || '')
            );

            await Promise.all(uploadPromises);

            toast.success('Archivos subidos exitosamente');
            setSelectedFiles([]);
            setShowFileUpload(false);
            await fetchFiles();
        } catch (error) {
            console.error('Error al subir archivos:', error);
            toast.error('Error al subir archivos');
        } finally {
            setUploadingFiles(false);
        }
    };

    const handleDeleteFile = async (fileId, fileName) => {
        if (!confirm(`¿Estás seguro de eliminar "${fileName}"?`)) {
            return;
        }

        try {
            await deleteFile(fileId);
            toast.success('Archivo eliminado');
            await fetchFiles();
        } catch (error) {
            console.error('Error al eliminar archivo:', error);
            toast.error('Error al eliminar archivo');
        }
    };

    return {
        files,
        fileUrls,
        selectedFiles,
        uploadingFiles,
        showFileUpload,
        setShowFileUpload,
        handleFileSelect,
        handleRemoveFile,
        handleUpdateDescription,
        handleUploadFiles,
        handleDeleteFile,
        fetchFiles
    };
};

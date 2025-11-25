import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Función para subir archivos a un reporte específico
export const uploadFile = async (file, reportId, description = '') => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);

    const response = await fetch(`${API_URL}/api/uploads/${reportId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al subir el archivo');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Función para subir archivos a un reporte con descripción
export const uploadFileToReport = async (file, reportId, description = '') => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);

    const response = await fetch(`${API_URL}/uploads/${reportId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al subir el archivo');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error uploading file to report:', error);
    throw error;
  }
};

// Función para subir archivos a una persona con descripción
export const uploadFileToPerson = async (file, personId, description = '') => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);

    const response = await fetch(`${API_URL}/uploads/person/${personId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al subir el archivo');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error uploading file to person:', error);
    throw error;
  }
};

// Función para obtener la URL de un archivo
export const getFileUrl = (filename) => {
  return `${API_URL}/api/files/${filename}`;
};

// Función para obtener la URL de un archivo con token de autenticación
export const getAuthenticatedFileUrlDirect = (filename) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return null;
  }
  return `${API_URL}/api/files/${filename}?token=${token}`;
};

// Función para obtener un archivo con autenticación y convertirlo a blob URL
export const getAuthenticatedFileUrl = async (filename) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }

    const response = await fetch(`${API_URL}/api/files/${filename}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener el archivo');
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error getting authenticated file:', error);
    return null;
  }
};

// Función para obtener la URL de un archivo con autenticación sin convertir a blob
export const getAuthenticatedFileUrlNonBlob = async (filename) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }

    const response = await fetch(`${API_URL}/api/files/${filename}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener el archivo');
    }

    // Retornar la URL de la respuesta directamente
    return response.url;
  } catch (error) {
    console.error('Error getting authenticated file URL:', error);
    return null;
  }
};

// Función para eliminar un archivo
export const deleteFile = async (fileId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }

    const response = await fetch(`${API_URL}/api/files/${fileId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al eliminar el archivo');
    }

    const data = await response.json();
    alert('Archivo eliminado con éxito');
    return data;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

// Función para validar tipos de archivo permitidos
export const validateFileType = (file) => {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];

  return allowedTypes.includes(file.type);
};

// Función para validar el tamaño del archivo (máximo 10MB)
export const validateFileSize = (file) => {
  const maxSize = 10 * 1024 * 1024; // 10MB en bytes
  return file.size <= maxSize;
};

// Función para formatear el tamaño del archivo
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Función para obtener el tipo de archivo basado en la extensión
export const getFileType = (filename) => {
  if (!filename || typeof filename !== 'string') {
    return 'other';
  }

  const extension = filename.split('.').pop().toLowerCase();

  const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
  const documentTypes = ['pdf', 'doc', 'docx', 'txt'];

  if (imageTypes.includes(extension)) {
    return 'image';
  } else if (documentTypes.includes(extension)) {
    return 'document';
  } else {
    return 'other';
  }
};
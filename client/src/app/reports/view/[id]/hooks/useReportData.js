import { useState, useEffect, useCallback } from 'react';
import { getReportById } from '../../../../../../hooks/handleReports';
import { getAuthenticatedFileUrl } from '../../../../../../hooks/handleFiles';
import { handleError } from '../../../../../../hooks/toaster';

export const useReportData = (reportId) => {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fileUrls, setFileUrls] = useState({});

    const loadFileUrls = useCallback(async (files) => {
        if (!files || files.length === 0) {
            setFileUrls({});
            return;
        }

        const urls = {};
        for (const file of files) {
            const filename = extractFilename(file);
            if (filename) {
                const url = await getAuthenticatedFileUrl(filename);
                if (url) {
                    urls[file.id] = url;
                }
            }
        }
        setFileUrls(urls);
    }, []);

    const extractFilename = (file) => {
        if (file.filename) return file.filename;
        if (file.path) {
            const pathParts = file.path.split(/[\/\\]/);
            return pathParts[pathParts.length - 1];
        }
        return null;
    };

    const fetchReport = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getReportById(reportId);
            setReport(data);
            await loadFileUrls(data.files);
        } catch (err) {
            handleError('Error al cargar el informe');
        } finally {
            setLoading(false);
        }
    }, [reportId, loadFileUrls]);

    const refreshReport = useCallback(async () => {
        const data = await getReportById(reportId);
        setReport(data);
        await loadFileUrls(data.files);
    }, [reportId, loadFileUrls]);

    useEffect(() => {
        if (reportId) {
            fetchReport();
        }
    }, [reportId, fetchReport]);

    return {
        report,
        loading,
        fileUrls,
        refreshReport,
        setReport,
    };
};

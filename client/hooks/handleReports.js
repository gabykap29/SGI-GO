const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function getReports(){
    const token = localStorage.getItem("token")
    const res = await fetch(apiUrl + "/api/reports", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    })
    const data = await res.json();
    if(!res.ok){
        return []
    }
    return data;
}

// Función para vincular una persona a un informe
export async function addPersonToReport(reportId, personId) {
    const token = localStorage.getItem("token");
    const res = await fetch(`${apiUrl}/api/reports/${reportId}/persons/${personId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    });
    
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al vincular persona al informe');
    }
    
    return await res.json();
}

// Función para desvincular una persona de un informe
export async function removePersonFromReport(reportId, personId) {
    const token = localStorage.getItem("token");
    const res = await fetch(`${apiUrl}/api/reports/${reportId}/persons/${personId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    });
    
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al desvincular persona del informe');
    }
    
    return await res.json();
} 

export async function getReportById(id){
    const token = localStorage.getItem("token")
    const res = await fetch(apiUrl + `/api/reports/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    })
    const data = await res.json();
    if(!res.ok){
        return null
    }
    return data;
}

export async function CreateReport(reportData){
    const token = localStorage.getItem("token")
    const res = await fetch(apiUrl + "/api/reports", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
            department_id: parseInt(reportData.department_id),
            locality_id: parseInt(reportData.locality_id),
            date: reportData.date,
            type_report_id: parseInt(reportData.type_report_id),
            status: reportData.status,
            title: reportData.title,
            content: reportData.content,
            description: reportData.description || "Sin descripción" 
        })
    })
    const data = await res.json();
    if(!res.ok){
        return null
    }
    return data;
}

export async function UpdateReport(id, reportData){
    const token = localStorage.getItem("token")
    const res = await fetch(apiUrl + `/api/reports/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
            department_id: parseInt(reportData.department_id),
            locality_id: parseInt(reportData.locality_id),
            date: reportData.date,
            type_report_id: parseInt(reportData.type_report_id),
            status: reportData.status,
            title: reportData.title,
            content: reportData.content,
            description: reportData.description || "Sin descripción" 
        })
    })
    const data = await res.json();
    if(!res.ok){
        return null
    }
    return data;
}

// Función específica para actualizar solo el estado del reporte
export async function UpdateReportStatus(id, status){
    const token = localStorage.getItem("token")
    const res = await fetch(apiUrl + `/api/report/status/${id}?status=${status}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    })
    const data = await res.json();
    if(!res.ok){
        throw new Error(data.error || 'Error al actualizar el estado del reporte');
    }
    return data;
}
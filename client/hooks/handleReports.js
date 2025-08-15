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
const apiUrl = process.env.NEXT_PUBLIC_API_URL; 

export async function getDepartments() {
    const token = localStorage.getItem("token")
    const res = await fetch(apiUrl + "/api/departments", {
        method: "GET",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    })
    const data = await res.json();
    if (!res.ok){
        return []
    }
    return data;
}
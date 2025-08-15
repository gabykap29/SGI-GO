const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function loginUser({username, password}) {
    const res = await fetch(apiUrl + "/login", {
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username, 
            pass: password
        })
    })
    const data = await res.json();
    if(!res.ok){
        return {"error": data.error}
    }

    localStorage.setItem("token", data.token)
    localStorage.setItem("userRole", data.role)
    return data;
}

export function logoutUser() {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    window.location.href = "/";
}
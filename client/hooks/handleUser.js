const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function getUsername() {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("No token found");
    }
    
    const res = await fetch(apiUrl + "/api/user/getUsername", {
        method: "GET",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    });
    
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.error || "Error al obtener el username");
    }
    console.log(data);
    return data.user;
}

// Obtener todos los usuarios
export async function getUsers() {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("No token found");
    }
    
    const res = await fetch(apiUrl + "/api/users", {
        method: "GET",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    });
    
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.error || "Error al obtener usuarios");
    }
    return data;
}

// Obtener usuario por ID
export async function getUserById(id) {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("No token found");
    }
    
    const res = await fetch(apiUrl + `/api/user/${id}`, {
        method: "GET",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    });
    
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.error || "Error al obtener usuario");
    }
    return data.user;
}

// Crear nuevo usuario
export async function createUser(userData) {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("No token found");
    }
    
    const res = await fetch(apiUrl + "/api/users", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(userData)
    });
    
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.error || "Error al crear usuario");
    }
    return data;
}

// Actualizar usuario
export async function updateUser(id, userData) {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("No token found");
    }
    
    const res = await fetch(apiUrl + `/api/users/${id}`, {
        method: "PUT",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(userData)
    });
    
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.error || "Error al actualizar usuario");
    }
    return data;
}

// Eliminar usuario
export async function deleteUser(id) {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("No token found");
    }
    
    const res = await fetch(apiUrl + `/api/users/${id}`, {
        method: "DELETE",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    });
    
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.error || "Error al eliminar usuario");
    }
    return data;
}
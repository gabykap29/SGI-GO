const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Obtener todas las personas
export const getPersons = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/persons`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener personas:', error);
    throw error;
  }
};

// Obtener persona por ID
export const getPersonById = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/persons/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener persona por ID:', error);
    throw error;
  }
};

// Buscar persona por DNI
export const getPersonByDni = async (dni) => {
  try {
    const persons = await getPersons();
    const person = persons.find(p => p.dni === dni);
    return person || null;
  } catch (error) {
    console.error('Error al buscar persona por DNI:', error);
    throw error;
  }
};

// Alias para compatibilidad
export const searchPersonByDni = getPersonByDni;

// Crear nueva persona
export const createPerson = async (personData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/persons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(personData),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al crear persona:', error);
    throw error;
  }
};

// Actualizar persona
export const updatePerson = async (id, personData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/persons/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(personData),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al actualizar persona:', error);
    throw error;
  }
};

// Eliminar persona
export const deletePerson = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/persons/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return { message: 'Persona eliminada exitosamente' };
  } catch (error) {
    console.error('Error al eliminar persona:', error);
    throw error;
  }
};
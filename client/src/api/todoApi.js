const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const handleResponse = async (response) => {
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
    }

    return data;
};

export const getTodos = async () => {
    const response = await fetch(`${API_URL}/todos`);

    return handleResponse(response);
};

export const createTodo = async (todo) => {
    const response = await fetch(`${API_URL}/todos`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(todo)
    });

    return handleResponse(response);
};

export const updateTodo = async (id, todo) => {
    const response = await fetch(`${API_URL}/todos/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(todo)
    });

    return handleResponse(response);
};

export const toggleTodo = async (id) => {
    const response = await fetch(`${API_URL}/todos/${id}/done`, {
        method: "PATCH"
    });

    return handleResponse(response);
};

export const deleteTodo = async (id) => {
    const response = await fetch(`${API_URL}/todos/${id}`, {
        method: "DELETE"
    });

    return handleResponse(response);
};
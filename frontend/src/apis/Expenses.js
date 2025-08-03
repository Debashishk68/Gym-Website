import API_BASE_URL from "../config/api.js";

export const AddExpense = async (expense) => {
    const response = await fetch(`${API_BASE_URL}/expenses/add-expenses`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(expense),
        credentials: "include", // Include cookies for authentication
    });

        const data = await response.json();

    
    if (!response.ok) {
        throw new Error(data.message || "Failed to add expense");
    }

    return data;
}

export const GetExpenses = async (month, year) => {
    const response = await fetch(`${API_BASE_URL}/expenses?month=${month}&year=${year}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for authentication
    });

    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch expenses");
    }

    return data;
}


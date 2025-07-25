import API_BASE_URL from "../config/api";

export const getInvoices = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard/get-invoices`, {
      method: "GET",
      credentials: "include", 
      headers: {
        "Content-Type": "application/json",
      },
    });

    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch invoices");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in getInvoices:", error.message);
    throw error; 
  }
};

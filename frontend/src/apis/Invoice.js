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

export const GenerateInvoice = async (data) => {

  try {
    const response = await fetch(`${API_BASE_URL}/dashboard/invoice-generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data), 
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to generate invoices");
    }

    const result = await response.json(); 
    return result;
  } catch (error) {
    console.error("Error in generating invoice:", error.message);
    throw error;
  }
};


import API_BASE_URL from "../config/api";

export const AddSupplement = async (supplementData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/suppliment/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(supplementData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to add supplement");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const GetAllSupplements = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/suppliment`, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch supplements");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const getSupplementById = async ({ id }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/suppliment/${id}`, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch supplement");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const EditSupplement = async (id, updatedData) => {
  
  try {
    const response = await fetch(`${API_BASE_URL}/suppliment/edit/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(updatedData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to update supplement");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const DeleteSupplement = async (id) => {
  console.log(id)
  try {
    const response = await fetch(`${API_BASE_URL}/suppliment/delete/${id}`, {
      method: "POST",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to delete supplement");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const sellSupplement = async (saleData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/suppliment/sell-supplement`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(saleData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to sell supplement");
    }

    return data;
  } catch (error) {
    throw error;
  }
};
import API_BASE_URL from "../config/api";

export const dashboardApi = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Login failed");
    }

    return data;
  } catch (error) {
    throw error;
  }
};
export const membersApi = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard/members`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Login failed");
    }

    return data;
  } catch (error) {
    throw error;
  }
};
export const membersInfoApi = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard/membersinfo/${id}`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Login failed");
    }

    return data;
  } catch (error) {
    throw error;
  }
};
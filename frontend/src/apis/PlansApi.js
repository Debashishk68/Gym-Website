import API_BASE_URL from "../config/api";

export const plansApi = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard/get-plans`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    return data;
  } catch (error) {
    throw error;
  }
};
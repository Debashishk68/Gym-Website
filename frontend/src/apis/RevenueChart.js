import API_BASE_URL from "../config/api";

export const RevenueChartApi = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard/revenue-chart`, {
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
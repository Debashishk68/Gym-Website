import API_BASE_URL from "../config/api.js";

export const RevenueChartApi = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard/revenue-chart`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "cannot get revenue chart");
    }

    return data;
  } catch (error) {
    throw error;
  }
};
export const ClientTrendsApi = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard/getclient-trends`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "cannot get client chart");
    }

    return data;
  } catch (error) {
    throw error;
  }
};
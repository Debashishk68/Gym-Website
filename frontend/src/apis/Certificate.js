import API_BASE_URL from "../config/api";

export const certificateApi = async (data) => {
  const { name, course, date, weightcategory, weightlift, place } = data;
  try {
    const response = await fetch(`${API_BASE_URL}/api/certificate/generate`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        course,
        date,
        weightcategory,
        weightlift,
        place,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Cannot Generate Certificate");
    }

    return await response.blob(); // since it's a downloadable image
  } catch (error) {
    throw error;
  }
};

export const IdCard = async (data) => {
  try {
    const id = data;
    const response = await fetch(
      `${API_BASE_URL}/api/certificate/generate-id/${id}`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Cannot Generate Id Card");
    }
  
    return await response.blob();
  } catch (error) {
    throw error;
  }
};

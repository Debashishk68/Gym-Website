import API_BASE_URL from "../config/api"
export const AddMember = async (data) => {
  const formData = new FormData(); 
  formData.append("fullname", data.formData.name);
  formData.append("email", data.formData.email);
  formData.append("phone", data.formData.phone);
  formData.append("file", data.formData.profileImage); // should be a File/Blob
  formData.append("age", data.formData.age);
  formData.append("gender", data.formData.gender);
  formData.append("plan", data.formData.membershipType);
  formData.append("planPrice", data.membershipPrice);
  formData.append("emergencyContact", data.formData.emergencyContact);
  formData.append("status", data.formData.status);
  formData.append("address", data.formData.address);
  formData.append("notes", data.formData.notes);


  try {
    const response = await fetch(`${API_BASE_URL}/dashboard/add-profile`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to add member");
    }

    return responseData;
  } catch (error) {
    console.error("Error in AddMember:", error);
    throw error;
  }
};

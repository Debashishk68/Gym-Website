import API_BASE_URL from "../config/api";
export const AddMember = async (data) => {
  const formData = new FormData();
  formData.append("fullname", data.formData.name);
  formData.append("email", data.formData.email);
  formData.append("phone", data.formData.phone);
  formData.append("fathersname", data.formData.fathersname);
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

export const EditMember = async ({ id, data, planPrice,renewPlan }) => {
  console.log(data)
  const formData = new FormData();
  formData.append("fullname", data.name);
  formData.append("email", data.email);
  formData.append("phone", data.phone);
  formData.append("fathersname", data.fathersname);
  formData.append("age", data.age);
  formData.append("gender", data.gender);
  formData.append("plan", data.membershipType);
  formData.append("planPrice", planPrice);
  formData.append("emergencyContact", data.emergencyContact);
  formData.append("status", data.status);
  formData.append("address", data.address);
  formData.append("notes", data.notes);
  formData.append("renewPlan",renewPlan);

  if (data.profileImage instanceof File) {
    formData.append("file", data.profileImage);
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/dashboard/update-profile/${id}`,
      {
        method: "POST",
        body: formData,
        credentials: "include",
      }
    );

    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.message || "Failed to update member");
    }
    return responseData;
  } catch (error) {
    console.error("Error in EditMember:", error);
    throw error;
  }
};



import API_BASE_URL from "../config/api.js";

// Send OTP API
export const sendOtpApi = async (email) => {
  const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(email),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to send OTP");
  }
  return data;
};

// Verify OTP API
export const verifyOtpApi = async (email, otp) => {
  const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, otp }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to verify OTP");
  }
  return data;
};

// Reset Password API
export const ChangePassApi = async (token, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to reset password");
  }
  return data;
};

import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import TextInput from "../../components/TextInput.jsx";
import AppHeader from "../../components/AppHeader.jsx";
import { useEffect } from "react";
import { useResetPass } from "../../hooks/useForgotPassword.js";

const ResetPasswordPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { mutate: ResetPass, isLoading } = useResetPass();

  useEffect(() => {
    console.log(state);
    if (!state?.email && !state?.token) {
      toast.error("Email and token are required to reset password");
      navigate("/forgot-password");
    }
  }, [navigate, state]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword)
      return toast.error("Both fields are required");
    if (password !== confirmPassword)
      return toast.error("Passwords do not match");

    try {
      ResetPass(
        { token: state.token, password },
        {
          onSuccess: () => {
            toast.success("Password reset successful");
            setTimeout(() => {
              navigate("/");
            }, 2000);
          },
          onError: (err) => {
            toast.error(err.message || "Failed to reset password");
          },
        }
      );
    } catch (err) {
      toast.error(err.message || "Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fbfc]">
      <ToastContainer />
      <AppHeader />
      <div className="px-4 py-10 flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-4">Reset Password</h2>
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 rounded-lg shadow-md space-y-6"
        >
          <TextInput
            name="password"
            label="New Password"
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextInput
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full h-12 ${
              isLoading ? "bg-gray-400" : "bg-[#FFED00] hover:bg-[#d6c920]"
            } text-black font-medium rounded-lg transition`}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

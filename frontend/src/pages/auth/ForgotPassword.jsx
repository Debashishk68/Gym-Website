import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import AppHeader from "../../components/AppHeader.jsx";
import TextInput from "../../components/TextInput.jsx";
import { useSendOtp } from "../../hooks/useForgotPassword.js";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate: sendOtp } = useSendOtp();

  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      setError("Email is required");
    } else if (!emailRegex.test(value)) {
      setError("Invalid email format");
    } else {
      setError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      setError("Email is required");
      return;
    }

    if (error) return;

    setIsSubmitting(true);

    sendOtp(
      { email },
      {
        onSuccess: () => {
          toast.success("OTP sent to your email!");
          setTimeout(() => {
            navigate(`/verify-otp`, { state: { email } });
          }, 2000);
          setIsSubmitting(false);
        },
        onError: (err) => {
          toast.error(err?.response?.data?.message || "Failed to send OTP");
          setIsSubmitting(false);
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fbfc] text-[#0d181c] animate-fade-in">
      <ToastContainer className="absolute top-0 right-0 mt-4 mr-4" />
      <AppHeader />

      <div className="px-4 py-10 flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-4">Forgot Your Password?</h2>
        <p className="text-gray-600 text-center max-w-md">
          Enter your registered email address below and we'll send you an OTP to
          reset your password.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 w-full max-w-md bg-white p-8 rounded-lg shadow-md space-y-6"
        >
          <TextInput
            name="email"
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChange={handleChange}
            error={error}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full h-12 ${
              isSubmitting ? "bg-gray-400" : "bg-[#FFED00] hover:bg-[#d6c920]"
            } text-black font-medium rounded-lg transition duration-300`}
          >
            {isSubmitting ? "Sending..." : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

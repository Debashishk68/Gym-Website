import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import TextInput from "../../components/TextInput.jsx";
import AppHeader from "../../components/AppHeader.jsx";
import { useEffect } from "react";
import { useVerifyOtp } from "../../hooks/useForgotPassword.js";

const VerifyOtpPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");

  const { mutate: verifyOtp } = useVerifyOtp();

  useEffect(() => {
    console.log(state);
    if (!state?.email) {
      toast.error("Email is required to verify OTP");
      navigate("/forgot-password");
    }
  }, [navigate,state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp) return toast.error("Please enter the OTP");

    try {
      verifyOtp({ email: state.email, otp },
      {
        onSuccess: (data) => {
          toast.success("OTP verified successfully");
          console.log(data);
          setTimeout(() => {
            navigate("/reset-password", { state: { email: state.email, token: data.token } });
          }, 2000);
        },
        onError: (err) => {
          console.error(err);
          toast.error(err?.message || "Failed to verify OTP");
        },
      }
      );

    } catch (err) {
      toast.error(err.message || "OTP verification failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fbfc]">
      <ToastContainer />
      <AppHeader />
      <div className="px-4 py-10 flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-4">Verify OTP</h2>
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 rounded-lg shadow-md space-y-6"
        >
          <TextInput
            name="otp"
            label="Enter OTP"
            placeholder="Enter OTP sent to your email"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            type="submit"
            className="w-full h-12 bg-[#FFED00] hover:bg-[#d6c920] text-black font-medium rounded-lg transition"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtpPage;

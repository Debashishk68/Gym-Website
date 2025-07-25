import { useEffect, useState } from "react";
import AppHeader from "../../components/AppHeader";
import TextInput from "../../components/TextInput";
import sushilghimire from "../../assets/sushil-ghimire.jpg";
import { useLogin } from "../../hooks/useAuth"; // your custom mutation hook
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; 


const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
 const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});
  const {
    mutate: Login,
    isPending,
    isError,
    error: Error,
    isSuccess,
  } = useLogin();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setFormErrors((prev) => ({
        ...prev,
        email: value
          ? emailRegex.test(value)
            ? ""
            : "Invalid email format"
          : "Email is required",
      }));
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.email) errors.email = "Email is required";
    if (!formData.password) errors.password = "Password is required";

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      Login(formData); 
    }
  };

  useEffect(() => {
    if (isError) toast.error(`Login failed! ${Error.message}`);
    if (isSuccess) {
      toast.success("Login successful!");
      navigate("/dashboard");
    }
  }, [isError, isSuccess]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fbfc] text-[#0d181c] animate-fade-in">
      <ToastContainer className="absolute top-0 right-0 mt-4 mr-4" />
      <AppHeader />

      <div className="px-4 py-8">
        <h2 className="text-3xl font-bold text-center">Welcome Back</h2>

        <div className="flex flex-col-reverse lg:flex-row items-center justify-center mt-8 gap-10">
          <form
            onSubmit={onSubmit}
            className="w-full max-w-md mx-auto p-8 space-y-6 bg-white rounded-lg shadow-md"
          >
            <TextInput
              name="email"
              label="Email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              error={formErrors.email}
            />

            <TextInput
              name="password"
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              error={formErrors.password}
            />

            <div className="text-left">
              <button
                type="button"
                className="text-sm text-[#49879c] underline hover:text-blue-600 transition duration-300"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className={`w-full h-12 ${
                isPending ? "bg-gray-400" : "bg-[#FFED00] hover:bg-[#d6c920]"
              } text-black font-medium rounded-lg transition duration-300`}
            >
              {isPending ? "Logging in..." : "Log In"}
            </button>
          </form>

          <img
            src={sushilghimire}
            alt="Login Visual"
            className="w-[32rem] h-[25rem] object-cover rounded-3xl shadow-lg hidden lg:block"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

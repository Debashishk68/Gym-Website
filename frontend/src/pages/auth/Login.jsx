import { useState } from "react";
import AppHeader from "../../components/AppHeader";
import TextInput from "../../components/TextInput";
import sushilghimire from "../../assets/sushil-ghimire.jpg";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setFormErrors((prev) => ({
      ...prev,
      email: value
        ? emailRegex.test(value)
          ? ""
          : "Invalid email format"
        : "Email is required",
    }));
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const errors = {};
    if (!formData.email) errors.email = "Email is required";
    if (!formData.password) errors.password = "Password is required";

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      console.log("Login Data:", formData);
      // dispatch(login(formData));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fbfc] text-[#0d181c] animate-fade-in">
      <AppHeader />

      <div className="px-4 py-8">
        <h2 className="text-3xl font-bold text-center">Welcome Back!</h2>

        <div className="flex flex-col lg:flex-row items-center justify-center mt-8 gap-30">
          {/* Login Form */}
          <form
            onSubmit={onSubmit}
            className="w-full max-w-md px-4 sm:px-0 p-6 space-y-6 transition-all duration-300 rounded-xl"
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
              className="w-full h-12 bg-[#FFED00] hover:bg-[#d6c920] text-black font-medium rounded-lg transition duration-300"
            >
              Log In
            </button>
          </form>

          {/* Image */}
          <img
            src={sushilghimire}
            alt="Login Visual"
            className="hidden lg:block w-[40vw] h-[29vw] object-cover rounded-3xl"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

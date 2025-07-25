// src/pages/Logout.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../../hooks/useAuth";

const Logout = () => {
  const { mutate: logout, isSuccess } = useLogout();
  const navigate = useNavigate();

  useEffect(() => {
    logout(); 
  }, [logout]);

  // 2. After logout is successful, clear everything
  useEffect(() => {
    if (isSuccess) {
      localStorage.clear();
      sessionStorage.clear();
      navigate("/");
    }
  }, [isSuccess, navigate]);

  return null;
};

export default Logout;

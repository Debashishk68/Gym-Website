import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/auth/Login";
import DashboardPage from "./pages/private/Dashboard";
import MembersPage from "./pages/private/MembersPage";
import MemberInfo from "./pages/private/MemberInfo";
import AddMemberPage from "./pages/private/AddMember";
import GenerateCertificate from "./pages/private/GenerateCertificate";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/members" element={<MembersPage />} />
      <Route path="/membersinfo/:memberId" element={<MemberInfo />} />
      <Route path="/add-member" element={<AddMemberPage />} />
      <Route path="/generate-certificate" element={<GenerateCertificate/>} />
    </Routes>
  );
};

export default App;

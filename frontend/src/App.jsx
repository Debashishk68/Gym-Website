import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/auth/Login";
import DashboardPage from "./pages/private/Dashboard";
import MembersPage from "./pages/private/MembersPage";
import MemberInfo from "./pages/private/MemberInfo";
import AddMemberPage from "./pages/private/AddMember";
import GenerateCertificate from "./pages/private/GenerateCertificate";
import RevenueTrends from "./pages/private/Stats";
import EditMemberForm from "./pages/private/EditPage";
import Logout from "./pages/auth/Logout";
import Invoices from "./pages/private/Invoices";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/members" element={<MembersPage />} />
      <Route path="/membersinfo/:memberId" element={<MemberInfo />} />
      <Route path="/add-member" element={<AddMemberPage />} />
      <Route path="/generate-certificate" element={<GenerateCertificate />} />
      <Route path="/stats" element={<RevenueTrends />} />
      <Route path="/edit-profile/:id" element={<EditMemberForm />} />
      {/* <Route path="/invoices" elememt={<h1>invoices</h1>}/> */}
            <Route path="/invoices" element={<Invoices />} />

            <Route path="*" element={<h1>Page not found</h1>} />

      <Route path="/logout" element={<Logout />} />
    </Routes>
  );
};

export default App;

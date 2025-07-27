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
import ClientJoinTrends from "./pages/private/ClientJoinTrends";
import DietPlan from "./pages/private/DietPlan";
import AddSupplement from "./pages/private/AddSuppliment";
import SellSupplement from "./pages/private/SellSuppliment";
import SupplementStock from "./pages/private/Stock";
import EditSupplement from "./pages/private/EditRoute";
import PageNotFound from "./pages/PageNotFound";
// import NotLoggedIn from "./pages/NotLogin";

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
      <Route path="/invoices" element={<Invoices />} />
      <Route path="/student-trends" element={<ClientJoinTrends />} />
      <Route path="/diet-plans" element={<DietPlan />} />
      <Route path="/add-supplement" element={<AddSupplement />} />
      <Route path="/sell-supplement" element={<SellSupplement />} />
      <Route path="/stock" element={<SupplementStock />} />
      <Route path="/edit/:id" element={<EditSupplement />} />
      {/* <Route path="/not-login" element={<NotLoggedIn />} /> */}

      <Route path="*" element={<PageNotFound />} />

      <Route path="/logout" element={<Logout />} />
    </Routes>
  );
};

export default App;

import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/auth/Login.jsx";
import DashboardPage from "./pages/private/Dashboard.jsx";
import MembersPage from "./pages/private/MembersPage.jsx";
import MemberInfo from "./pages/private/MemberInfo.jsx";
import AddMemberPage from "./pages/private/AddMember.jsx";
import GenerateCertificate from "./pages/private/GenerateCertificate.jsx";
import RevenueTrends from "./pages/private/Stats.jsx";
import EditMemberForm from "./pages/private/EditPage.jsx";
import Logout from "./pages/auth/Logout.jsx";
import Invoices from "./pages/private/Invoices.jsx";
import ClientJoinTrends from "./pages/private/ClientJoinTrends.jsx";
import DietPlan from "./pages/private/DietPlan.jsx";
import AddSupplement from "./pages/private/AddSuppliment.jsx";
import SellSupplement from "./pages/private/SellSuppliment.jsx";
import SupplementStock from "./pages/private/Stock.jsx";
import EditSupplement from "./pages/private/EditRoute.jsx";
import PageNotFound from "./pages/PageNotFound.jsx";
import SupplementInvoice from "./pages/private/SupplimentInvoice.jsx";
import ForgotPasswordPage from "./pages/auth/ForgotPassword.jsx";
import VerifyOtpPage from "./pages/auth/VerifyOtp.jsx";
import ResetPasswordPage from "./pages/auth/ResetPassword.jsx";
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
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/verify-otp" element={<VerifyOtpPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/sell-invoice" element={<SupplementInvoice />} />
      <Route path="/stock" element={<SupplementStock />} />
      <Route path="/edit/:id" element={<EditSupplement />} />
      {/* <Route path="/not-login" element={<NotLoggedIn />} /> */}

      <Route path="*" element={<PageNotFound />} />

      <Route path="/logout" element={<Logout />} />
    </Routes>
  );
};

export default App;

import { Route, Routes } from "react-router-dom";

// Auth Pages
import LoginPage from "./pages/auth/Login.jsx";
import ForgotPasswordPage from "./pages/auth/ForgotPassword.jsx";
import VerifyOtpPage from "./pages/auth/VerifyOtp.jsx";
import ResetPasswordPage from "./pages/auth/ResetPassword.jsx";
import Logout from "./pages/auth/Logout.jsx";

// Dashboard & Members
import DashboardPage from "./pages/private/Dashboard.jsx";
import MembersPage from "./pages/private/MembersPage.jsx";
import MemberInfo from "./pages/private/MemberInfo.jsx";
import AddMemberPage from "./pages/private/AddMember.jsx";
import EditMemberForm from "./pages/private/EditPage.jsx";

// Supplements
import AddSupplement from "./pages/private/AddSuppliment.jsx";
import SellSupplement from "./pages/private/SellSuppliment.jsx";
import SupplementStock from "./pages/private/Stock.jsx";
import EditSupplement from "./pages/private/EditRoute.jsx";
import SupplementInvoice from "./pages/private/SupplimentInvoice.jsx";

// Expenses
import AddExpense from "./pages/private/AddExpenses.jsx";
import MonthlyExpenses from "./pages/private/Expenses.jsx";

// Stats & Certificates
import GenerateCertificate from "./pages/private/GenerateCertificate.jsx";
import RevenueTrends from "./pages/private/Stats.jsx";
import ClientJoinTrends from "./pages/private/ClientJoinTrends.jsx";

// Diet Plan
import DietPlan from "./pages/private/DietPlan.jsx";

// Invoices
import Invoices from "./pages/private/Invoices.jsx";

// Fallback
import PageNotFound from "./pages/PageNotFound.jsx";
// import NotLoggedIn from "./pages/NotLogin.jsx";

const App = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/verify-otp" element={<VerifyOtpPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/logout" element={<Logout />} />

      {/* Dashboard */}
      <Route path="/dashboard" element={<DashboardPage />} />

      {/* Member Management */}
      <Route path="/members" element={<MembersPage />} />
      <Route path="/membersinfo/:memberId" element={<MemberInfo />} />
      <Route path="/add-member" element={<AddMemberPage />} />
      <Route path="/edit-profile/:id" element={<EditMemberForm />} />

      {/* Supplement Management */}
      <Route path="/add-supplement" element={<AddSupplement />} />
      <Route path="/sell-supplement" element={<SellSupplement />} />
      <Route path="/stock" element={<SupplementStock />} />
      <Route path="/edit/:id" element={<EditSupplement />} />
      <Route path="/sell-invoice" element={<SupplementInvoice />} />

      {/* Expense Management */}
      <Route path="/add-expense" element={<AddExpense />} />
      <Route path="/monthly-expenses" element={<MonthlyExpenses />} />

      {/* Stats & Certificates */}
      <Route path="/generate-certificate" element={<GenerateCertificate />} />
      <Route path="/stats" element={<RevenueTrends />} />
      <Route path="/student-trends" element={<ClientJoinTrends />} />

      {/* Diet Plans */}
      <Route path="/diet-plans" element={<DietPlan />} />

      {/* Invoices */}
      <Route path="/invoices" element={<Invoices />} />

      {/* Fallback */}
      {/* <Route path="/not-login" element={<NotLoggedIn />} /> */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default App;

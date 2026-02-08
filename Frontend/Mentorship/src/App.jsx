import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MentorDashboard from "./pages/MentorDashboard";
import MentorListing from "./pages/MentorListing";
import MentorProfile from "./pages/MentorProfile";
import Requests from "./pages/Requests";
import MyMentors from "./pages/MyMentors";
import AdminDashboard from "./pages/AdminDashboard";
import Settings from "./pages/Settings";
import Unauthorized from "./pages/Unauthorized";

function LandingLayout() {
  return (
    <>
      <Outlet />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-center" reverseOrder={false} />
          <Routes>
            {/* Landing page with Navbar and Footer */}
            <Route element={<LandingLayout />}>
              <Route path="/" element={<Landing />} />
            </Route>

            {/* Auth pages - NO Navbar/Footer */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected Routes - NO Navbar/Footer */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/browse-mentors" element={<MentorListing />} />
              <Route path="/mentor/:id" element={<MentorProfile />} />
              <Route path="/mentor-profile/:id" element={<MentorProfile />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/my-mentors" element={<MyMentors />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* Mentor Routes - NO Navbar/Footer */}
            <Route element={<ProtectedRoute requiredRole="mentor" />}>
              <Route path="/mentor/dashboard" element={<MentorDashboard />} />
            </Route>

            {/* Admin Routes - NO Navbar/Footer */}
            <Route element={<ProtectedRoute requiredRole="admin" />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

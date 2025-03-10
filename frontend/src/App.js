import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./components/css/style.css";
import "./components/css/satoshi.css";
import HomePage from "./pages/Home_page";
import BusinessRegistrationPage from "./pages/BusinessRegistration_page";
import BusinessManagement from "./pages/BusinessManagement_page";
import ImportArchives from "./pages/ImportArchives_page";
import TablePage from "./pages/Table_page";
import SavedFiles from "./pages/SavedFiles_page"; // Import the new page
import AuthForm from "./components/auth/AuthForm";
import ForgotPassword from "./components/auth/ForgotPassword";
import UserManagement from "./pages/UserManagement";
import DefaultLayout from "./pages/Layout/DefaultLayout";
import BusinessDetails from "./pages/BusinessDetails_page"; // Import the new page

// Function to check if user is authenticated
const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return token && token.length > 10; // Ensure the token is valid
};

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? <DefaultLayout>{children}</DefaultLayout> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root path based on authentication */}
        <Route path="/" element={<Navigate to={isAuthenticated() ? "/home" : "/login"} replace />} />

        {/* Public Routes */}
        <Route path="/login" element={<AuthForm formType="login" />} />
        <Route path="/signup" element={<AuthForm formType="signup" />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Routes>
              <Route path="/business/:businessId" element={<BusinessDetails />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/businessRegistration" element={<BusinessRegistrationPage />} />
                <Route path="/BusinessManagement" element={<BusinessManagement />} />
                <Route path="/importArchives" element={<ImportArchives />} />
                <Route path="/tablePage" element={<TablePage />} />
                <Route path="/userManagement" element={<UserManagement />} />
                <Route path="/savedFiles" element={<SavedFiles />} /> {/* New Route */}
                <Route path="*" element={<Navigate to="/home" />} />
              </Routes>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

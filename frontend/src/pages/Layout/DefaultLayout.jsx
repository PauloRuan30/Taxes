import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useNavigate } from "react-router-dom";

const DefaultLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem("token", token);
    setIsLoggedIn(true);
    navigate("/"); // Redirect after login
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark flex h-screen">
      {/* Sidebar - Only shown if logged in */}
      {isLoggedIn && <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}

      {/* Main Content Area */}
      <div
        className={`dark:bg-boxdark-2 dark:text-bodydark flex flex-1 flex-col transition-all duration-300 ease-in-out ${
          isLoggedIn ? (sidebarOpen ? "ml-64" : "ml-20") : ""
        }`}
      >
        {/* Header - Only shown if logged in */}
        {isLoggedIn && (
          <Header
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            isLoggedIn={isLoggedIn}
            handleLogin={handleLogin}
            handleLogout={handleLogout}
          />
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default DefaultLayout;

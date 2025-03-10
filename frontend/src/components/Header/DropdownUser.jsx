import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ClickOutside from "../ClickOutside";

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token") // Use 'token' instead of 'authToken'
  );

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("token"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Ensure token key is used consistently
    setIsAuthenticated(false);
    navigate("/login"); // Redirect to login page
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black dark:text-white">
            {isAuthenticated ? "User Name" : "Guest"}
          </span>
          <span className="block text-xs">
            {isAuthenticated ? "Authenticated" : "Not Logged In"}
          </span>
        </span>
        <span className="h-12 w-12 rounded-full">
          <img src=".s/images/user/user-01.png" alt="User" />
        </span>
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-4 w-64 rounded-sm border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
          <ul className="border-b border-stroke dark:border-strokedark px-6 py-7.5">
            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/profile" className="flex items-center gap-3.5 text-sm font-medium hover:text-primary">
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link to="/settings" className="flex items-center gap-3.5 text-sm font-medium hover:text-primary">
                    Account Settings
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="w-full text-left px-6 py-4 text-sm font-medium hover:text-primary">
                    Log Out
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login" className="flex items-center gap-3.5 text-sm font-medium hover:text-primary">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </ClickOutside>
  );
};

export default DropdownUser;

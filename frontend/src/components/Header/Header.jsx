import React from "react";
import { Link } from "react-router-dom";
import DropdownNotification from "./DropdownNotification";
import DropdownUser from "./DropdownUser";
import DarkModeSwitcher from "./DarkModeSwitcher";

const Header = ({ sidebarOpen, setSidebarOpen, isLoggedIn, handleLogin, handleLogout }) => {
  return (
    <header className="sticky top-0 z-900 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-2 py-2 shadow-2 md:px-6 2xl:px-9">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* Toggle do Sidebar */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(!sidebarOpen);
            }}
            className="lg:hidden rounded-sm p-2 text-gray-600 dark:text-white focus:outline-none hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <span className="block">
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </span>
          </button>

          {/* Logo */}
          <Link to="/" className="block flex-shrink-0 lg:hidden">
            <img src="./images/logo/logo-icon.svg" alt="Logo" />
          </Link>
        </div>

        <div className="hidden sm:block">
          <form>
            <div className="relative">
              {/* Campo de busca ou outros elementos */}
            </div>
          </form>
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            <DarkModeSwitcher />  
            <DropdownNotification />
          </ul>
          {/* Ícone do usuário agora contém Login/Logout */}
          <DropdownUser isLoggedIn={isLoggedIn} handleLogin={handleLogin} handleLogout={handleLogout} />
        </div>
      </div>
    </header>
  );
};

export default Header;

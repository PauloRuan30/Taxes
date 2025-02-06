import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  FolderOpenIcon,
  UserIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  DocumentTextIcon, // New icon for Saved Files
} from "@heroicons/react/24/outline";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const { pathname } = location;
  const navigate = useNavigate();

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("authToken") // Verifica se o usuário está autenticado
  );

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove token de autenticação
    setIsAuthenticated(false);
    navigate("/login"); // Redireciona para a página de login
  };

  const navLinks = [
    { title: "Início", url: "/", icon: <HomeIcon className="h-5 w-5" /> },
    { title: "Operações", url: "/importArchives", icon: <FolderOpenIcon className="h-5 w-5" /> },
    { title: "User Management", url: "/userManagement", icon: <UserIcon className="h-5 w-5" /> },
    { title: "Empresas", url: "/BusinessManagement", icon: <CogIcon className="h-5 w-5" /> },
    { title: "Arquivos Salvos", url: "/savedFiles", icon: <DocumentTextIcon className="h-5 w-5" /> }, // New link
  ];

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`fixed left-0 top-0 z-50 h-screen ${
        sidebarExpanded ? "w-64" : "w-20"
      } flex flex-col bg-gray-800 text-white transition-all duration-300 ease-in-out`}
    >
      <div className="flex items-center justify-center px-4 py-5 border-b border-gray-700">
        <NavLink to="/">
          <img
            src="/Logo.png"
            alt="Logo"
            className={`transition-all duration-300 ${
              sidebarExpanded ? "block" : "hidden"
            }`}
          />
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarExpanded(!sidebarExpanded)}
          aria-controls="sidebar"
          aria-expanded={sidebarExpanded}
          className="text-gray-400 hover:text-white"
        >
          {sidebarExpanded ? (
            <svg
              className="w-7 h-7"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          ) : (
            <svg
              className="w-7 h-7"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          )}
        </button>
      </div>

      <nav className="mt-5 px-4">
        <h3 className="mb-4 text-sm font-semibold text-gray-400">
          {sidebarExpanded && "MENU"}
        </h3>
        <ul className="space-y-2">
          {navLinks.map((link, index) => (
            <li key={index}>
              <NavLink
                to={link.url}
                className={`flex items-center gap-5 px-2 py-2 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white ${
                  pathname === link.url ? "bg-gray-700 text-white" : ""
                }`}
              >
                {link.icon}
                <span className={`${sidebarExpanded ? "block" : "hidden"}`}>{link.title}</span>
              </NavLink>
            </li>
          ))}

          {/* Apenas botão de Logout */}
          {isAuthenticated && (
            <li>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-5 px-2 py-2 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span className={`${sidebarExpanded ? "block" : "hidden"}`}>Logout</span>
              </button>
            </li>
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

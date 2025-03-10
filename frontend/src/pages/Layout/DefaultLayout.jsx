import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";

const DefaultLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();
  const location = useLocation(); // Obtém a rota atual

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem("token", token);
    setIsLoggedIn(true);
    navigate("/"); // Redireciona após login
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login"); // Redireciona para login
  };

  // Define quais páginas não devem exibir o Header
  const hideHeaderOnPages = ["/tablePage"];

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark flex h-screen">
      {/* Sidebar - Apenas exibida se o usuário estiver logado */}
      {isLoggedIn && <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}

      {/* Área principal */}
      <div
        className={`dark:bg-boxdark-2 dark:text-bodydark flex flex-1 flex-col transition-all duration-300 ease-in-out ${
          isLoggedIn ? (sidebarOpen ? "ml-64" : "ml-20") : ""
        }`}
      >
        {/* Header - Oculto na TablePage */}
        {isLoggedIn && !hideHeaderOnPages.includes(location.pathname) && (
          <Header
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            isLoggedIn={isLoggedIn}
            handleLogin={handleLogin}
            handleLogout={handleLogout}
          />
        )}

        {/* Conteúdo da Página */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default DefaultLayout;

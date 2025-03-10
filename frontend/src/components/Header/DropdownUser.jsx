import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ClickOutside from "../ClickOutside";

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Verifica se o usuário está autenticado
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token") // Usa 'token' ao invés de 'authToken'
  );

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("token"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Garante o uso consistente da chave 'token'
    setIsAuthenticated(false);
    navigate("/login"); // Redireciona para a página de login
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black dark:text-white">
            {isAuthenticated ? "Nome do Usuário" : "Convidado"}
          </span>
          <span className="block text-xs">
            {isAuthenticated ? "Autenticado" : "Não autenticado"}
          </span>
        </span>
        <span className="h-12 w-12 rounded-full">
          <img src="./images/user/user-01.png" alt="Usuário" />
        </span>
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-4 w-64 rounded-sm border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
          <ul className="border-b border-stroke dark:border-strokedark px-6 py-7.5">
            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/profile" className="flex items-center gap-3.5 text-sm font-medium hover:text-primary">
                    Meu Perfil
                  </Link>
                </li>
                <li>
                  <Link to="/settings" className="flex items-center gap-3.5 text-sm font-medium hover:text-primary">
                    Configurações da Conta
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="flex items-center gap-3.5 text-sm font-medium hover:text-primary">
                    Sair
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login" className="flex items-center gap-3.5 text-sm font-medium hover:text-primary">
                  Entrar
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

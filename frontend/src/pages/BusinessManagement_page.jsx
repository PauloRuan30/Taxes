import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BusinessRegistration from "./BusinessRegistration_page";

const API_BASE_URL = "http://localhost:8000/business/";

const BusinessManagement = () => {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState([]);
  const [searchCNPJ, setSearchCNPJ] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setBusinesses(response.data);
    } catch (error) {
      console.error("Error fetching businesses:", error);
    }
  };

  const handleSearch = (e) => {
    setSearchCNPJ(e.target.value);
  };

  const handleSelectBusiness = (business) => {
    navigate(`/business/${business.id}`);
  };

  const filteredBusinesses = businesses.filter((b) => b.cnpj.includes(searchCNPJ));

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Gerenciamento de Empresas</h1>

      {/* Botão para cadastrar nova empresa */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Cadastrar Empresa
      </button>

      {/* Campo de busca por CNPJ */}
      <input
        type="text"
        placeholder="Buscar por CNPJ"
        value={searchCNPJ}
        onChange={handleSearch}
        className="w-1/2 p-2 border rounded-md mb-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Tabela de empresas */}
      <div className="overflow-x-auto w-full max-w-4xl">
        <table className="w-full text-left border-collapse bg-white shadow-lg rounded-lg">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Razão Social</th>
              <th className="px-4 py-2">CNPJ</th>
            </tr>
          </thead>
          <tbody>
            {filteredBusinesses.length > 0 ? (
              filteredBusinesses.map((business) => (
                <tr
                  key={business.id}
                  className="border-b hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelectBusiness(business)}
                >
                  <td className="px-4 py-2">{business.id}</td>
                  <td className="px-4 py-2">{business.razao_social}</td>
                  <td className="px-4 py-2">{business.cnpj}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-4 py-2 text-center text-gray-500">
                  Nenhuma empresa encontrada
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Cadastro */}
      {isModalOpen && <BusinessRegistration onClose={() => setIsModalOpen(false)} fetchBusinesses={fetchBusinesses} />}
    </div>
  );
};

export default BusinessManagement;

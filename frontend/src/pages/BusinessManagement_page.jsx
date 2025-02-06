  import React, { useState, useEffect } from "react";
  import axios from "axios";
  import BusinessRegistration from "./BusinessRegistration_page";

  const API_BASE_URL = "http://localhost:8000/business/";

  const BusinessManagement = () => {
    const [businesses, setBusinesses] = useState([]);
    const [searchCNPJ, setSearchCNPJ] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBusiness, setSelectedBusiness] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});

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
      setSelectedBusiness(business);
      setEditData(business);
      setIsDetailModalOpen(true);
    };

    const closeDetailModal = () => {
      setIsDetailModalOpen(false);
      setSelectedBusiness(null);
      setIsEditing(false);
    };

    const handleDeleteBusiness = async () => {
      if (selectedBusiness) {
        try {
          await axios.delete(`${API_BASE_URL}${selectedBusiness.id}`);
          fetchBusinesses();
          closeDetailModal();
        } catch (error) {
          console.error("Error deleting business:", error);
        }
      }
    };

    const handleEditBusiness = async () => {
      if (selectedBusiness) {
        try {
          await axios.put(`${API_BASE_URL}${selectedBusiness.id}`, editData);
          fetchBusinesses();
          closeDetailModal();
        } catch (error) {
          console.error("Error updating business:", error);
        }
      }
    };

    const filteredBusinesses = businesses.filter((b) => b.cnpj.includes(searchCNPJ));

    return (
      <div className="flex flex-col items-center min-h-screen dark:bg-boxdark dark:drop-shadow-none bg-gray-100 p-6">
        <h1 className="text-3xl font-bold mb-6">Gerenciamento de Empresas</h1>

        {/* Botão de abrir modal de cadastro */}
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
                <th className="px-4 py-2">Insc. Estadual</th>
                <th className="px-4 py-2">Insc. Municipal</th>
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
                    <td className="px-4 py-2">{business.inscricao_estadual}</td>
                    <td className="px-4 py-2">{business.inscricao_municipal}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-2 text-center text-gray-500">
                    Nenhuma empresa encontrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal de Detalhes da Empresa */}
        {isDetailModalOpen && selectedBusiness && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
              <h2 className="text-2xl font-bold mb-4">Detalhes da Empresa</h2>
              <div className="overflow-auto max-h-96">
                <table className="w-full text-left border-collapse">
                  <tbody>
                    {Object.entries(editData).map(([key, value]) => (
                      <tr key={key} className="border-b">
                        <td className="px-4 py-2 font-semibold capitalize">{key.replace(/_/g, " ")}</td>
                        <td className="px-4 py-2">
                          {isEditing ? (
                            <input
                              type="text"
                              value={value || ""}
                              onChange={(e) => setEditData({ ...editData, [key]: e.target.value })}
                              className="border p-1 rounded w-full"
                            />
                          ) : (
                            value || "N/A"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between mt-4">
                {isEditing ? (
                  <button
                    onClick={handleEditBusiness}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                  >
                    Salvar
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                )}
                <button
                  onClick={handleDeleteBusiness}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Excluir
                </button>
                <button
                  onClick={closeDetailModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Cadastro */}
        {isModalOpen && <BusinessRegistration onClose={() => setIsModalOpen(false)} fetchBusinesses={fetchBusinesses} />}
      </div>
    );
  };

  export default BusinessManagement;

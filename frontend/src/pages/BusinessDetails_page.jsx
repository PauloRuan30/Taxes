import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function BusinessDetails() {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const [business, setBusiness] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchBusiness();
    fetchFiles();
  }, [businessId]);

  const fetchBusiness = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/business/${businessId}`);
      setBusiness(response.data);
      setEditData(response.data);
    } catch (error) {
      console.error("Error fetching business:", error);
    }
  };

  const fetchFiles = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/business/${businessId}/files`);
      if (response.data.length > 0) {
        setFiles(response.data);
      } else {
        // If no files are found in the database, use localStorage
        loadFilesFromLocalStorage();
      }
    } catch (error) {
      console.error("Error fetching files from API, trying localStorage...", error);
      loadFilesFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const loadFilesFromLocalStorage = () => {
    const savedFiles = JSON.parse(localStorage.getItem("savedFiles")) || [];
    const associatedFiles = savedFiles.find((group) => group.companyId === businessId);
    if (associatedFiles) {
      setFiles(associatedFiles.files);
    } else {
      setFiles([]); // No associated files found
    }
  };

  const handleEditBusiness = async () => {
    try {
      await axios.put(`http://localhost:8000/business/${businessId}`, editData);
      setIsEditing(false);
      fetchBusiness();
    } catch (error) {
      console.error("Error updating business:", error);
    }
  };

  const handleDeleteBusiness = async () => {
    if (window.confirm("Tem certeza que deseja excluir esta empresa?")) {
      try {
        await axios.delete(`http://localhost:8000/business/${businessId}`);
        navigate("/BusinessManagement");
      } catch (error) {
        console.error("Error deleting business:", error);
      }
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (!business) return <p className="text-red-500">Erro: Empresa não encontrada.</p>;

  return (
    <div className="container mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-6">{business.razao_social}</h1>
      <p><strong>CNPJ:</strong> {business.cnpj}</p>
      <p><strong>Inscrição Estadual:</strong> {business.inscricao_estadual || "N/A"}</p>
      <p><strong>Inscrição Municipal:</strong> {business.inscricao_municipal || "N/A"}</p>

      <h2 className="text-2xl font-bold mt-6">Editar Empresa</h2>
      {isEditing ? (
        <div className="mt-4">
          {Object.entries(editData).map(([key, value]) => (
            <div key={key} className="mb-2">
              <label className="block text-sm font-semibold capitalize">{key.replace(/_/g, " ")}</label>
              <input
                type="text"
                value={value || ""}
                onChange={(e) => setEditData({ ...editData, [key]: e.target.value })}
                className="border p-2 rounded w-full"
              />
            </div>
          ))}
          <button
            onClick={handleEditBusiness}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 mt-2"
          >
            Salvar
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 mt-4"
        >
          Editar
        </button>
      )}

      <h2 className="text-2xl font-bold mt-6">Arquivos Associados</h2>
      {files.length > 0 ? (
        <ul className="mt-4">
          {files.map((file, index) => (
            <li key={index} className="border p-2 rounded mt-2">
              {file.name} - {new Date().toLocaleDateString()}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Nenhum arquivo encontrado.</p>
      )}

      <button
        onClick={handleDeleteBusiness}
        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 mt-4"
      >
        Excluir Empresa
      </button>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
// Import FilePond and plugins
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";

registerPlugin(FilePondPluginFileValidateType, FilePondPluginFileValidateSize);

export default function BusinessDetails() {
  const { businessId } = useParams();
  const navigate = useNavigate();

  const [business, setBusiness] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [newFiles, setNewFiles] = useState([]); // For FilePond

  useEffect(() => {
    fetchBusiness();
    fetchFiles();
  }, [businessId]);

  // 1) Load the business from /business/:businessId
  const fetchBusiness = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/business/${businessId}`);
      setBusiness(response.data);
      setEditData(response.data);
    } catch (error) {
      console.error("Error fetching business:", error);
    }
  };

  // 2) Load docs from /business/:businessId/files
  const fetchFiles = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/business/${businessId}/files`);
      if (Array.isArray(response.data) && response.data.length > 0) {
        setFiles(response.data);
      } else {
        setFiles([]); // No docs in DB
      }
    } catch (error) {
      console.error("Error fetching files from API:", error);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  // PUT /business/:businessId to update business
  const handleEditBusiness = async () => {
    try {
      await axios.put(`http://localhost:8000/business/${businessId}`, editData);
      setIsEditing(false);
      fetchBusiness();
    } catch (error) {
      console.error("Error updating business:", error);
    }
  };

  // DELETE /business/:businessId
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

  // 3) Add new files via FilePond
  const handleAddFiles = async () => {
    if (!newFiles.length) return;

    // For demonstration, we're ONLY storing them in state.
    // If you want them in your DB, you should call POST /upload/ with `company_id`.
    // e.g. see "ImportArchives.jsx" code
    const updatedFiles = [...files];
    const newFileObjects = await Promise.all(
      newFiles.map(async (fileItem) => {
        const file = fileItem.file;
        const text = await file.text();
        let parsedContent;
        try {
          parsedContent = JSON.parse(text);
        } catch {
          parsedContent = { rawText: text };
        }
        return { name: file.name, size: file.size, content: parsedContent };
      })
    );
    updatedFiles.push(...newFileObjects);
    setFiles(updatedFiles);

    // Clear FilePond input
    setNewFiles([]);
  };

  if (loading) return <p>Carregando...</p>;
  if (!business) return <p className="text-red-500">Erro: Empresa não encontrada.</p>;

  return (
    <div className="container mx-auto py-12 px-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6">{business.razao_social}</h1>
      <p><strong>CNPJ:</strong> {business.cnpj}</p>
      <p><strong>Inscrição Estadual:</strong> {business.inscricao_estadual || "N/A"}</p>
      <p><strong>Inscrição Municipal:</strong> {business.inscricao_municipal || "N/A"}</p>
      <p><strong>Endereço:</strong> {business.endereco || "N/A"}</p>
      <p><strong>Bairro:</strong> {business.bairro || "N/A"}</p>
      <p><strong>Número:</strong> {business.numero || "N/A"}</p>
      <p><strong>CEP:</strong> {business.cep || "N/A"}</p>
      <p><strong>Cidade:</strong> {business.cidade || "N/A"}</p>
      <p><strong>Nome Fantasia:</strong> {business.nome_fantasia || "N/A"}</p>
      <p><strong>Serviços/Produtos:</strong> {business.servicos_produtos || "N/A"}</p>
      <p><strong>Nicho de Mercado:</strong> {business.nicho_mercado || "N/A"}</p>

      <button
        onClick={handleDeleteBusiness}
        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 mt-4"
      >
        Excluir Empresa
      </button>

      <h2 className="text-2xl font-bold mt-6">Editar Empresa</h2>
      {isEditing ? (
        <div className="mt-4">
          {Object.entries(editData).map(([key, value]) => (
            <div key={key} className="mb-2">
              <label className="block text-sm font-semibold capitalize">
                {key.replace(/_/g, " ")}
              </label>
              <input
                type="text"
                value={value || ""}
                onChange={(e) => setEditData({ ...editData, [key]: e.target.value })}
                className="border p-2 rounded w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
      <FilePond
        files={newFiles}
        onupdatefiles={setNewFiles}
        allowMultiple={true}
        maxFiles={10}
        acceptedFileTypes={["text/plain"]}
        maxFileSize="100MB"
        labelIdle='Arraste arquivos ou <span class="filepond--label-action">Escolha</span>'
      />
      <button
        onClick={handleAddFiles}
        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 w-full mt-2"
      >
        Adicionar Arquivos
      </button>

      {files.length > 0 ? (
        <ul className="mt-4">
          {files.map((doc, idx) => (
            <li key={idx} className="border p-2 rounded mt-2 flex items-center">
              <span className="mr-2">
                Documento: {doc.id || doc.name || `Arquivo ${idx + 1}`}
              </span>
              <button
                onClick={() => navigate("/tablePage", { state: { doc } })}
                className="bg-blue-500 text-white px-2 py-1 rounded ml-auto"
              >
                Abrir
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Nenhum arquivo encontrado.</p>
      )}
    </div>
  );
}

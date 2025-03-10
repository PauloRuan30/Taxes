import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
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
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [newFiles, setNewFiles] = useState([]);

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
      setFiles([]);
    }
  };

  const saveFilesLocally = (updatedFiles) => {
    let savedFiles = JSON.parse(localStorage.getItem("savedFiles")) || [];
    savedFiles = savedFiles.filter((group) => group.companyId !== businessId);
    savedFiles.push({ companyId: businessId, files: updatedFiles });
    localStorage.setItem("savedFiles", JSON.stringify(savedFiles));
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

  const openFile = async () => {
    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        const blob = new Blob([file.content.rawText || JSON.stringify(file.content)], { type: "text/plain" });
        formData.append("files", blob, file.name);
      });

      const { data } = await axios.post("http://localhost:8000/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.errors?.length) {
        alert("Erro ao processar os arquivos.");
        return;
      }

      navigate("/tablePage", { state: { data: data.data } });
    } catch (error) {
      alert("Erro ao processar os arquivos. O formato pode estar incorreto.");
    }
  };

  const toggleFileSelection = (file) => {
    setSelectedFiles((prev) =>
      prev.includes(file) ? prev.filter((f) => f !== file) : [...prev, file]
    );
  };

  const selectAllFiles = () => {
    if (selectedFiles.length === files.length) {
      setSelectedFiles([]); // Deselect all if all are selected
    } else {
      setSelectedFiles(files); // Select all
    }
  };

  const deleteSelectedFiles = () => {
    if (!selectedFiles.length) return;

    const updatedFiles = files.filter((file) => !selectedFiles.includes(file));
    saveFilesLocally(updatedFiles);
    setFiles(updatedFiles);
    setSelectedFiles([]);
  };

  const handleAddFiles = async () => {
    if (!newFiles.length) return;

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
    saveFilesLocally(updatedFiles);
    setFiles(updatedFiles);
    setNewFiles([]);
  };

  if (loading) return <p>Carregando...</p>;
  if (!business) return <p className="text-red-500">Erro: Empresa não encontrada.</p>;

  return (
    <div className="container mx-auto py-12 px-6">
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
          <button onClick={handleEditBusiness} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 mt-2">
            Salvar
          </button>
        </div>
      ) : (
        <button onClick={() => setIsEditing(true)} className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 mt-4">
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
        labelIdle='Arraste arquivos aqui ou <span class="filepond--label-action">Escolha</span>'
      />
      <button onClick={handleAddFiles} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 w-full mt-2">
        Adicionar Arquivos
      </button>

      {files.length > 0 ? (
        <div className="mt-4">
          <button onClick={selectAllFiles} className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 mr-2">
            {selectedFiles.length === files.length ? "Desmarcar Todos" : "Selecionar Todos"}
          </button>
          <button onClick={deleteSelectedFiles} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
            Excluir Selecionados
          </button>
          <ul className="mt-4">
            {files.map((file, index) => (
              <li key={index} className="border p-2 rounded mt-2 flex items-center">
                <input type="checkbox" checked={selectedFiles.includes(file)} onChange={() => toggleFileSelection(file)} className="mr-2"/>
                {file.name}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-gray-500">Nenhum arquivo encontrado.</p>
      )}

      <button onClick={openFile} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 mt-4">
        Abrir Selecionados
      </button>
    </div>
  );
}

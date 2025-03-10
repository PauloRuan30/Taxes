import { useState, useEffect } from "react";
import axios from "axios";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import { useNavigate } from "react-router-dom";
import { FaFileAlt, FaShieldAlt, FaCogs, FaCube } from "react-icons/fa";

registerPlugin(FilePondPluginFileValidateType, FilePondPluginFileValidateSize);

export default function ImportArchives() {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [companies, setCompanies] = useState([]); // Store companies from API
  const [selectedCompany, setSelectedCompany] = useState(""); // Selected company
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch company list from API
    const fetchCompanies = async () => {
      try {
        const response = await axios.get("http://localhost:8000/business/");
        setCompanies(response.data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };
    fetchCompanies();
  }, []);

  const saveFilesLocally = async (uploadedFiles) => {
    const savedFiles = JSON.parse(localStorage.getItem("savedFiles")) || [];
  
    const newFiles = await Promise.all(
      uploadedFiles.map(async (file) => {
        try {
          const text = await file.text(); // Read file content as text
          let parsedContent = text;
  
          // Ensure content is valid (trim and remove special chars if needed)
          parsedContent = parsedContent.replace(/\uFFFD/g, ""); // Remove corrupted chars
  
          return {
            fileName: file.name, // Store file name
            companyId: selectedCompany, // Store company ID
            content: parsedContent, // Ensure content is text
          };
        } catch (error) {
          console.error("Error reading file:", file.name, error);
          return null;
        }
      })
    );
  
    // Filter out null values in case of read errors
    const validFiles = newFiles.filter(file => file !== null);
  
    // Ensure storage structure is correct
    const updatedFiles = [...savedFiles, ...validFiles];
    localStorage.setItem("savedFiles", JSON.stringify(updatedFiles));
  
    console.log("Updated savedFiles JSON:", JSON.stringify(updatedFiles, null, 2));
  };
  
  const handleUpload = async () => {
    if (!files.length || !selectedCompany) {
      setError("Selecione uma empresa e pelo menos um arquivo.");
      return;
    }
  
    setIsUploading(true);
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file.file));
    formData.append("company_id", selectedCompany);
  
    try {
      const { data } = await axios.post("http://localhost:8000/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      console.log("✅ API Response:", data); // Log the API response
  
      if (!data || !Array.isArray(data.data) || data.data.length === 0) {
        setError("Nenhuma planilha foi processada.");
        return;
      }
  
      // Ensure the sheets exist before navigating
      const processedSheets = data.data[0]?.sheets || [];
  
      if (!Array.isArray(processedSheets) || processedSheets.length === 0) {
        setError("Dados inválidos recebidos do servidor.");
        return;
      }
  
      console.log("✅ Processed Sheets:", processedSheets); // Debugging
  
      navigate("/tablePage", { state: { data: processedSheets, companyId: selectedCompany } });
  
    } catch (error) {
      setError(error.response?.data?.detail || "Falha ao carregar os arquivos.");
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-gray-800 dark:bg-gray-800 text-white py-12 text-center">
        <h1 className="text-4xl font-bold dark:text-white">Importador de Arquivos</h1>
      </header>

      <div className="container mx-auto py-12 px-6">
        <div className="bg-white dark:bg-gray-800 shadow-lg p-6 rounded-lg max-w-lg mx-auto">
          {/* Company Selection */}
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="w-full mb-4 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">Selecione uma empresa</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.razao_social} - {company.cnpj}
              </option>
            ))}
          </select>

          {/* File Upload */}
          <FilePond
            files={files}
            onupdatefiles={setFiles}
            allowMultiple={true}
            maxFiles={20}
            acceptedFileTypes={["text/plain"]}
            maxFileSize="100MB"
            labelIdle='Arraste seus arquivos aqui ou <span class="filepond--label-action">Escolha</span>'
            disabled={isUploading}
          />
          
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mt-4 ${
              isUploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isUploading ? "Processando..." : "Upload e Processar"}
          </button>
          
        </div>
      </div>

      {/* Features Section */}
      <main className="container mx-auto py-12 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="flex items-start p-6 rounded-lg bg-white dark:bg-gray-800 shadow-md">
      <Icon className="text-5xl text-gray-900 dark:text-white mr-4" />
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
        <p className="mt-2 text-lg text-gray-700 dark:text-gray-300">{description}</p>
      </div>
    </div>
  );
}

const features = [
  {
    icon: FaFileAlt,
    title: "Instruções de Uso",
    description: "Importe seus arquivos sped no formato .txt para que o sistema modele e exiba as informações do arquivo em uma tabela.",
  },
  {
    icon: FaShieldAlt,
    title: "Etapa 1",
    description: "1. Clique no botão 'Escolher arquivo' e selecione um ou mais arquivos .txt do seu computador.",
  },
  {
    icon: FaCogs,
    title: "Etapa 2",
    description: "2. Verifique o formato para garantir que as informações sejam lidas corretamente.",
  },
  {
    icon: FaCube,
    title: "Etapa 3",
    description: "3. Clique em 'Upload e Processar' para carregar os dados e espere os dados serem carregados; após isso, você será direcionado para a tabela.",
  },
];

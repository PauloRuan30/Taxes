import { useState, useEffect } from "react";
import { FaFileUpload, FaFileAlt, FaShieldAlt, FaCogs, FaCube } from "react-icons/fa";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import axios from "axios";
import { useNavigate } from "react-router-dom";

registerPlugin(FilePondPluginFileValidateType, FilePondPluginFileValidateSize);

export default function ImportArchives() {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  // Function to save files locally
  const saveFilesLocally = async (uploadedFiles) => {
    const savedFiles = JSON.parse(localStorage.getItem("savedFiles")) || [];
  
    const newFiles = await Promise.all(
      uploadedFiles.map(async (file) => {
        const text = await file.text();
  
        let parsedContent;
        try {
          parsedContent = JSON.parse(text);
        } catch (error) {
          parsedContent = { rawText: text };
        }
  
        return {
          name: file.name,
          size: file.size,
          content: parsedContent,
        };
      })
    );
  
    // Store all files together in a single entry
    const newEntry = {
      id: Date.now(), // Unique ID
      files: newFiles, // Store all files in one entry
    };
  
    const updatedFiles = [...savedFiles, newEntry];
    localStorage.setItem("savedFiles", JSON.stringify(updatedFiles));
  
    console.log("Updated savedFiles JSON:", JSON.stringify(updatedFiles, null, 2));
  };
  
  const handleUpload = async () => {
    if (!files.length) {
      setError("Por favor, selecione pelo menos um arquivo.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file.file));

    try {
      const { data } = await axios.post("http://localhost:8000/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      if (data.errors?.length) {
        setError("Alguns arquivos apresentaram erros.");
      } else {
        await saveFilesLocally(files.map(f => f.file)); // Save files locally
        navigate("/tablePage", { state: { data: data.data } });
      }
    } catch (error) {
      setError(error.response?.data?.detail || "Falha ao carregar os arquivos. Tente novamente.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gray-800 text-white py-12 text-center">
        <h1 className="text-4xl font-bold">Importador de Arquivos</h1>
        <p className="mt-4 text-lg max-w-xl mx-auto">
          Faça upload de seus arquivos .txt para que o sistema modele e exiba as informações contidas no arquivo.
        </p>
      </header>

      <div className="container mx-auto py-12 px-6">
        <div className="bg-white shadow-lg p-6 rounded-lg max-w-lg mx-auto">
          <FilePond
            files={files}
            onupdatefiles={setFiles}
            allowMultiple={true}
            maxFiles={20}
            acceptedFileTypes={["text/plain"]}
            maxFileSize="100MB"
            labelIdle='Arraste seus arquivos aqui ou <span class="filepond--label-action">Escolha os Arquivos</span>'
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
    <div className="flex items-start p-6 rounded-lg ">
      <Icon className="text-5xl text-gray-900 mr-4" />
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <p className="mt-2 text-lg text-gray-700">{description}</p>
      </div>
    </div>
  );
}

const features = [
  {
    icon: FaFileAlt,
    title: "Instruções de Uso",
    description: "Importe seus arquivos sped no formato .txt para que o sistema modele e exiba as informações arquivo em uma tabela.",
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
    description: "3. Clique em 'Upload e Processar' para carregar os dados e espere os dados serem carregados, apos isso você será direcionado para a tabela.",
  },
];

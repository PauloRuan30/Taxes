import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SavedFiles() {
  const [savedFiles, setSavedFiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const files = JSON.parse(localStorage.getItem("savedFiles")) || [];
    setSavedFiles(files);
  }, []);

  const deleteFile = (index) => {
    const updatedFiles = [...savedFiles];
    updatedFiles.splice(index, 1);
    localStorage.setItem("savedFiles", JSON.stringify(updatedFiles));
    setSavedFiles(updatedFiles);
  };

  const openFile = (fileContent) => {
    try {
      let dataToLoad;
  
      if (typeof fileContent === "string") {
        // If it's raw text, attempt to parse JSON or structure it as a table
        try {
          dataToLoad = JSON.parse(fileContent); // If JSON, parse normally
        } catch (error) {
          dataToLoad = [{ name: "Sheet1", celldata: [{ r: 0, c: 0, v: fileContent }] }]; // Convert text into a sheet
        }
      } else if (typeof fileContent === "object") {
        // Already structured
        dataToLoad = fileContent.rawText
          ? [{ name: "Sheet1", celldata: [{ r: 0, c: 0, v: fileContent.rawText }] }]
          : fileContent;
      } else {
        throw new Error("Formato desconhecido");
      }
  
      navigate("/tablePage", { state: { data: dataToLoad } });
    } catch (error) {
      alert("Erro ao processar o arquivo. O formato pode estar incorreto.");
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gray-800 text-white py-12 text-center">
        <h1 className="text-4xl font-bold">Arquivos Salvos</h1>
      </header>

      <div className="container mx-auto py-12 px-6">
        {savedFiles.length === 0 ? (
          <p className="text-center text-gray-500">Nenhum arquivo salvo.</p>
        ) : (
          <div className="bg-white shadow-lg p-6 rounded-lg max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Arquivos Salvos Localmente</h2>
            <ul className="space-y-4">
              {savedFiles.map((file, index) => (
                <li key={index} className="p-4 border rounded flex justify-between items-center">
                  <div>
                    <p className="text-lg font-semibold">{file.name}</p>
                    <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openFile(file.content)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Abrir
                    </button>
                    <button
                      onClick={() => deleteFile(index)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Excluir
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

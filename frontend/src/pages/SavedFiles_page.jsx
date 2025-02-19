import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";

registerPlugin(FilePondPluginFileValidateType, FilePondPluginFileValidateSize);

export default function SavedFiles() {
  const [savedFiles, setSavedFiles] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newFiles, setNewFiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const files = JSON.parse(localStorage.getItem("savedFiles")) || [];
    setSavedFiles(Array.isArray(files) ? files : []);
  }, []);

  const deleteFile = (index) => {
    const updatedFiles = [...savedFiles];
    updatedFiles.splice(index, 1);
    localStorage.setItem("savedFiles", JSON.stringify(updatedFiles));
    setSavedFiles(updatedFiles);
  };

  const openFile = async () => {
    try {
      const formData = new FormData();

      // Add selected files to FormData
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

      setModalOpen(false); // Close modal after selecting
      navigate("/tablePage", { state: { data: data.data } });
    } catch (error) {
      alert("Erro ao processar os arquivos. O formato pode estar incorreto.");
    }
  };

  const openSelectionModal = (entry) => {
    setSelectedEntry(entry);
    setSelectedFiles(entry.files);
    setNewFiles([]); // Reset new files array
    setModalOpen(true);
  };

  const toggleFileSelection = (file) => {
    setSelectedFiles((prev) =>
      prev.includes(file) ? prev.filter((f) => f !== file) : [...prev, file]
    );
  };

  const handleAddFiles = async () => {
    if (!newFiles.length) return;

    const updatedFiles = [...selectedEntry.files];

    const newFileObjects = await Promise.all(
      newFiles.map(async (file) => {
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

    // Update localStorage
    const updatedSavedFiles = savedFiles.map((group) =>
      group.id === selectedEntry.id ? { ...group, files: updatedFiles } : group
    );

    localStorage.setItem("savedFiles", JSON.stringify(updatedSavedFiles));
    setSavedFiles(updatedSavedFiles);
    setSelectedFiles(updatedFiles); // Update selected files list
    setNewFiles([]); // Clear added files
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
              {savedFiles.map((entry, index) => (
                <li key={entry.id || index} className="p-4 border rounded flex justify-between items-center">
                  <div>
                    <p className="text-lg font-semibold">Grupo {index + 1}</p>
                    <p className="text-sm text-gray-500">{entry.files?.length || 0} arquivos</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openSelectionModal(entry)}
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

      {/* Modal for file selection and adding new files */}
      {modalOpen && selectedEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Selecionar Arquivos</h2>

            <div className="max-h-40 overflow-auto">
              {selectedEntry.files.map((file, index) => (
                <div key={index} className="flex items-center space-x-3 mb-2">
                  <input
                    type="checkbox"
                    checked={selectedFiles.includes(file)}
                    onChange={() => toggleFileSelection(file)}
                  />
                  <span>{file.name}</span>
                </div>
              ))}
            </div>

            {/* FilePond Input for Adding More Files */}
            <h3 className="text-lg font-semibold mt-4">Adicionar Arquivos</h3>
            <FilePond
              files={newFiles}
              onupdatefiles={setNewFiles}
              allowMultiple={true}
              maxFiles={10}
              acceptedFileTypes={["text/plain"]}
              maxFileSize="100MB"
              labelIdle='Arraste arquivos aqui ou <span class="filepond--label-action">Escolha</span>'
            />
            <button
              onClick={handleAddFiles}
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 w-full mt-2"
            >
              Adicionar Arquivos ao Grupo
            </button>

            <div className="mt-4 flex justify-between">
              <button
                onClick={() => setModalOpen(false)}
                className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={openFile}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Abrir Selecionados
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from "react";
import axios from "axios";

const ExportButton = ({ sheets }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const toggleOptions = () => setShowOptions(!showOptions);

  const downloadZip = (response, filename) => {
    const url = window.URL.createObjectURL(
      new Blob([response.data], { type: "application/zip" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportFiles = async (exportType) => {
    if (sheets.length === 0) {
      alert("No data available for export.");
      return;
    }
    setIsExporting(true);
    try {
      // Use the transformed sheets so that only one celldata exists per sheet.
      const transformedSheets = sheets.map((sheet) => {
        const { celldata, ...rest } = sheet; // remove legacy celldata if any
        const newCelldata = sheet.data.flatMap((row, r) =>
          row.map((cell, c) => {
            if (cell === null || cell === undefined) return null;
            return { r, c, v: cell };
          })
        ).filter((cell) => cell !== null);
        return { ...rest, celldata: newCelldata };
      });
  
      const exportPayload = [
        {
          file_name: "exported_file",
          sheets: transformedSheets,
          // Optionally include selectedBlocks if needed.
        },
      ];
  
      let endpoint = "http://localhost:8000/export/";
      let filename = "exported_files.zip";
  
      if (exportType === "xlsx") {
        endpoint = "http://localhost:8000/export/xlsx/";
        filename = "exported_files.xlsx.zip";
      } else if (exportType === "csv") {
        endpoint = "http://localhost:8000/export/csv/";
        filename = "exported_files.csv.zip";
      }
  
      const response = await axios.post(endpoint, exportPayload, {
        responseType: "blob",
      });
      downloadZip(response, filename);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
      setShowOptions(false);
    }
  };
  

  return (
    <div className="fixed bottom-20 right-10 flex flex-col items-end">
      {showOptions && (
        <div className="mb-2 flex flex-col space-y-2">
          <button
            onClick={() => exportFiles("txt")}
            disabled={isExporting}
            className="bg-gray-700 text-white py-2 px-4 rounded-full shadow-md hover:bg-gray-800"
          >
            Export TXT
          </button>
          <button
            onClick={() => exportFiles("xlsx")}
            disabled={isExporting}
            className="bg-green-500 text-white py-2 px-4 rounded-full shadow-md hover:bg-green-600"
          >
            Export XLSX
          </button>
          <button
            onClick={() => exportFiles("csv")}
            disabled={isExporting}
            className="bg-blue-500 text-white py-2 px-4 rounded-full shadow-md hover:bg-blue-600"
          >
            Export CSV
          </button>
        </div>
      )}
      <button
        onClick={toggleOptions}
        disabled={isExporting}
        className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-4 rounded-full shadow-xl"
      >
        {isExporting ? "Exporting..." : "Exportar"}
      </button>
    </div>
  );
};

export default ExportButton;

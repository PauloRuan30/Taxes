import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const ExportButton = () => {
  const location = useLocation();
  const sheets = location.state?.data || [];

  const [isExporting, setIsExporting] = useState(false);

  // Function to handle export
  const handleExport = async () => {
    if (sheets.length === 0) {
      alert("No data available for export.");
      return;
    }

    setIsExporting(true);
    try {
      // Prepare data for the backend (each file's sheets)
      const exportPayload = [
        {
          file_name: "exported_file.txt", // Adjust dynamically if needed
          sheets: sheets,
        },
      ];

      // Send request to backend export endpoint
      const response = await axios.post("http://localhost:8000/export/", exportPayload, {
        responseType: "blob", // Ensure binary data is received
      });

      // Create a download link for the ZIP file
      const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/zip" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "exported_files.zip");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed bottom-10 right-10">
      <button
        onClick={handleExport}
        disabled={isExporting}
        className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full shadow-lg transition ${
          isExporting ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isExporting ? "Exporting..." : "Export Files"}
      </button>
    </div>
  );
};

export default ExportButton;

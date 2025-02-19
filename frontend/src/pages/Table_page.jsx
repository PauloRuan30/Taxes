import React, { useState, useEffect, useCallback } from "react";
import { Workbook } from "@fortune-sheet/react";
import "@fortune-sheet/react/dist/index.css";
import { useLocation, useNavigate } from "react-router-dom";
import ExportButton from "../components/ExportButton";

// Validate and enrich each sheet object so FortuneSheet can render it
const validateSheets = (sheets) => {
  if (!Array.isArray(sheets)) {
    console.error("❌ sheets is not an array or is undefined:", sheets);
    return [];
  }

  return sheets.map((sheet) => {
    const celldata = Array.isArray(sheet.celldata) ? sheet.celldata : [];
    const maxRow = celldata.reduce((acc, cell) => Math.max(acc, cell.r + 1), 100);
    const maxCol = celldata.reduce((acc, cell) => Math.max(acc, cell.c + 1), 26);
    return {
      ...sheet,
      row: maxRow,
      column: maxCol,
      celldata,  // Ensure celldata is correctly passed
      config: { 
        authority: { sheet: 0, cell: 0 },
        merge: {},
        rowlen: {},
        columnlen: {}
      },
    };
  });
};

const TablePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sheets, setSheets] = useState([]);

  useEffect(() => {
    let sheetsData = [];
    if (location.state?.data && Array.isArray(location.state.data) && location.state.data.length > 0) {
      sheetsData = location.state.data;
    } else {
      const savedFiles = JSON.parse(localStorage.getItem("savedFiles")) || [];
      if (savedFiles.length > 0 && savedFiles[0].content) {
        sheetsData = savedFiles[0].content;
      }
    }
    setSheets(validateSheets(sheetsData));
  }, [location.state]);

  // Capture real-time updates from FortuneSheet
  const handleChange = useCallback((changedSheets) => {
    setSheets(validateSheets(changedSheets));
    console.log("✅ Updated Sheets:", changedSheets);  
  }, []);

  if (!sheets.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-8 text-center">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">No Data Available</h1>
          <p className="text-gray-600 mb-4">
            No spreadsheet data was found. Please try uploading your files again.
          </p>
          <button
            onClick={() => navigate("/savedFiles")}
            className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition duration-300"
          >
            Open Saved Files
          </button>
        </div>
      </div>
    );
  }

  const overallMaxRow = Math.max(...sheets.map(sheet => sheet.row || 100));
  const overallMaxCol = Math.max(...sheets.map(sheet => sheet.column || 26));

  const options = {
    data: sheets,
    showToolbar: true,
    showGrid: true,
    showContextmenu: true,
    row: overallMaxRow,
    column: overallMaxCol,
    style: { width: "100%", height: "100vh" },
    onChange: handleChange,
    hooks: { beforeCellMouseDown: () => true },
    cellContextMenu: true,
    allowEdit: true,
    plugins: [],
  };

  return (
    <div className="w-full h-screen">
      <Workbook {...options} />
      {/* Pass updated sheets to ExportButton */}
      <ExportButton sheets={sheets} />
    </div>
  );
};

export default TablePage;

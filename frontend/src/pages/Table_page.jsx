import React, { useState, useEffect, useCallback } from "react";
import { Workbook } from "@fortune-sheet/react";
import "@fortune-sheet/react/dist/index.css";
import { useLocation, useNavigate } from "react-router-dom";
import ExportButton from "../components/ExportButton";

// Validate and ensure correct structure for FortuneSheet
const validateSheets = (sheets) => {
  if (!Array.isArray(sheets)) {
    console.error("❌ sheets is not an array or is undefined:", sheets);
    return [];
  }

  return sheets.map((sheet) => {
    // If 'celldata' already exists and has content, use it.
    // Otherwise, if the sheet has a 'data' property, convert it.
    let celldata = [];
    if (Array.isArray(sheet.celldata) && sheet.celldata.length > 0) {
      celldata = sheet.celldata;
    } else if (Array.isArray(sheet.data) && sheet.data.length > 0) {
      // Convert the 2D 'data' array to a flat array of cell objects.
      celldata = sheet.data.flatMap((row, rowIndex) => {
        return row.map((cell, colIndex) => {
          // If cell is an object (with 'v' or 'm'), spread its contents.
          if (cell && typeof cell === "object" && ("v" in cell || "m" in cell)) {
            return { r: rowIndex, c: colIndex, ...cell };
          }
          // Otherwise, wrap the cell value in an object.
          return { r: rowIndex, c: colIndex, v: cell };
        });
      });
    }

    // Calculate max rows and columns based on the converted celldata.
    const maxRow = celldata.reduce((acc, cell) => Math.max(acc, cell.r + 1), 100);
    const maxCol = celldata.reduce((acc, cell) => Math.max(acc, cell.c + 1), 26);

    return {
      ...sheet,
      celldata, // ensure celldata is included
      row: maxRow,
      column: maxCol,
      config: { authority: { sheet: 0, cell: 0 }, merge: {}, rowlen: {}, columnlen: {} },
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

    console.log("✅ Sheets Data Loaded:", sheetsData);
    setSheets(validateSheets(sheetsData));
  }, [location.state]);

  // Handle changes coming from FortuneSheet and keep latest data
  const handleChange = useCallback((changedSheets) => {
    setSheets(validateSheets(changedSheets));
    console.log("🔄 Updated Sheets:", changedSheets);
  }, []);

  if (!sheets.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <svg
          className="animate-spin h-10 w-10 text-indigo-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
        <p className="mt-4 text-gray-600">Carregando dados da planilha...</p>
      </div>
    );
  }

  const options = {
    data: sheets,
    showToolbar: true,
    showGrid: true,
    showContextmenu: true,
    row: Math.max(...sheets.map(sheet => sheet.row || 100)),
    column: Math.max(...sheets.map(sheet => sheet.column || 26)),
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
      {/* Pass the updated sheets state to ExportButton */}
      <ExportButton sheets={sheets} />
    </div>
  );
};

export default TablePage;
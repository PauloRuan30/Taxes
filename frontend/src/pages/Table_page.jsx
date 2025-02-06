import React, { useState, useEffect, useCallback } from "react";
import { Workbook } from "@fortune-sheet/react";
import "@fortune-sheet/react/dist/index.css";
import { useLocation, useNavigate } from "react-router-dom";
import ExportButton from "../components/ExportButton";

const cleanCell = (cell) => {
  if (cell && typeof cell === "object") {
    return {
      r: cell.r || 0,
      c: cell.c || 0,
      v: String(cell.v || "").trim(),
      m: String(cell.m || "").trim(),
      ct: { fa: "General", t: "g" },
      style: typeof cell.style === "object" ? cell.style : undefined,
      bg: typeof cell.bg === "object" ? cell.bg : undefined,
    };
  }
  return { r: 0, c: 0, v: "", m: "", ct: { fa: "General", t: "g" }, style: undefined, bg: undefined };
};

const validateSheets = (sheets) => {
  return sheets.map((sheet) => ({
    ...sheet,
    celldata: Array.isArray(sheet.celldata)
      ? sheet.celldata.map(cleanCell).filter((cell) => cell && typeof cell === "object")
      : [],
    row: Number(sheet.row) || 100,
    column: Number(sheet.column) || 26,
    config: {
      authority: { sheet: 0, cell: 0 },
      merge: {},
      rowlen: {},
      columnlen: {},
    },
  }));
};

const TablePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sheets, setSheets] = useState([]);

  useEffect(() => {
    let rawData = location.state?.data;
  
    if (!rawData) {
      const savedFiles = JSON.parse(localStorage.getItem("savedFiles")) || [];
      if (savedFiles.length > 0) {
        try {
          rawData = savedFiles[0].content; // Load first saved file
          if (typeof rawData === "string") {
            rawData = [{ name: "Sheet1", celldata: [{ r: 0, c: 0, v: rawData }] }]; // Convert text to table format
          }
        } catch (error) {
          console.error("Error parsing saved file data:", error);
        }
      }
    }
  
    if (rawData) {
      setSheets(validateSheets(rawData));
    }
  }, [location.state?.data]);
  

  const handleChange = useCallback((changes) => {
    setSheets(validateSheets(changes));
  }, []);

  if (!sheets.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-8 text-center">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">No Data Available</h1>
          <p className="text-gray-600 mb-4">No spreadsheet data was found. Please try uploading your files again.</p>
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

  const options = {
    data: sheets,
    showToolbar: true,
    showGrid: true,
    showContextmenu: true,
    row: Math.max(...sheets.map((sheet) => sheet.row || 100), 100),
    column: Math.max(...sheets.map((sheet) => sheet.column || 26), 26),
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
      <ExportButton />
    </div>
  );
};

export default TablePage;

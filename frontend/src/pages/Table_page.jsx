// src/pages/TablePage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Workbook } from "@fortune-sheet/react";
import "@fortune-sheet/react/dist/index.css";
import ExportButton from "../components/ExportButton";

/**
 * Ensures that each sheet and its cell objects conform to the expected structure.
 * Specifically, if a cell has a "style" property that is not an object,
 * it will be replaced with an empty object.
 */
function validateSheets(sheets) {
  if (!Array.isArray(sheets)) {
    console.error("❌ 'sheets' is not an array:", sheets);
    return [];
  }
  return sheets.map((sheet) => {
    const { celldata = [], data = [] } = sheet;
    let newCelldata = celldata;
    if (!newCelldata.length && Array.isArray(data) && data.length) {
      newCelldata = data.flatMap((row, r) =>
        row.map((cell, c) => {
          if (cell && typeof cell === "object" && ("v" in cell || "m" in cell)) {
            return { r, c, ...cell };
          }
          return { r, c, v: cell };
        })
      );
    }
    // Make sure the "style" property is always an object
    newCelldata = newCelldata.map((cell) => {
      if (cell.style && typeof cell.style !== "object") {
        // Replace with an empty object if not an object.
        return { ...cell, style: {} };
      }
      return cell;
    });
    // Calculate maximum row and column
    const maxRow = newCelldata.reduce((acc, cell) => Math.max(acc, cell.r + 1), 100);
    const maxCol = newCelldata.reduce((acc, cell) => Math.max(acc, cell.c + 1), 26);
    return {
      ...sheet,
      celldata: newCelldata,
      row: maxRow,
      column: maxCol,
      config: sheet.config || {
        authority: { sheet: 0, cell: 0 },
        merge: {},
        rowlen: {},
        columnlen: {},
      },
    };
  });
}

export default function TablePage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Store docId (Mongo _id) and sheets from DB
  const [docId, setDocId] = useState(null);
  const [sheets, setSheets] = useState([]);

  // On mount, check location.state for doc data or docId
  useEffect(() => {
    console.log("Component mounted. Checking location.state for data...");
    const docFromState = location.state?.doc; // e.g. { id, sheets }
    const sheetsFromState = location.state?.data; // direct sheets array
    const docIdFromState = docFromState?.id || location.state?.docId || null;

    if (docFromState) {
      console.log("Document data found in location.state:", docFromState);
      setDocId(docIdFromState);
      setSheets(validateSheets(docFromState.sheets));
    } else if (sheetsFromState) {
      console.log("Sheets data found in location.state:", sheetsFromState);
      setSheets(validateSheets(sheetsFromState));
    } else if (docIdFromState) {
      console.log("Document ID found in location.state. Fetching document...");
      fetchDocument(docIdFromState);
    } else {
      console.log("No document or sheets data found in location.state.");
    }
  }, [location.state]);

  const fetchDocument = async (id) => {
    console.log(`Fetching document with ID: ${id}...`);
    try {
      const resp = await axios.get(`http://localhost:8000/documents/${id}`);
      console.log("Document fetched successfully:", resp.data);
      setDocId(resp.data.id);
      setSheets(validateSheets(resp.data.sheets));
    } catch (err) {
      console.error("Failed to load doc:", err);
      alert("Erro ao carregar o documento.");
      navigate("/BusinessManagement");
    }
  };

  const handleChange = useCallback(
    (changedSheets) => {
      console.log("Sheets data updated:", changedSheets);
      setSheets(validateSheets(changedSheets));
    },
    []
  );

  // Save changes back to the DB via PUT /documents/:docId
  const handleSave = async () => {
    if (!docId) {
      console.log("Document has no ID, cannot save.");
      alert("Este documento não possui ID no banco, não é possível salvar.");
      return;
    }
    console.log("Saving changes to the document...");
    try {
      const payload = { sheets };
      console.log("Payload to be saved:", payload);
      await axios.put(`http://localhost:8000/documents/${docId}`, payload);
      console.log("Changes saved successfully.");
      alert("Alterações salvas no servidor!");
    } catch (err) {
      console.error("Erro ao salvar documento:", err);
      alert("Falha ao salvar alterações no servidor.");
    }
  };

  // Add Ctrl+S shortcut to save the file
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        console.log("Ctrl+S pressed. Saving document...");
        handleSave();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleSave]);

  if (!sheets.length) {
    console.log("No sheets data available. Showing loading spinner...");
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

  const workbookOptions = {
    data: sheets,
    showToolbar: true,
    showGrid: true,
    showContextmenu: true,
    allowEdit: true,
    onChange: handleChange,
    style: { width: "100%", height: "calc(100vh - 40px)" },
  };

  console.log("Rendering workbook with sheets:", sheets);
  return (
    <div className="w-full h-screen flex flex-col">
      {/* Top bar with Save and Export buttons */}
      <div className="p-2 flex items-center space-x-2 bg-gray-200">
        <button
          onClick={handleSave}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Salvar
        </button>
        <ExportButton sheets={sheets} />
      </div>
      <div style={{ flex: 1 }}>
        <Workbook {...workbookOptions} />
        <ExportButton sheets={sheets} />
      </div>
    </div>
  );
}
// src/pages/TablePage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Workbook } from "@fortune-sheet/react";
import "@fortune-sheet/react/dist/index.css";

// Bring back ExportButton
import ExportButton from "../components/ExportButton";

/**
 * Utility to ensure FortuneSheet-compatible data structure
 */
function validateSheets(sheets) {
  if (!Array.isArray(sheets)) {
    console.error("❌ 'sheets' is not an array:", sheets);
    return [];
  }
  return sheets.map((sheet) => {
    const { celldata = [], data = [] } = sheet;

    // If 'celldata' is empty but we have 'data', convert it:
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

    // Calculate row/col bounds
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

  // We'll store the docId (Mongo _id) and the "sheets"
  const [docId, setDocId] = useState(null);
  const [sheets, setSheets] = useState([]);

  // On component mount, figure out what was passed in location.state
  useEffect(() => {
    const docFromState = location.state?.doc; // e.g. { id, sheets }
    const sheetsFromState = location.state?.data; // direct array of sheets
    const docIdFromState = docFromState?.id || location.state?.docId || null;

    if (docFromState) {
      // We have a complete doc object with {id, sheets}
      setDocId(docIdFromState);
      setSheets(validateSheets(docFromState.sheets));
    } else if (sheetsFromState) {
      // We only got some 'data' array
      setSheets(validateSheets(sheetsFromState));
    } else if (docIdFromState) {
      // If we only got an ID, fetch from DB
      fetchDocument(docIdFromState);
    }
  }, [location.state]);

  // If docId was found, fetch from DB
  const fetchDocument = async (id) => {
    try {
      const resp = await axios.get(`http://localhost:8000/documents/${id}`);
      setDocId(resp.data.id);
      setSheets(validateSheets(resp.data.sheets));
    } catch (err) {
      console.error("Failed to load doc:", err);
      alert("Erro ao carregar o documento.");
      navigate("/BusinessManagement"); // or wherever you want to redirect
    }
  };

  // Called whenever the user makes changes in the FortuneSheet
  const handleChange = useCallback(
    (changedSheets) => {
      setSheets(validateSheets(changedSheets));
    },
    []
  );

  // Actual save to DB
  const handleSave = async () => {
    if (!docId) {
      alert("Este documento não possui ID no banco, não é possível salvar.");
      return;
    }
    try {
      const payload = { sheets };
      await axios.put(`http://localhost:8000/documents/${docId}`, payload);
      alert("Alterações salvas no servidor!");
    } catch (err) {
      console.error("Erro ao salvar documento:", err);
      alert("Falha ao salvar alterações no servidor.");
    }
  };

  // 🔑 Shortcut: Ctrl + S
  useEffect(() => {
    const onKeyDown = (e) => {
      // Check if Ctrl + S
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleSave]);

  // If no sheets loaded yet, show a loading indicator
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
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
        <p className="mt-4 text-gray-600">Carregando dados da planilha...</p>
      </div>
    );
  }

  // FortuneSheet config
  const workbookOptions = {
    data: sheets,
    showToolbar: true,
    showGrid: true,
    showContextmenu: true,
    allowEdit: true,
    onChange: handleChange,
    style: { width: "100%", height: "calc(100vh - 40px)" },
  };

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Row with Save + Export side by side */}
      <div className="p-2 flex items-center space-x-2 bg-gray-200">
        <button
          onClick={handleSave}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Salvar
        </button>
      </div>

      <div style={{ flex: 1 }}>
        <Workbook {...workbookOptions} />
        <ExportButton sheets={sheets} />
      </div>
    </div>
  );
}

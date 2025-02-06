import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import * as XLSX from 'xlsx';

const ExportButton = () => {
  const location = useLocation();
  const sheets = location.state?.data || [];

  const [showOptions, setShowOptions] = useState(false);

  // Toggle export options
  const toggleOptions = () => setShowOptions(!showOptions);

  // Convert sheet data to text format (TXT)
  const convertSheetToText = (sheet) => {
    const maxColumns = Math.max(...sheet.celldata.map(cell => cell.c)) + 1;

    const rowsByNumber = sheet.celldata.reduce((acc, cell) => {
      if (!acc[cell.r]) acc[cell.r] = new Array(maxColumns).fill('');
      acc[cell.r][cell.c] = cell.v || '';
      return acc;
    }, {});

    const filteredRows = Object.entries(rowsByNumber).filter(([rowNum]) => parseInt(rowNum, 10) > 0);
    const textRows = filteredRows.map(([_, row]) => `|${row.map(value => value.trim()).join('|')}|`);

    return textRows.join('\n');
  };

  // Export as .TXT
  const exportToTextFile = () => {
    const textContent = sheets.map(convertSheetToText).join('\n');
    downloadFile(textContent, 'exported_data.txt', 'text/plain');
  };

  // Export as .CSV (EXACT table structure)
  const exportToCSV = () => {
    let csvContent = "";

    sheets.forEach((sheet, sheetIndex) => {
      const maxColumns = Math.max(...sheet.celldata.map(cell => cell.c)) + 1;
      const rowMap = new Map();

      sheet.celldata.forEach(cell => {
        if (!rowMap.has(cell.r)) rowMap.set(cell.r, new Array(maxColumns).fill(''));
        rowMap.get(cell.r)[cell.c] = cell.v || '';
      });

      const tableData = Array.from(rowMap.values());

      // Convert to CSV format (comma-separated)
      csvContent += tableData.map(row => row.map(value => `"${value}"`).join(',')).join('\n');
      if (sheets.length > 1 && sheetIndex < sheets.length - 1) {
        csvContent += '\n\n'; // Separate sheets with extra lines
      }
    });

    downloadFile(csvContent, 'exported_data.csv', 'text/csv');
  };

  // Export as .XLSX (Table format)
  const exportToXLSX = () => {
    const workbook = XLSX.utils.book_new();

    sheets.forEach((sheet, index) => {
      const maxColumns = Math.max(...sheet.celldata.map(cell => cell.c)) + 1;
      const rowMap = new Map();

      sheet.celldata.forEach(cell => {
        if (!rowMap.has(cell.r)) rowMap.set(cell.r, new Array(maxColumns).fill(''));
        rowMap.get(cell.r)[cell.c] = cell.v || '';
      });

      // Convert to 2D array format
      const data = Array.from(rowMap.values());

      const worksheet = XLSX.utils.aoa_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, `Sheet${index + 1}`);
    });

    XLSX.writeFile(workbook, 'exported_data.xlsx');
  };

  // Download helper function
  const downloadFile = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed bottom-10 right-10 flex flex-col items-end">
      {/* Export Options - Floating Buttons */}
      <div className={`transition-all duration-300 ${showOptions ? 'mb-2 opacity-100' : 'mb-0 opacity-0'} flex flex-col space-y-2`}>
        <button onClick={exportToTextFile} className="bg-gray-700 text-white py-2 px-4 rounded-full shadow-md hover:bg-gray-800">
          Export TXT
        </button>
        <button onClick={exportToCSV} className="bg-green-500 text-white py-2 px-4 rounded-full shadow-md hover:bg-green-600">
          Export CSV
        </button>
        <button onClick={exportToXLSX} className="bg-blue-500 text-white py-2 px-4 rounded-full shadow-md hover:bg-blue-600">
          Export XLSX
        </button>
      </div>

      {/* Main Export Button */}
      <button 
        onClick={toggleOptions}
        className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-4 rounded-full shadow-xl"
      >
        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M9 7V2.221a2 2 0 0 0-.5.365L4.586 6.5a2 2 0 0 0-.365.5H9Zm2 0V2h7a2 2 0 0 1 2 2v9.293l-2-2a1 1 0 0 0-1.414 1.414l.293.293h-6.586a1 1 0 1 0 0 2h6.586l-.293.293A1 1 0 0 0 18 16.707l2-2V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9h5a2 2 0 0 0 2-2Z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

export default ExportButton;

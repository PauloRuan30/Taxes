# export_utils.py
from typing import Dict, List
import io
import pandas as pd
from fastapi import HTTPException

def export_file(file_obj: Dict) -> Dict:
    """
    Convert the updated file data back into the original TXT format,
    splitting the export into separate files based on the unique file-level IDs
    (ID_DT_INI, ID_DT_FIN, ID_CNPJ) that were prepended.
    
    For each sheet in file_obj["sheets"]:
      - Reconstruct rows from the celldata.
      - Group data rows by the tuple (ID_DT_INI, ID_DT_FIN, ID_CNPJ) found in columns 0,1,2.
      - Skip the header row (r == 0) and remove the ID columns from the output.
    
    Returns:
        A dictionary mapping a generated file name (based on the IDs) to the file content (as a TXT string).
    """
    file_exports = {}  # key: file_id string, value: list of lines (strings)

    for sheet in file_obj.get("sheets", []):
        # Reconstruct rows by grouping cells by row index
        rows_dict = {}
        for cell in sheet.get("celldata", []):
            r = cell.get("r")
            c = cell.get("c")
            # Extract cell value (handle dict case)
            value = cell.get("v", {}).get("v", "") if isinstance(cell.get("v"), dict) else cell.get("v", "")
            rows_dict.setdefault(r, {})[c] = str(value)
        
        # Process only data rows (r > 0), skipping header row (r == 0)
        for r in sorted(rows_dict.keys()):
            if r == 0:
                continue  # Skip header row
            row_cells = rows_dict[r]
            max_col = max(row_cells.keys()) if row_cells else -1
            row_list = [row_cells.get(col, "") for col in range(max_col + 1)]
            # Use the first three columns (IDs) for grouping but remove them from export
            file_id_tuple = (row_list[0], row_list[1], row_list[2])
            file_id_str = "_".join(file_id_tuple)
            if file_id_str not in file_exports:
                file_exports[file_id_str] = []
            # Remove the first three ID columns before exporting the row
            trimmed_row_list = row_list[3:]
            # Reconstruct the row as a pipe-separated line.
            line = "|" + "|".join(trimmed_row_list) + "|"
            file_exports[file_id_str].append(line)
    
    # Join each file's list of lines into a single string.
    for key in file_exports:
        file_exports[key] = "\n".join(file_exports[key])
    return file_exports

def export_file_to_csv(file_obj: Dict) -> str:
    """
    Convert the updated file data into CSV format.
    (Not splitting by file IDs here, but similar grouping logic could be applied if needed.)
    Returns a CSV string.
    """
    csv_lines = []
    selected_blocks = file_obj.get("selectedBlocks")
    
    for sheet in file_obj.get("sheets", []):
        if selected_blocks and sheet.get("name") not in selected_blocks:
            continue

        rows_dict = {}
        for cell in sheet.get("celldata", []):
            if cell.get("r") == 0:
                continue  # Skip header row
            r = cell.get("r")
            c = cell.get("c")
            value = cell.get("v", {}).get("v", "") if isinstance(cell.get("v"), dict) else cell.get("v", "")
            rows_dict.setdefault(r, {})[c] = str(value)
        for row_idx in sorted(rows_dict.keys()):
            row_cells = rows_dict[row_idx]
            max_col = max(row_cells.keys()) if row_cells else -1
            row_list = [row_cells.get(col, "") for col in range(max_col + 1)]
            csv_line = ",".join(f'"{cell}"' for cell in row_list)
            csv_lines.append(csv_line)
        csv_lines.append("")  # Separate sheets with a blank line
    return "\n".join(csv_lines)

def export_file_to_xlsx(file_obj: Dict) -> bytes:
    """
    Convert the updated file data into an Excel (XLSX) file.
    Each sheet from file_obj becomes a worksheet.
    Returns the XLSX file as bytes.
    """
    output = io.BytesIO()
    selected_blocks = file_obj.get("selectedBlocks")
    
    with pd.ExcelWriter(output, engine="openpyxl") as writer:
        for sheet in file_obj.get("sheets", []):
            if selected_blocks and sheet.get("name") not in selected_blocks:
                continue
            if not sheet.get("celldata"):
                continue
            # Determine the dimensions of the sheet
            max_row = max(cell["r"] for cell in sheet["celldata"]) + 1
            max_col = max(cell["c"] for cell in sheet["celldata"]) + 1
            data = [["" for _ in range(max_col)] for _ in range(max_row)]
            for cell in sheet.get("celldata", []):
                r = cell.get("r", 0)
                c = cell.get("c", 0)
                val = cell.get("v", {}).get("v", "") if isinstance(cell.get("v"), dict) else cell.get("v", "")
                data[r][c] = val
            df = pd.DataFrame(data)
            sheet_name = sheet.get("name", "Sheet")[:31]  # Limit to 31 characters
            df.to_excel(writer, sheet_name=sheet_name, index=False, header=False)
        writer.save()
    output.seek(0)
    return output.read()

# export_utils.py
from typing import Dict, List
import io
import pandas as pd
from fastapi import HTTPException

def export_file(file_obj: Dict) -> str:
    """
    Convert the updated file data back into the original TXT format.
    If file_obj has a 'selectedBlocks' list, only export sheets whose 'name'
    is in that list. Skips header row (r == 0) and reconstructs rows as pipe-separated strings.
    Returns a string representing the entire file.
    """
    all_lines = []
    selected_blocks = file_obj.get("selectedBlocks")
    
    for sheet in file_obj.get("sheets", []):
        if selected_blocks and sheet.get("name") not in selected_blocks:
            continue

        rows_dict = {}
        for cell in sheet.get("celldata", []):
            r = cell.get("r")
            if r == 0:
                continue  # Skip header row
            c = cell.get("c")
            value = cell.get("v", {}).get("v", "") if isinstance(cell.get("v"), dict) else cell.get("v", "")
            rows_dict.setdefault(r, {})[c] = str(value)
        for row_idx in sorted(rows_dict.keys()):
            row_cells = rows_dict[row_idx]
            max_col = max(row_cells.keys()) if row_cells else -1
            row_list = [row_cells.get(col, "") for col in range(max_col + 1)]
            line = "|" + "|".join(row_list) + "|"
            all_lines.append(line)
    return "\n".join(all_lines)

def export_file_to_csv(file_obj: Dict) -> str:
    """
    Convert the updated file data into CSV format.
    If file_obj has a 'selectedBlocks' list, only export sheets whose 'name' is in that list.
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
    If file_obj has a 'selectedBlocks' list, only export those sheets.
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

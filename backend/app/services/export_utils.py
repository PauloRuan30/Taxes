# export_utils.py
import io
import zipfile
from typing import Dict, List
from fastapi import HTTPException, Response

def export_file(file_obj: Dict) -> str:
    """
    Convert the updated file data (with sheets) back into the original text format.
    For each sheet (block) in file_obj['sheets'], skip the header row (r==0),
    reconstruct the rows (each row is pipe-separated) and then concatenate all blocks.
    
    Returns a string representing the entire file.
    """
    all_lines = []
    # Iterate through each sheet (block) in the file.
    for sheet in file_obj.get("sheets", []):
        # Create a dictionary grouping cells by row (skip header row r==0)
        rows_dict = {}
        for cell in sheet.get("celldata", []):
            r = cell.get("r")
            if r == 0:
                continue  # skip header row
            c = cell.get("c")
            # The cell value may be stored as a dict or a simple string.
            value = cell.get("v", {}).get("v", "") if isinstance(cell.get("v"), dict) else cell.get("v", "")
            rows_dict.setdefault(r, {})[c] = str(value)
        # For each row, build a list of cells (fill missing with empty strings)
        for row_idx in sorted(rows_dict.keys()):
            row_cells = rows_dict[row_idx]
            # Determine number of columns: use max column index + 1
            max_col = max(row_cells.keys()) if row_cells else -1
            row_list = [row_cells.get(col, "") for col in range(max_col + 1)]
            # Reconstruct the line as |cell1|cell2|...|cellN|
            line = "|" + "|".join(row_list) + "|"
            all_lines.append(line)
    return "\n".join(all_lines)

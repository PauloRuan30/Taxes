import os
import shutil
import tempfile
import pandas as pd
import chardet
from typing import List, Dict
from headers_config import BlockHeaders  # Import the class instead of a dictionary

MAX_FILE_SIZE = 200 * 1024 * 1024  # 200MB limit

# === 🔹 Detect Encoding Function === #
def detect_encoding(file_path: str) -> str:
    """Detects the file encoding and ensures UTF-8 compatibility."""
    with open(file_path, 'rb') as f:
        raw_data = f.read(4096)  # Read first 4KB to detect encoding
        result = chardet.detect(raw_data)
        detected_encoding = result.get("encoding", "utf-8")

    print(f"🔍 Detected encoding for {file_path}: {detected_encoding}")

    if detected_encoding.lower() in ["ascii", "us-ascii"]:
        print(f"⚠️ ASCII detected. Forcing UTF-8 for {file_path}")
        return "utf-8"

    return detected_encoding

# === 🔹 Process TXT Files and Merge Blocks with IDs === #
def process_txt(file_paths: List[str]) -> Dict[str, List[Dict]]:
    """
    Processes multiple .txt files, extracts file-level identifiers (DT_INI, DT_FIN, CNPJ)
    from the '0000' block, and merges data into a JSON structure.
    
    Each row in the output gets prepended with three columns:
      - ID_DT_INI
      - ID_DT_FIN
      - ID_CNPJ
    so that later each file can be exported separately with its own identifiers.
    
    Args:
        file_paths (List[str]): List of file paths to process.

    Returns:
        Dict[str, List[Dict]]: Processed data in a FortuneSheet-friendly JSON format.
    """
    merged_grouped_data = {}  # Dictionary to store merged data from all files

    for file_path in file_paths:
        encoding = detect_encoding(file_path)

        # Convert file to UTF-8 if needed
        utf8_file_path = file_path + "_utf8.txt"
        with open(file_path, "r", encoding=encoding, errors="ignore") as f_in, \
             open(utf8_file_path, "w", encoding="utf-8") as f_out:
            for line in f_in:
                cleaned_line = line.strip().strip('|')  # Remove leading/trailing pipes
                f_out.write(cleaned_line + "\n")  # Rewrite cleaned line

        # === 🔹 Read & Normalize Columns === #
        with open(utf8_file_path, "r", encoding="utf-8") as f:
            lines = f.readlines()

        # Find the maximum number of columns in the dataset
        max_columns = max([len(line.split("|")) for line in lines])
        print(f"🔍 Maximum columns detected in {file_path}: {max_columns}")

        # Normalize all lines to match max_columns
        normalized_lines = []
        for line in lines:
            fields = line.strip().split("|")
            while len(fields) < max_columns:
                fields.append("")  # Add missing columns
            normalized_lines.append(fields)

        # Remove the temporary UTF8 file
        os.remove(utf8_file_path)

        # === 🔹 Extract File-Level IDs from "0000" Block === #
        # Default values in case "0000" is not found.
        file_ids = {"ID_DT_INI": "", "ID_DT_FIN": "", "ID_CNPJ": ""}
        for fields in normalized_lines:
            if fields and fields[0].strip() == "0000":
                # Assuming the positions: DT_INI at index 5, DT_FIN at index 6, CNPJ at index 8
                file_ids["ID_DT_INI"] = fields[5].strip() if len(fields) > 5 else ""
                file_ids["ID_DT_FIN"] = fields[6].strip() if len(fields) > 6 else ""
                file_ids["ID_CNPJ"] = fields[8].strip() if len(fields) > 8 else ""
                print(f"Extracted IDs from {file_path}: {file_ids}")
                break

        # Convert normalized lines to Pandas DataFrame for easier processing/debugging
        df_pd = pd.DataFrame(normalized_lines)
        print(f"📊 Data shape for {file_path}: {df_pd.shape}")
        print("DataFrame preview:")
        print(df_pd.head())

        # === 🔹 Group Data by Record Type and Attach File IDs === #
        # Instead of just storing rows, we store tuples: (row data, file_ids)
        for _, row in df_pd.iterrows():
            block_type = str(row[0]).strip() if pd.notna(row[0]) else "UNKNOWN"
            # Ignore invalid block types (corrupted characters, non-alphanumeric)
            if not block_type.isalnum():
                print(f"⚠️ Skipping invalid block: {block_type}")
                continue

            if block_type not in merged_grouped_data:
                merged_grouped_data[block_type] = []
            # Attach the file_ids (same for all rows from this file)
            merged_grouped_data[block_type].append((row.tolist(), file_ids))

    # === 🔹 Convert to FortuneSheet Format, Prepending ID Columns === #
    fortune_sheets = []
    for block_type, rows in merged_grouped_data.items():
        sheet_data = []

        # Get the original headers using the BlockHeaders class method
        headers = BlockHeaders.get_headers(block_type)
        # Prepend our new ID headers
        id_headers = ["ID_DT_INI", "ID_DT_FIN", "ID_CNPJ"]
        full_headers = id_headers + headers
        total_columns = len(full_headers)

        # Create the header row (always row 0)
        for col_idx, header in enumerate(full_headers):
            sheet_data.append({
                "r": 0,  # header row
                "c": col_idx,
                "v": {
                    "v": header if header is not None else "",
                    "m": header if header is not None else "",
                    "ct": {"fa": "General", "t": "g"},
                    "bl": 1
                }
            })

        # Add data rows (starting from row index 1)
        row_idx = 1
        # We assume that the original data should only have as many columns as in the original header list.
        orig_cols = len(headers)
        for (row, file_ids) in rows:
            # Build a new row by prepending the file IDs to the original row (truncated/padded as needed)
            id_values = [file_ids["ID_DT_INI"], file_ids["ID_DT_FIN"], file_ids["ID_CNPJ"]]
            original_data = row[:orig_cols]
            full_row = id_values + original_data
            # Ensure the full row has the expected number of columns (total_columns)
            while len(full_row) < total_columns:
                full_row.append("")
            for col_idx, value in enumerate(full_row):
                if pd.notna(value):
                    sheet_data.append({
                        "r": row_idx,
                        "c": col_idx,
                        "v": {
                            "v": value.strip() if isinstance(value, str) else value,
                            "m": str(value).strip(),
                            "ct": {"fa": "General", "t": "g"}
                        }
                    })
            row_idx += 1

        # Append each block as a separate sheet
        fortune_sheets.append({
            "name": block_type,  # e.g., "0000", "0100", etc.
            "celldata": sheet_data
        })

    return fortune_sheets

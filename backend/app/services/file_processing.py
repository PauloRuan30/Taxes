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

# === 🔹 Process TXT Files and Merge Blocks === #
def process_txt(file_paths: List[str]) -> Dict[str, List[Dict]]:
    """
    Processes multiple .txt files and merges data into FortuneSheet JSON format, ensuring consistent headers.
    
    Args:
        file_paths (List[str]): List of file paths to process.

    Returns:
        Dict[str, List[Dict]]: Processed data in a FortuneSheet-friendly format.
    """
    merged_grouped_data = {}  # Dictionary to store merged data from all files

    for file_path in file_paths:
        encoding = detect_encoding(file_path)

        # Convert file to UTF-8 if needed
        utf8_file_path = file_path + "_utf8.txt"
        with open(file_path, "r", encoding=encoding, errors="ignore") as f_in, open(utf8_file_path, "w", encoding="utf-8") as f_out:
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

        # Convert to Pandas DataFrame
        df_pd = pd.DataFrame(normalized_lines)
        print(f"📊 Data shape for {file_path}: {df_pd.shape}")

        # Group data by the first column (record type)
        for _, row in df_pd.iterrows():
            block_type = str(row[0]).strip() if pd.notna(row[0]) else "UNKNOWN"

            # Ignore invalid block types (corrupted characters, non-alphanumeric)
            if not block_type.isalnum():
                print(f"⚠️ Skipping invalid block: {block_type}")
                continue

            # Merge records from different files
            if block_type not in merged_grouped_data:
                merged_grouped_data[block_type] = []
            merged_grouped_data[block_type].append(row.tolist())

        os.remove(utf8_file_path)  # Clean up temp file

    # === 🔹 Convert to FortuneSheet format === #
    fortune_sheets = []
    for block_type, rows in merged_grouped_data.items():
        sheet_data = []
        
        # Get headers using the BlockHeaders class method
        headers = BlockHeaders.get_headers(block_type)
        expected_columns = len(headers)

        # Ensure headers appear only once at the top
        for col_idx, header in enumerate(headers):
            sheet_data.append({
                "r": 0,  # Always the first row
                "c": col_idx,  # Column index
                "v": {
                    "v": header,
                    "m": header,
                    "ct": {"fa": "General", "t": "g"},
                    "bl": 1
                }
            })

        # Add merged data rows
        row_idx = 1
        for row in rows:
            row = row[:expected_columns]  # Truncate to match expected columns
            for col_idx, value in enumerate(row):
                if pd.notna(value):
                    sheet_data.append({
                        "r": row_idx,
                        "c": col_idx,
                        "v": {
                            "v": value.strip(),
                            "m": str(value).strip(),
                            "ct": {"fa": "General", "t": "g"}
                        }
                    })
            row_idx += 1  # Increment row index for FortuneSheet

        # Append each block as a separate sheet
        fortune_sheets.append({
            "name": block_type,  # Correct sheet name without "Block"
            "celldata": sheet_data
        })

    return fortune_sheets

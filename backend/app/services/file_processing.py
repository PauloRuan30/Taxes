import os
import shutil
import tempfile
import pandas as pd
import chardet
from typing import List, Dict, Generator
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

# === 🔹 Stream & Normalize Lines Generator === #
def stream_normalized_lines(file_path: str, encoding: str) -> Generator[List[str], None, None]:
    """
    Reads a file line-by-line, cleans each line, splits by the delimiter, 
    and yields a list of fields.
    """
    with open(file_path, "r", encoding=encoding, errors="ignore") as f:
        for line in f:
            # Remove leading/trailing whitespace and pipes, then split
            fields = line.strip().strip('|').split("|")
            yield fields

def process_single_file(file_path: str) -> pd.DataFrame:
    """
    Process a single file: convert it to UTF-8 on the fly and normalize columns.
    Returns a DataFrame of the normalized rows.
    """
    encoding = detect_encoding(file_path)
    # Use the generator to avoid reading the entire file into memory
    rows_gen = list(stream_normalized_lines(file_path, encoding))
    
    if not rows_gen:
        return pd.DataFrame()  # return empty DF if no rows
    
    # Determine maximum number of columns in this file
    max_columns = max(len(row) for row in rows_gen)
    print(f"🔍 Maximum columns detected in {file_path}: {max_columns}")
    
    # Normalize rows: extend rows with missing columns
    normalized_rows = [row + [""] * (max_columns - len(row)) for row in rows_gen]
    
    df = pd.DataFrame(normalized_rows)
    print(f"📊 Data shape for {file_path}: {df.shape}")
    return df

# === 🔹 Process Multiple Files and Merge Blocks === #
def process_txt(file_paths: List[str]) -> Dict[str, List[Dict]]:
    """
    Processes multiple .txt files, merges their data by block type, and
    converts it into FortuneSheet JSON format.
    """
    merged_grouped_data = {}  # To store merged data across files
    
    # Process each file and merge the DataFrames
    for file_path in file_paths:
        df_pd = process_single_file(file_path)
        # Group by first column (block type)
        for _, row in df_pd.iterrows():
            block_type = str(row[0]).strip() if pd.notna(row[0]) else "UNKNOWN"
            # Skip invalid block types (non-alphanumeric)
            if not block_type.isalnum():
                print(f"⚠️ Skipping invalid block: {block_type}")
                continue
            merged_grouped_data.setdefault(block_type, []).append(row.tolist())
    
    # === Convert merged data to FortuneSheet format === #
    fortune_sheets = []
    for block_type, rows in merged_grouped_data.items():
        sheet_data = []
        headers = BlockHeaders.get_headers(block_type)
        expected_columns = len(headers)
        # Write header row cell-by-cell
        for col_idx, header in enumerate(headers):
            sheet_data.append({
                "r": 0,
                "c": col_idx,
                "v": {
                    "v": header,
                    "m": header,
                    "ct": {"fa": "General", "t": "g"},
                    "bl": 1
                }
            })
        # Add data rows (truncate to expected columns)
        row_idx = 1
        for row in rows:
            row = row[:expected_columns]
            for col_idx, value in enumerate(row):
                if value is not None:
                    sheet_data.append({
                        "r": row_idx,
                        "c": col_idx,
                        "v": {
                            "v": value.strip(),
                            "m": value.strip(),
                            "ct": {"fa": "General", "t": "g"}
                        }
                    })
            row_idx += 1
        fortune_sheets.append({
            "name": block_type,  # Use block type as the sheet name
            "celldata": sheet_data
        })
    
    return fortune_sheets

# Optionally, to process files concurrently, you can use:
if __name__ == "__main__":
    # Example: process a list of files concurrently
    from concurrent.futures import ThreadPoolExecutor
    test_files = ["file1.txt", "file2.txt", "file3.txt"]
    with ThreadPoolExecutor() as executor:
        dfs = list(executor.map(process_single_file, test_files))
    # Merge data from dfs if needed...

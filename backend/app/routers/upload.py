import os
import shutil
import tempfile
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import List, Dict
from services.file_processing import process_txt  # Import processing function

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

MAX_FILE_SIZE = 200 * 1024 * 1024  # 200MB limit

@router.post("/upload/")
async def upload_files(
    files: List[UploadFile] = File(...),
    company_id: str = Form(...)
):
    """Handles multiple file uploads and processes them for FortuneSheet."""
    result = {"data": [], "errors": []}
    file_paths = []

    for file in files:
        file.file.seek(0, 2)  # Move to end of file
        size = file.file.tell()
        file.file.seek(0)  # Reset pointer

        if size > MAX_FILE_SIZE:
            result["errors"].append({"filename": file.filename, "error": "File exceeds 200MB limit"})
            continue

        # Save file temporarily
        temp_file_path = tempfile.NamedTemporaryFile(delete=False).name
        with open(temp_file_path, "wb") as temp_file:
            shutil.copyfileobj(file.file, temp_file)

        file_paths.append(temp_file_path)

    try:
        # Process all files together to merge their data
        merged_sheets = process_txt(file_paths)

        result["data"].append({
            "company_id": company_id,
            "sheets": merged_sheets
        })
    except Exception as e:
        result["errors"].append({"error": str(e)})
    finally:
        # Remove temp files
        for temp_file_path in file_paths:
            os.remove(temp_file_path)

    return result

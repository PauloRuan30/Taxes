import os
import shutil
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import List, Dict
from services.file_processing import process_txt

router = APIRouter()
UPLOAD_DIR = "saved_files"  # Folder to store uploaded files
os.makedirs(UPLOAD_DIR, exist_ok=True)
MAX_FILE_SIZE = 200 * 1024 * 1024  # 200MB limit

@router.post("/upload/")
async def upload_files(
    files: List[UploadFile] = File(...),
    company_id: str = Form(...)
):
    """Handles multiple file uploads and saves them in a local folder per company."""
    result = {"data": [], "errors": []}
    company_folder = os.path.join(UPLOAD_DIR, company_id)
    os.makedirs(company_folder, exist_ok=True)  # Create company folder if it doesn't exist
    file_paths = []

    for file in files:
        file.file.seek(0, 2)  # Move to end of file
        size = file.file.tell()
        file.file.seek(0)  # Reset pointer
        
        if size > MAX_FILE_SIZE:
            result["errors"].append({"filename": file.filename, "error": "File exceeds 200MB limit"})
            continue

        # Save file permanently inside company folder
        file_path = os.path.join(company_folder, file.filename)
        with open(file_path, "wb") as output_file:
            shutil.copyfileobj(file.file, output_file)
        file_paths.append(file_path)

    try:
        # Process all files and generate a structured response
        merged_sheets = process_txt(file_paths)
        result["data"].append({
            "company_id": company_id,
            "sheets": merged_sheets
        })
    except Exception as e:
        result["errors"].append({"error": str(e)})

    return result

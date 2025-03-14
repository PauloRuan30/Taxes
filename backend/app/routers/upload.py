from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import List, Dict
import os
import shutil
from services.file_processing import process_txt
from mongodb import documents_collection  # <- Import the Documents collection

router = APIRouter()
UPLOAD_DIR = "saved_files"
MAX_FILE_SIZE = 200 * 1024 * 1024  # 200MB limit

@router.post("/upload/")
async def upload_files(
    files: List[UploadFile] = File(...),
    company_id: str = Form(...)
):
    """Handles multiple file uploads and saves them in a local folder per company."""
    result = {"data": [], "errors": []}
    file_paths = []

    # Create the company folder for permanent storage
    company_folder = os.path.join(UPLOAD_DIR, company_id)
    os.makedirs(company_folder, exist_ok=True)

    for file in files:
        # Check file size
        file.file.seek(0, 2)  # Move to end of file
        size = file.file.tell()
        file.file.seek(0)    # Reset pointer
        
        if size > MAX_FILE_SIZE:
            result["errors"].append({
                "filename": file.filename,
                "error": "File exceeds 200MB limit"
            })
            continue

        # Save file permanently inside company folder
        file_path = os.path.join(company_folder, file.filename)
        with open(file_path, "wb") as output_file:
            shutil.copyfileobj(file.file, output_file)
        file_paths.append(file_path)

    try:
        # 1) Process the text files to get a JSON-like structure
        merged_sheets = process_txt(file_paths)
        
        # 2) Insert into MongoDB
        # You can store additional metadata such as 'company_id', or the original file names, etc.
        document_data = {
            "company_id": company_id,
            "sheets": merged_sheets
            # You could also add "file_names": [file.filename for file in files] if you want
        }
        
        insert_result = await documents_collection.insert_one(document_data)
        
        result["data"].append({
            "company_id": company_id,
            "sheets": merged_sheets,
            "mongo_inserted_id": str(insert_result.inserted_id)
        })
    except Exception as e:
        result["errors"].append({"error": str(e)})

    return result

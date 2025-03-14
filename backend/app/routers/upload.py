# upload.py

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import List, Dict
import os
import shutil
from bson import ObjectId

from mongodb import documents_collection  # You must define this in mongodb.py
from services.file_processing import process_txt  # Your custom text -> JSON function

router = APIRouter()
UPLOAD_DIR = "saved_files"
MAX_FILE_SIZE = 200 * 1024 * 1024  # 200MB limit

#
# POST /upload/ : Upload and process new .txt files
#
#
@router.post("/upload/")
async def upload_files(
    files: List[UploadFile] = File(...),
    company_id: str = Form(...)
):
    result = {"data": [], "errors": []}
    file_paths = []

    company_folder = os.path.join(UPLOAD_DIR, company_id)
    os.makedirs(company_folder, exist_ok=True)

    for file in files:
        file.file.seek(0, 2)
        size = file.file.tell()
        file.file.seek(0)
        if size > MAX_FILE_SIZE:
            result["errors"].append({"filename": file.filename, "error": "File exceeds 200MB limit"})
            continue
        file_path = os.path.join(company_folder, file.filename)
        with open(file_path, "wb") as output_file:
            shutil.copyfileobj(file.file, output_file)
        file_paths.append(file_path)

    try:
        merged_sheets = process_txt(file_paths)
        # Check if a merged document exists for this company
        existing_doc = await documents_collection.find_one({"company_id": company_id})
        if existing_doc:
            new_sheets = existing_doc.get("sheets", []) + merged_sheets
            await documents_collection.update_one(
                {"_id": existing_doc["_id"]}, {"$set": {"sheets": new_sheets}}
            )
            doc_id = str(existing_doc["_id"])
            final_sheets = new_sheets
        else:
            doc = {"company_id": company_id, "sheets": merged_sheets}
            insert_result = await documents_collection.insert_one(doc)
            doc_id = str(insert_result.inserted_id)
            final_sheets = merged_sheets

        result["data"].append({
            "company_id": company_id,
            "sheets": final_sheets,
            "mongo_inserted_id": doc_id
        })
    except Exception as e:
        result["errors"].append({"error": str(e)})

    return result

#
# GET /documents/{doc_id} : Retrieve a single doc from the DB
#
@router.get("/documents/{doc_id}")
async def get_document(doc_id: str):
    try:
        obj_id = ObjectId(doc_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid doc id format")

    doc = await documents_collection.find_one({"_id": obj_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    return {
        "id": str(doc["_id"]),
        "company_id": doc["company_id"],
        "sheets": doc["sheets"],
    }

@router.delete("/documents/{company_id}/sheet/{sheet_index}")
async def delete_sheet(company_id: str, sheet_index: int):
    existing_doc = await documents_collection.find_one({"company_id": company_id})
    if not existing_doc:
        raise HTTPException(status_code=404, detail="Documento não encontrado para esta empresa.")
    sheets = existing_doc.get("sheets", [])
    if sheet_index < 0 or sheet_index >= len(sheets):
        raise HTTPException(status_code=400, detail="Índice da planilha inválido.")
    updated_sheets = sheets[:sheet_index] + sheets[sheet_index + 1:]
    await documents_collection.update_one(
        {"_id": existing_doc["_id"]}, {"$set": {"sheets": updated_sheets}}
    )
    return {"message": "Planilha excluída com sucesso", "sheets": updated_sheets}

#
# PUT /documents/{doc_id} : Update the "sheets" after user edits
#
@router.put("/documents/{doc_id}")
async def update_document(doc_id: str, data: Dict):
    """
    Expects JSON with something like:
    {
      "sheets": [...FortuneSheet data...],
      // optionally more fields
    }
    """
    try:
        obj_id = ObjectId(doc_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid doc id format")

    sheets = data.get("sheets")
    if not sheets:
        raise HTTPException(status_code=400, detail="Missing sheets data")

    update_result = await documents_collection.update_one(
        {"_id": obj_id}, {"$set": {"sheets": sheets}}
    )

    if update_result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Document not found")

    # Return the updated doc
    doc = await documents_collection.find_one({"_id": obj_id})
    return {
        "id": str(doc["_id"]),
        "company_id": doc["company_id"],
        "sheets": doc["sheets"],
    }

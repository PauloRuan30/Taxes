# export.py
import io
import zipfile
from fastapi import APIRouter, HTTPException, Response
from typing import List, Dict
from services.export_utils import export_file, export_file_to_xlsx, export_file_to_csv

router = APIRouter()

def create_zip_response(file_dicts: List[Dict], export_fn, file_extension: str, zip_filename: str) -> Response:
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
        for file_obj in file_dicts:
            exported = export_fn(file_obj)
            # If the export function returns a dictionary (file id -> content),
            # add each file separately.
            if isinstance(exported, dict):
                for file_name, file_content in exported.items():
                    if not file_name.endswith(file_extension):
                        file_name += file_extension
                    zip_file.writestr(file_name, file_content)
            else:
                # Otherwise, treat it as a single file.
                file_name = file_obj.get("file_name", "exported_file")
                if not file_name.endswith(file_extension):
                    file_name += file_extension
                zip_file.writestr(file_name, exported)
    zip_buffer.seek(0)
    return Response(
        content=zip_buffer.read(),
        media_type="application/zip",
        headers={"Content-Disposition": f"attachment; filename={zip_filename}"}
    )

@router.post("/export/")
async def export_txt(updated_files: List[Dict]) -> Response:
    if not updated_files:
        raise HTTPException(status_code=400, detail="No file data provided for export.")
    return create_zip_response(updated_files, export_file, ".txt", "exported_files.zip")

@router.post("/export/xlsx/")
async def export_xlsx(updated_files: List[Dict]) -> Response:
    if not updated_files:
        raise HTTPException(status_code=400, detail="No file data provided for export.")
    return create_zip_response(updated_files, export_file_to_xlsx, ".xlsx", "exported_files.xlsx.zip")

@router.post("/export/csv/")
async def export_csv(updated_files: List[Dict]) -> Response:
    if not updated_files:
        raise HTTPException(status_code=400, detail="No file data provided for export.")
    return create_zip_response(updated_files, export_file_to_csv, ".csv", "exported_files.csv.zip")

# export.py
import io
import zipfile
from fastapi import APIRouter, HTTPException, Response
from typing import List, Dict
from services.export_utils import export_file

router = APIRouter()

@router.post("/export/")
async def export_files(updated_files: List[Dict]) -> Response:
    """
    Expects a JSON payload containing a list of file objects, where each file object has a 'sheets' key.
    Returns a ZIP archive containing each file exported as a .txt file in the original pipe-separated format.
    Headers (assumed to be in row 0) are omitted.
    
    Example input:
    [
      {
        "file_name": "imported1.txt",
        "sheets": [ { "celldata": [ ... ] }, { "celldata": [ ... ] } ]
      },
      {
        "file_name": "imported2.txt",
        "sheets": [ { "celldata": [ ... ] } ]
      }
    ]
    """
    if not updated_files:
        raise HTTPException(status_code=400, detail="No file data provided for export.")

    # Create an in-memory ZIP archive.
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
        for file_obj in updated_files:
            file_name = file_obj.get("file_name", "exported_file")
            # Ensure the file name ends with .txt
            if not file_name.endswith(".txt"):
                file_name += ".txt"
            try:
                file_text = export_file(file_obj)
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Error exporting file {file_name}: {str(e)}")
            zip_file.writestr(file_name, file_text)
    zip_buffer.seek(0)
    return Response(
        content=zip_buffer.read(),
        media_type="application/zip",
        headers={"Content-Disposition": "attachment; filename=exported_files.zip"}
    )

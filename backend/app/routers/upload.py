from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List, Dict
from services.file_processing import process_file_in_chunks
from services.grouping import reassemble_c_blocks, convert_to_fortune_sheet_format
from headers_config import BlockHeaders

router = APIRouter()

CHUNK_SIZE = 8 * 1024 * 1024  # 4MB chunks
MAX_FILE_SIZE = 200 * 1024 * 1024  # 100MB limit

@router.post("/upload/")
async def upload_files(files: List[UploadFile] = File(...)):
    result = {"data": [], "errors": []}
    priority_blocks = BlockHeaders.get_all_block_types()
    consolidated_grouped_data: Dict[str, List[List[str]]] = {}

    for file in files:
        try:
            file.file.seek(0, 2)
            size = file.file.tell()
            file.file.seek(0)

            if size > MAX_FILE_SIZE:
                raise HTTPException(status_code=413, detail=f"File {file.filename} exceeds maximum size of 100MB")

            file_data = await process_file_in_chunks(file)

            for block_type, block_data in file_data.items():
                if block_type not in consolidated_grouped_data:
                    consolidated_grouped_data[block_type] = block_data
                else:
                    consolidated_grouped_data[block_type].extend(block_data)

        except Exception as e:
            result["errors"].append({"filename": file.filename, "error": str(e)})
            continue

    consolidated_grouped_data = reassemble_c_blocks(consolidated_grouped_data)
    fortune_sheet_data = convert_to_fortune_sheet_format(consolidated_grouped_data, priority_blocks)
    result["data"].extend(fortune_sheet_data)

    return result

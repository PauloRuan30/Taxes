import tempfile
import os
import re
import chardet
import dask.bag as db
from dask.distributed import Client
from typing import List, Dict, Tuple
from services.grouping import process_buffer

CHUNK_SIZE = 8 * 1024 * 1024  # 8MB chunks
BATCH_SIZE = 1000  # Number of rows to process in memory at once

def detect_encoding(file_path: str) -> str:
    """Detect file encoding by reading the first chunk."""
    with open(file_path, 'rb') as f:
        raw_chunk = f.read(CHUNK_SIZE)
        result = chardet.detect(raw_chunk)
    return result.get("encoding", "utf-8")

def process_line(line: str) -> Tuple[str, List[str]]:
    """Process a single line and return (block_type, fields) if valid."""
    line = line.strip('|')
    fields = line.split('|')
    if fields and re.match(r'^[A-Z0-9]{4}$', fields[0]):
        return fields[0], fields
    return None

async def process_file_in_chunks(file) -> Dict[str, List[List[str]]]:
    """Process a file asynchronously using Dask for parallel processing."""
    grouped_data: Dict[str, List[List[str]]] = {}

    # Save the uploaded file to a temporary location
    with tempfile.NamedTemporaryFile(mode='wb', delete=False) as temp_file:
        while chunk := await file.read(CHUNK_SIZE):
            temp_file.write(chunk)
        temp_file_path = temp_file.name

    try:
        client = Client()  # Initialize Dask client

        encoding = detect_encoding(temp_file_path)

        # Create a Dask Bag from the file
        bag = db.read_text(temp_file_path, encoding=encoding, errors='ignore')
        
        # Process lines in parallel, filtering out None values
        processed_bag = bag.map(process_line).filter(lambda x: x is not None)

        # Compute results in chunks
        buffer = []
        for block_type, fields in processed_bag.compute():
            buffer.append((block_type, fields))
            if len(buffer) >= BATCH_SIZE:
                await process_buffer(buffer, grouped_data)
                buffer = []  # Clear buffer

        # Process remaining lines
        if buffer:
            await process_buffer(buffer, grouped_data)

    finally:
        os.unlink(temp_file_path)  # Cleanup temp file
        client.close()  # Close Dask client

    return grouped_data

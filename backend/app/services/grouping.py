from typing import List, Dict
from headers_config import BlockHeaders


async def process_buffer(buffer: List[tuple], grouped_data: Dict[str, List[List[str]]]):
    current_c100 = None
    for block_type, fields in buffer:
        if block_type == "C100":
            current_c100 = fields
            grouped_data.setdefault(block_type, []).append(fields)
        elif block_type == "C170" and current_c100:
            grouped_data.setdefault("C100", []).append(fields)
        else:
            grouped_data.setdefault(block_type, []).append(fields)


def reassemble_c_blocks(grouped_data: Dict[str, List[List[str]]]) -> Dict[str, List[List[str]]]:
    if "C100" in grouped_data:
        c100_blocks = []
        temp_c100 = None

        for row in grouped_data["C100"]:
            if isinstance(row, list) and all(isinstance(cell, str) for cell in row):
                # Convert raw strings into cell objects
                formatted_row = [{"v": cell.strip(), "bl": 1} for cell in row]
            else:
                formatted_row = row  # Already formatted properly

            if row[0] == "C100":
                if temp_c100:
                    c100_blocks.append(temp_c100)
                temp_c100 = [formatted_row]
            elif row[0] == "C170" and temp_c100:
                temp_c100.append(formatted_row)

        if temp_c100:
            c100_blocks.append(temp_c100)

        grouped_data["C100"] = [item for sublist in c100_blocks for item in sublist]

    return grouped_data



def convert_to_fortune_sheet_format(grouped_data: Dict[str, List[List[str]]], priority_blocks: List[str]) -> List[Dict]:
    sheets = []
    processed_blocks = set()

    def create_sheet_generator(block_type: str, data: List[List[str]], order: int):
        headers = BlockHeaders.get_headers(block_type)
        if headers:
            data.insert(0, headers)

        sheet = {
            "name": f"{block_type}",
            "status": 1,
            "order": order,
            "row": len(data),
            "column": max(len(row) for row in data),
            "celldata": [],
            "config": {"authority": {"sheet": 0, "cell": 0}, "merge": {}, "rowlen": {}, "columnlen": {}},
        }

        batch = []
        for row_idx, row in enumerate(data):
            for col_idx, value in enumerate(row):
                # Ensure each cell follows the expected object structure
                cell_entry = {
                    "r": row_idx,
                    "c": col_idx,
                    "v": str(value).strip(),
                    "m": str(value).strip(),
                    "ct": {"fa": "General", "t": "g"},
                    "bl": 1,  # Ensure "bl" (block type) is present
                    "style": None,
                }
                sheet["celldata"].append(cell_entry)

        if len(batch) >= 1000:
            sheet["celldata"].extend(batch)
            batch = []

        if batch:
            sheet["celldata"].extend(batch)

        return sheet

    order = 0
    for block_type in priority_blocks:
        if block_type in grouped_data:
            sheets.append(create_sheet_generator(
                block_type, grouped_data[block_type], order))
            processed_blocks.add(block_type)
            order += 1

    for block_type, data in grouped_data.items():
        if block_type not in processed_blocks:
            sheets.append(create_sheet_generator(block_type, data, order))
            order += 1

    return sheets

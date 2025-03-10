# parsing_logic.py
import pandas as pd

# Example dictionary of headers for each block (simplified).
# Replace this with your actual headers dict, or import it from headers_config if needed.
BLOCK_HEADERS = {
    "C001": ["REG", "IND_MOV"],
    "C010": ["REG", "CNPJ", "IND_ESCRI"],
    "C100": [
        "REG", "IND_OPER", "IND_EMIT", "COD_PART", "COD_MOD", "COD_SIT",
        "SER", "NUM_DOC", "CHV_NFE", "DT_DOC", "DT_E_S", "VL_DOC", "IND_PGTO",
        "VL_DESC", "VL_ABAT_NT", "VL_MERC", "IND_FRT", "VL_FRT", "VL_SEG",
        "VL_OUT_DA", "VL_BC_ICMS", "VL_ICMS", "VL_BC_ICMS_ST", "VL_ICMS_ST",
        "VL_IPI", "VL_PIS", "VL_COFINS", "VL_PIS_ST", "VL_COFINS_ST"
    ],
    "C170": [
        "REG", "NUM_ITEM", "COD_ITEM", "DESCR_COMPL", "QTD", "UNID", "VL_ITEM",
        "VL_DESC", "IND_MOV", "CST_ICMS", "CFOP", "COD_NAT", "VL_BC_ICMS",
        "ALIQ_ICMS", "VL_ICMS", "VL_BC_ICMS_ST", "ALIQ_ST", "VL_ICMS_ST",
        "IND_APUR", "CST_IPI", "COD_ENQ", "VL_BC_IPI", "ALIQ_IPI", "VL_IPI",
        "CST_PIS", "VL_BC_PIS", "ALIQ_PIS", "QUANT_BC_PIS", "ALIQ_PIS_QUANT",
        "VL_PIS", "CST_COFINS", "VL_BC_COFINS", "ALIQ_COFINS",
        "QUANT_BC_COFINS", "ALIQ_COFINS_QUANT", "VL_COFINS", "COD_CTA"
    ],
    # etc. for other C blocks if needed
}


def parse_block_c(lines, file_ids):
    """
    Given the lines for "Block C" (C001, C010, C100, C170, etc.),
    returns a single FortuneSheet-style sheet with one row per C170.

    :param lines: List of strings (each line from the .txt, already split or not).
    :param file_ids: Dict with { "ID_DT_INI": "...", "ID_DT_FIN": "...", "ID_CNPJ": "..." }
                     to prepend to each row.
    :return: A dict representing one FortuneSheet "sheet" with merged columns.
    """

    # Context dicts
    c001_data = {}
    c010_data = {}
    c100_data = {}

    merged_rows = []  # final row data, each a dict of {col_name: value}

    for line in lines:
        # Split line by "|", removing empty parts if there's a leading/trailing "|"
        parts = [p.strip() for p in line.strip().split("|") if p.strip() != ""]
        if not parts:
            continue

        block_code = parts[0]
        if block_code not in BLOCK_HEADERS:
            # If it's not one of the known blocks, skip or handle as needed
            continue

        # Build a dictionary for this line's block data
        block_cols = BLOCK_HEADERS[block_code]
        block_data = {}
        for i, col_name in enumerate(block_cols):
            if i < len(parts):
                block_data[col_name] = parts[i]
            else:
                block_data[col_name] = ""

        # Now store or merge based on which block we have
        if block_code == "C001":
            c001_data = block_data
        elif block_code == "C010":
            c010_data = block_data
        elif block_code == "C100":
            c100_data = block_data
        elif block_code == "C170":
            # Produce a row merging the context + C170 + file_ids
            row = {}

            # File-level IDs first
            row["ID_DT_INI"] = file_ids.get("ID_DT_INI", "")
            row["ID_DT_FIN"] = file_ids.get("ID_DT_FIN", "")
            row["ID_CNPJ"]   = file_ids.get("ID_CNPJ", "")

            # Merge C001, C010, C100, then C170
            row.update(c001_data)
            row.update(c010_data)
            row.update(c100_data)
            row.update(block_data)

            merged_rows.append(row)

        else:
            # If you want to handle other lines like C110, C111, etc., do so similarly
            # or ignore them if you only care about C001/C010/C100/C170
            pass

    # === Build FortuneSheet from merged_rows === #

    # Decide the final column order. We'll combine:
    #   - ID columns
    #   - The headers for C001, C010, C100, and C170
    # in one list, but you can reorder or remove duplicates as needed.
    combined_headers = (
        ["ID_DT_INI", "ID_DT_FIN", "ID_CNPJ"]
        + BLOCK_HEADERS.get("C001", [])
        + BLOCK_HEADERS.get("C010", [])
        + BLOCK_HEADERS.get("C100", [])
        + BLOCK_HEADERS.get("C170", [])
    )

    # Remove duplicates if any columns appear in multiple blocks
    # (e.g., 'REG' might appear in each block)
    seen = set()
    final_columns = []
    for col in combined_headers:
        if col not in seen:
            seen.add(col)
            final_columns.append(col)

    # 1) Header row (r=0)
    celldata = []
    for col_idx, col_name in enumerate(final_columns):
        celldata.append({
            "r": 0,
            "c": col_idx,
            "v": {
                "v": col_name,
                "m": col_name,
                "ct": {"fa": "General", "t": "g"},
                "bl": 1
            }
        })

    # 2) Data rows (r=1..N)
    row_idx = 1
    for row_dict in merged_rows:
        for col_idx, col_name in enumerate(final_columns):
            value = row_dict.get(col_name, "")
            celldata.append({
                "r": row_idx,
                "c": col_idx,
                "v": {
                    "v": value,
                    "m": str(value),
                    "ct": {"fa": "General", "t": "g"}
                }
            })
        row_idx += 1

    # Return a single sheet named "Block C" (or any name you want)
    return {
        "name": "Block C",
        "celldata": celldata
    }

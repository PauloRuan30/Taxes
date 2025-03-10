# headers_config.py

class BlockHeaders:
    """
    Centralized configuration for block headers across different registration types
    """
    
    BLOCK_HEADERS = {
        # Existing headers
        '0000': [
            'REG', 'COD_VER', 'TIPO_ESCRIT', 'IND_SIT_ESP', 'NUM_REC_ANTERIOR', 
            'DT_INI', 'DT_FIN', 'NOME', 'CNPJ', 'UF', 'COD_MUN', 'SUFRAMA', 
            'IND_NAT_PJ', 'IND_ATIV'
        ],
        '0001': ['REG', 'IND_MOV'],
        '0100': [
            'REG', 'NOME', 'CPF', 'CRC', 'CNPJ', 'CEP', 'END', 'NUM', 
            'COMPL', 'BAIRRO', 'FONE', 'FAX', 'EMAIL', 'COD_MUN'
        ],
        '0110': ["REG",'COD_INC_TRIB','IND_APRO_CRED','COD_TIPO_CONT','IND_REG_CUM'],
        '0111': ['REG','REC_BRU_NCUM_TRIB_MI','REC_BRU_NCUM_NT_MI','REC_BRU_ NCUM_EXP','REC_BRU_CUM','REC_BRU_TOTAL'],
        '0120': ['REG', 'MES_DISPENSA', 'INF_COMP'],
        '0140': ['REG', 'COD_EST', 'NOME', 'CNPJ', 'UF', 'IE', 'COD_MUN', 'IM', 'SUFRAMA'],
        '0145': ['REG', 'COD_INC_TRIB', 'VL_REC_TOT', 'VL_REC_ATIV', 'VL_REC_DEMAIS_ATIV', 'INFO_COMPL'],
        '0150': [
            'REG', 'COD_PART', 'NOME', 'COD_PAIS', 'CNPJ', 'CPF', 'IE', 
            'COD_MUN', 'SUFRAMA', 'END', 'NUM', 'COMPL', 'BAIRRO'
        ],
        '0190': ['REG', 'UNID', 'DESCR'],
        '0200': [
            'REG', 'COD_ITEM', 'DESCR_ITEM', 'COD_BARRA', 'COD_ANT_ITEM', 
            'UNID_INV', 'TIPO_ITEM', 'COD_NCM', 'EX_IPI', 'COD_GEN', 
            'COD_LST', 'ALIQ_ICMS'
        ],
        '0205': ['REG', 'DESCR_ANT_ITEM', 'DT_INI', 'DT_FIM', 'COD_ANT_ITEM'],
        '0206': ['REG', 'COD_COMB'],
        '0208': ['REG', 'COD_TAB', 'COD_GRU', 'MARCA_COM'],
        '0400': ['REG', 'COD_NAT', 'DESCR_NAT'],
        '0450': ['REG', 'COD_INF', 'TXT'],
        '0500': [
            'REG', 'DT_ALT', 'COD_NAT_CC', 'IND_CTA', 'NÍVEL', 'COD_CTA', 
            'NOME_CTA', 'COD_CTA_REF', 'CNPJ_EST'
        ],
        '0600': ['REG', 'DT_ALT', 'COD_CCUS', 'CCUS'],
        '0990': ['REG', 'QTD_LIN_0'],

        # A-block headers
        'A001': ['REG', 'IND_MOV'],
        'A010': ['REG', 'CNPJ'],
        'A100': [
            'REG', 'IND_OPER', 'IND_EMIT', 'COD_PART', 'COD_SIT', 'SER', 
            'SUB', 'NUM_DOC', 'CHV_NFSE', 'DT_DOC', 'DT_EXE_SERV', 'VL_DOC', 
            'IND_PGTO', 'VL_DESC', 'VL_BC_PIS', 'VL_PIS', 'VL_BC_COFINS', 
            'VL_COFINS', 'VL_PIS_RET', 'VL_COFINS_RET', 'VL_ISS'
        ],
        'A110': ['REG', 'COD_INF', 'TXT_COMPL'],
        'A111': ['REG', 'NUM_PROC', 'IND_PROC'],
        'A120': [
            'REG', 'VL_TOT_SERV', 'VL_BC_PIS', 'VL_PIS_IMP', 'DT_PAG_PIS', 
            'VL_BC_COFINS', 'VL_COFINS_IMP', 'DT_PAG_COFINS', 'LOC_EXE_SERV'
        ],
        'A170': [
            'REG', 'NUM_ITEM', 'COD_ITEM', 'DESCR_COMPL', 'VL_ITEM', 'VL_DESC', 
            'NAT_BC_CRED', 'IND_ORIG_CRED', 'CST_PIS', 'VL_BC_PIS', 'ALIQ_PIS', 
            'VL_PIS', 'CST_COFINS', 'VL_BC_COFINS', 'ALIQ_COFINS', 'VL_COFINS', 
            'COD_CTA', 'COD_CCUS'
        ],
        'A990': ['REG', 'QTD_LIN_A'],

        # C-block headers
        'C001': ['REG', 'IND_MOV'],
        'C010': ['REG', 'CNPJ', 'IND_ESCRI'],
        'C100': [
            'REG', 'IND_OPER', 'IND_EMIT', 'COD_PART', 'COD_MOD', 'COD_SIT', 
            'SER', 'NUM_DOC', 'CHV_NFE', 'DT_DOC', 'DT_E_S', 'VL_DOC','IND_PGTO', 'VL_DESC', 
            'VL_ABAT_NT', 'VL_MERC', 'IND_FRT', 'VL_FRT', 'VL_SEG', 'VL_OUT_DA', 
            'VL_BC_ICMS', 'VL_ICMS', 'VL_BC_ICMS_ST', 'VL_ICMS_ST', 'VL_IPI', 
            'VL_PIS', 'VL_COFINS', 'VL_PIS_ST', 'VL_COFINS_ST'
        ],
        'C110': ['REG', 'COD_INF', 'TXT_COMPL'],
        'C111': ['REG', 'NUM_PROC', 'IND_PROC'],
        'C120': ['REG', 'COD_DOC_IMP', 'NUM_DOC_IMP', 'VL_PIS_IMP', 'VL_COFINS_IMP', 'NUM_ACDRAW'],
        'C170': [
            'REG', 'NUM_ITEM', 'COD_ITEM', 'DESCR_COMPL', 'QTD', 'UNID', 'VL_ITEM', 
            'VL_DESC', 'IND_MOV', 'CST_ICMS', 'CFOP', 'COD_NAT', 'VL_BC_ICMS', 
            'ALIQ_ICMS', 'VL_ICMS', 'VL_BC_ICMS_ST', 'ALIQ_ST', 'VL_ICMS_ST', 
            'IND_APUR', 'CST_IPI', 'COD_ENQ', 'VL_BC_IPI', 'ALIQ_IPI', 'VL_IPI', 
            'CST_PIS', 'VL_BC_PIS', 'ALIQ_PIS', 'QUANT_BC_PIS', 'ALIQ_PIS_QUANT', 
            'VL_PIS', 'CST_COFINS', 'VL_BC_COFINS', 'ALIQ_COFINS', 'QUANT_BC_COFINS', 
            'ALIQ_COFINS_QUANT', 'VL_COFINS', 'COD_CTA'
        ],
        'C175': [
            'REG', 'CFOP', 'VL_OPR', 'VL_DESC', 'CST_PIS', 'VL_BC_PIS', 'ALIQ_PIS', 
            'QUANT_BC_PIS', 'ALIQ_PIS_QUANT', 'VL_PIS', 'CST_COFINS', 'VL_BC_COFINS', 
            'ALIQ_COFINS', 'QUANT_BC_COFINS', 'ALIQ_COFINS_QUANT', 'VL_COFINS', 
            'COD_CTA', 'INFO_COMPL'
        ],
        'C180': [
            'REG', 'COD_MOD', 'DT_DOC_INI', 'DT_DOC_FIN', 'COD_ITEM', 'COD_NCM', 
            'EX_IPI', 'VL_TOT_ITEM'
        ],
        'C181': [
            'REG', 'CST_PIS', 'CFOP', 'VL_ITEM', 'VL_DESC', 'VL_BC_PIS', 'ALIQ_PIS', 
            'QUANT_BC_PIS', 'ALIQ_PIS_QUANT', 'VL_PIS', 'COD_CTA'
        ],
        'C185': [
            'REG', 'CST_COFINS', 'CFOP', 'VL_ITEM', 'VL_DESC', 'VL_BC_COFINS', 
            'ALIQ_COFINS', 'QUANT_BC_COFINS', 'ALIQ_COFINS_QUANT', 'VL_COFINS', 
            'COD_CTA'
        ],
        'C188': ['REG', 'NUM_PROC', 'IND_PROC'],
        'C190': [
            'REG', 'COD_MOD', 'DT_REF_INI', 'DT_REF_FIN', 'COD_ITEM', 'COD_NCM', 
            'EX_IPI', 'VL_TOT_ITEM'
        ],
        'C191': [
            'REG', 'CNPJ_CPF_PART', 'CST_PIS', 'CFOP', 'VL_ITEM', 'VL_DESC', 
            'VL_BC_PIS', 'ALIQ_PIS', 'QUANT_BC_PIS', 'ALIQ_PIS_QUANT', 'VL_PIS', 
            'COD_CTA'
        ],
        'C195': [
            'REG', 'CNPJ_CPF_PART', 'CST_COFINS', 'CFOP', 'VL_ITEM', 'VL_DESC', 
            'VL_BC_COFINS', 'ALIQ_COFINS', 'QUANT_BC_COFINS', 'ALIQ_COFINS_QUANT', 
            'VL_COFINS', 'COD_CTA'
        ],
        'C198': ['REG', 'NUM_PROC', 'IND_PROC'],
        'C199': ['REG', 'COD_DOC_IMP', 'NUM_DOC_IMP', 'VL_PIS_IMP', 'VL_COFINS_IMP', 'NUM_ACDRAW'],
        'C380': [
            'REG', 'COD_MOD', 'DT_DOC_INI', 'DT_DOC_FIN', 'NUM_DOC_INI', 'NUM_DOC_FIN', 
            'VL_DOC', 'VL_DOC_CANC'
        ],
        'C381': [
            'REG', 'CST_PIS', 'COD_ITEM', 'VL_ITEM', 'VL_BC_PIS', 'ALIQ_PIS', 
            'QUANT_BC_PIS', 'ALIQ_PIS_QUANT', 'VL_PIS', 'COD_CTA'
        ],
        'C385': [
            'REG', 'CST_COFINS', 'COD_ITEM', 'VL_ITEM', 'VL_BC_COFINS', 'ALIQ_COFINS', 
            'QUANT_BC_COFINS', 'ALIQ_COFINS_QUANT', 'VL_COFINS', 'COD_CTA'
        ],
        'C395': [
            'REG', 'COD_MOD', 'COD_PART', 'SER', 'SUB_SER', 'NUM_DOC', 'DT_DOC', 'VL_DOC'
        ],
        'C396': [
            'REG', 'COD_ITEM', 'VL_ITEM', 'VL_DESC', 'NAT_BC_CRED', 'CST_PIS', 
            'VL_BC_PIS', 'ALIQ_PIS', 'VL_PIS', 'CST_COFINS', 'VL_BC_COFINS', 
            'ALIQ_COFINS', 'VL_COFINS', 'COD_CTA'
        ],
        'C400': ['REG', 'COD_MOD', 'ECF_MOD', 'ECF_FAB', 'ECF_CX'],
        'C405': ['REG', 'DT_DOC', 'CRO', 'CRZ', 'NUM_COO_FIN', 'GT_FIN', 'VL_BRT'],
        'C481': [
            'REG', 'CST_PIS', 'VL_ITEM', 'VL_BC_PIS', 'ALIQ_PIS', 'QUANT_BC_PIS', 
            'ALIQ_PIS_QUANT', 'VL_PIS', 'COD_ITEM', 'COD_CTA'
        ],
        'C485': [
            'REG', 'CST_COFINS', 'VL_ITEM', 'VL_BC_COFINS', 'ALIQ_COFINS', 
            'QUANT_BC_COFINS', 'ALIQ_COFINS_QUANT', 'VL_COFINS', 'COD_ITEM', 'COD_CTA'
        ],
        'C489': ['REG', 'NUM_PROC', 'IND_PROC'],
        'C490': ['REG', 'DT_DOC_INI', 'DT_DOC_FIN', 'COD_MOD'],
        'C491': [
            'REG', 'COD_ITEM', 'CST_PIS', 'CFOP', 'VL_ITEM', 'VL_BC_PIS', 'ALIQ_PIS', 
            'QUANT_BC_PIS', 'ALIQ_PIS_QUANT', 'VL_PIS', 'COD_CTA'
        ],
        'C491': [
        'REG', 'COD_ITEM', 'CST_PIS', 'CFOP', 'VL_ITEM', 'VL_BC_PIS', 'ALIQ_PIS', 
        'QUANT_BC_PIS', 'ALIQ_PIS_QUANT', 'VL_PIS', 'COD_CTA'
        ],
        'C495': [
            'REG', 'COD_ITEM', 'CST_COFINS', 'CFOP', 'VL_ITEM', 'VL_BC_COFINS', 
            'ALIQ_COFINS', 'QUANT_BC_COFINS', 'ALIQ_COFINS_QUANT', 'VL_COFINS', 
            'COD_CTA'
        ],
        'C890':['REG','NUM_PROC','IND_PROC'],
        'C990':['REG','QTD_LIN_C'],
        
        # D-block headers
        'D001': ['REG', 'IND_MOV'],
        'D010': ['REG', 'CNPJ'],
        'D100': [
            'REG', 'IND_OPER', 'IND_EMIT', 'COD_PART', 'COD_MOD', 'COD_SIT', 'SER', 
            'SUB', 'NUM_DOC', 'CHV_CTE', 'DT_DOC', 'DT_A_P', 'TP_CT-e', 'CHV_CTE_REF', 
            'VL_DOC', 'VL_DESC', 'IND_FRT', 'VL_SERV', 'VL_BC_ICMS', 'VL_ICMS', 
            'VL_NT', 'COD_INF', 'COD_CTA'
        ],
        'D101': [
            'REG', 'IND_NAT_FRT', 'VL_ITEM', 'CST_PIS', 'NAT_BC_CRED', 'VL_BC_PIS', 
            'ALIQ_PIS', 'VL_PIS', 'COD_CTA'
        ],
        'D105': [
            'REG', 'IND_NAT_FRT', 'VL_ITEM', 'CST_COFINS', 'NAT_BC_CRED', 'VL_BC_COFINS', 
            'ALIQ_COFINS', 'VL_COFINS', 'COD_CTA'
        ],
        'D111': ['REG', 'NUM_PROC', 'IND_PROC'],
        'D200': [
            'REG', 'COD_MOD', 'COD_SIT', 'SER', 'SUB', 'NUM_DOC_INI', 'NUM_DOC_FIN', 
            'CFOP', 'DT_REF', 'VL_DOC', 'VL_DESC'
        ],
        'D201': [
            'REG', 'CST_PIS', 'VL_ITEM', 'VL_BC_PIS', 'ALIQ_PIS', 'VL_PIS', 'COD_CTA'
        ],
        'D205': [
            'REG', 'CST_COFINS', 'VL_ITEM', 'VL_BC_COFINS', 'ALIQ_COFINS', 'VL_COFINS', 'COD_CTA'
        ],
        'D209': ['REG', 'NUM_PROC', 'IND_PROC'],
        'D300': [
            'REG', 'COD_MOD', 'SER', 'SUB', 'NUM_DOC_INI', 'NUM_DOC_FIN', 'CFOP', 'DT_REF', 
            'VL_DOC', 'VL_DESC', 'CST_PIS', 'VL_BC_PIS', 'ALIQ_PIS', 'VL_PIS', 
            'CST_COFINS', 'VL_BC_COFINS', 'ALIQ_COFINS', 'VL_COFINS', 'COD_CTA'
        ],
        'D309': ['REG', 'NUM_PROC', 'IND_PROC'],
        'D350': [
            'REG', 'COD_MOD', 'ECF_MOD', 'ECF_FAB', 'DT_DOC', 'CRO', 'CRZ', 'NUM_COO_FIN', 
            'GT_FIN', 'VL_BRT', 'CST_PIS', 'VL_BC_PIS', 'ALIQ_PIS', 'QUANT_BC_PIS', 
            'ALIQ_PIS_QUANT', 'VL_PIS', 'CST_COFINS', 'VL_BC_COFINS', 'ALIQ_COFINS', 
            'QUANT_BC_COFINS', 'ALIQ_COFINS_QUANT', 'VL_COFINS', 'COD_CTA'
        ],
        'D359': ['REG', 'NUM_PROC', 'IND_PROC'],
        'D500': [
            'REG', 'IND_OPER', 'IND_EMIT', 'COD_PART', 'COD_MOD', 'COD_SIT', 'SER', 
            'SUB', 'NUM_DOC', 'DT_DOC', 'DT_A_P', 'VL_DOC', 'VL_DESC', 'VL_SERV', 
            'VL_SERV_NT', 'VL_TERC', 'VL_DA', 'VL_BC_ICMS', 'VL_ICMS', 'COD_INF', 
            'VL_PIS', 'VL_COFINS'
        ],
        'D501': [
            'REG', 'CST_PIS', 'VL_ITEM', 'NAT_BC_CRED', 'VL_BC_PIS', 'ALIQ_PIS', 'VL_PIS', 'COD_CTA'
        ],
        'D505': [
            'REG', 'CST_COFINS', 'VL_ITEM', 'NAT_BC_CRED', 'VL_BC_COFINS', 'ALIQ_COFINS', 'VL_COFINS', 'COD_CTA'
        ],
        'D509': ['REG', 'NUM_PROC', 'IND_PROC'],
        'D600': [
            'REG', 'COD_MOD', 'COD_MUN', 'SER', 'SUB', 'IND_REC', 'QTD_CONS', 'DT_DOC_INI', 
            'DT_DOC_FIN', 'VL_DOC', 'VL_DESC', 'VL_SERV', 'VL_SERV_NT', 'VL_TERC', 'VL_DA', 
            'VL_BC_ICMS', 'VL_ICMS', 'VL_PIS', 'VL_COFINS'
        ],
        'D601': [
            'REG', 'COD_CLASS', 'VL_ITEM', 'VL_DESC', 'CST_PIS', 'VL_BC_PIS', 'ALIQ_PIS', 'VL_PIS', 'COD_CTA'
        ],
        'D605': [
            'REG', 'COD_CLASS', 'VL_ITEM', 'VL_DESC', 'CST_COFINS', 'VL_BC_COFINS', 'ALIQ_COFINS', 'VL_COFINS', 'COD_CTA'
        ],
        'D609': ['REG', 'NUM_PROC', 'IND_PROC'],
        'D990': ['REG', 'QTD_LIN_D'
        ],
        'F001': ['REG', 'IND_MOV'
        ],
        'F010': ['REG', 'CNPJ'],
        'F100': [
            'REG', 'IND_OPER', 'COD_PART', 'COD_ITEM', 'DT_OPER', 'VL_OPER', 
            'CST_PIS', 'VL_BC_PIS', 'ALIQ_PIS', 'VL_PIS', 
            'CST_COFINS', 'VL_BC_COFINS', 'ALIQ_COFINS', 'VL_COFINS', 
            'NAT_BC_CRED', 'IND_ORIG_CRED', 'COD_CTA', 'COD_CCUS', 'DESC_DOC_OPER'
        ],
        'F111': ['REG', 'NUM_PROC', 'IND_PROC'],
        'F120': [
            'REG', 'NAT_BC_CRED', 'IDENT_BEM_IMOB', 'IND_ORIG_CRED', 'IND_UTIL_BEM_IMOB', 
            'VL_OPER_DEP', 'PARC_OPER_NAO_BC_CRED', 
            'CST_PIS', 'VL_BC_PIS', 'ALIQ_PIS', 'VL_PIS', 
            'CST_COFINS', 'VL_BC_COFINS', 'ALIQ_COFINS', 'VL_COFINS', 
            'COD_CTA', 'COD_CCUS', 'DESC_BEM_IMOB'
        ],
        'F129': ['REG', 'NUM_PROC', 'IND_PROC'],
        'F130': [
            'REG', 'NAT_BC_CRED', 'IDENT_BEM_IMOB', 'IND_ORIG_CRED', 'IND_UTIL_BEM_IMOB', 
            'MES_OPER_AQUIS', 'VL_OPER_AQUIS', 'PARC_OPER_NAO_BC_CRED', 'VL_BC_CRED', 'IND_NR_PARC', 
            'CST_PIS', 'VL_BC_PIS', 'ALIQ_PIS', 'VL_PIS', 
            'CST_COFINS', 'VL_BC_COFINS', 'ALIQ_COFINS', 'VL_COFINS', 
            'COD_CTA', 'COD_CCUS', 'DESC_BEM_IMOB'
        ],
        'F139': ['REG', 'NUM_PROC', 'IND_PROC'],
        'F150': [
            'REG', 'NAT_BC_CRED', 'VL_TOT_EST', 'EST_IMP', 'VL_BC_EST', 'VL_BC_MEN_EST', 
            'CST_PIS', 'ALIQ_PIS', 'VL_CRED_PIS', 
            'CST_COFINS', 'ALIQ_COFINS', 'VL_CRED_COFINS', 
            'DESC_EST', 'COD_CTA'
        ],
        'F200': [
            'REG', 'IND_OPER', 'UNID_IMOB', 'IDENT_EMP', 'DESC_UNID_IMOB', 'NUM_CONT', 'CPF_CNPJ_ADQU', 
            'DT_OPER', 'VL_TOT_VEND', 'VL_REC_ACUM', 'VL_TOT_REC', 
            'CST_PIS', 'VL_BC_PIS', 'ALIQ_PIS', 'VL_PIS', 
            'CST_COFINS', 'VL_BC_COFINS', 'ALIQ_COFINS', 'VL_COFINS', 
            'PERC_REC_RECEB', 'IND_NAT_EMP', 'INF_COMP'
        ],
        'F205': [
            'REG', 'VL_CUS_INC_ACUM_ANT', 'VL_CUS_INC_PER_ESC', 'VL_CUS_INC_ACUM', 'VL_EXC_BC_CUS_INC_ACUM', 'VL_BC_CUS_INC', 
            'CST_PIS', 'ALIQ_PIS', 'VL_CRED_PIS_ACUM', 'VL_CRED_PIS_DESC_ANT', 'VL_CRED_PIS_DESC', 'VL_CRED_PIS_DESC_FUT', 
            'CST_COFINS', 'ALIQ_COFINS', 'VL_CRED_COFINS_ACUM', 'VL_CRED_COFINS_DESC_ANT', 'VL_CRED_COFINS_DESC', 'VL_CRED_COFINS_DESC_FUT'
        ],
        'F210': [
            'REG', 'VL_CUS_ORC', 'VL_EXC', 'VL_CUS_ORC_AJU', 'VL_BC_CRED', 
            'CST_PIS', 'ALIQ_PIS', 'VL_CRED_PIS_UTIL', 
            'CST_COFINS', 'ALIQ_COFINS', 'VL_CRED_COFINS_UTIL'
        ],
        'F211': ['REG', 'NUM_PROC', 'IND_PROC'],
        'F500': [
            'REG', 'VL_REC_CAIXA', 
            'CST_PIS', 'VL_DESC_PIS', 'VL_BC_PIS', 'ALIQ_PIS', 'VL_PIS', 
            'CST_COFINS', 'VL_DESC_COFINS', 'VL_BC_COFINS', 'ALIQ_COFINS', 'VL_COFINS', 
            'COD_MOD', 'CFOP', 'COD_CTA', 'INFO_COMPL'
        ],
        'F509': ['REG', 'NUM_PROC', 'IND_PROC'],
        'F510': [
            'REG', 'VL_REC_CAIXA', 
            'CST_PIS', 'VL_DESC_PIS', 'QUANT_BC_PIS', 'ALIQ_PIS_QUANT', 'VL_PIS', 
            'CST_COFINS', 'VL_DESC_COFINS', 'QUANT_BC_COFINS', 'ALIQ_COFINS_QUANT', 'VL_COFINS', 
            'COD_MOD', 'CFOP', 'COD_CTA', 'INFO_COMPL'
        ],
        'F519': ['REG', 'NUM_PROC', 'IND_PROC'],
        'F525': [
            'REG', 'VL_REC', 'IND_REC', 'CNPJ_CPF', 'NUM_DOC', 'COD_ITEM', 
            'VL_REC_DET', 'CST_PIS', 'CST_COFINS', 'INFO_COMPL', 'COD_CTA'
        ],
        'F550': [
            'REG', 'VL_REC_COMP', 
            'CST_PIS', 'VL_DESC_PIS', 'VL_BC_PIS', 'ALIQ_PIS', 'VL_PIS', 
            'CST_COFINS', 'VL_DESC_COFINS', 'VL_BC_COFINS', 'ALIQ_COFINS', 'VL_COFINS', 
            'COD_MOD', 'CFOP', 'COD_CTA', 'INFO_COMPL'
        ],
        'F559': ['REG', 'NUM_PROC', 'IND_PROC'],
        'F560': [
            'REG', 'VL_REC_COMP', 
            'CST_PIS', 'VL_DESC_PIS', 'QUANT_BC_PIS', 'ALIQ_PIS_QUANT', 'VL_PIS', 
            'CST_COFINS', 'VL_DESC_COFINS', 'QUANT_BC_COFINS', 'ALIQ_COFINS_QUANT', 'VL_COFINS', 
            'COD_MOD', 'CFOP', 'COD_CTA', 'INFO_COMPL'
        ],
        'F569': ['REG', 'NUM_PROC', 'IND_PROC'],
        'F600': [
            'REG', 'IND_NAT_RET', 'DT_RET', 'VL_BC_RET', 'VL_RET', 'COD_REC', 
            'IND_NAT_REC', 'CNPJ', 'VL_RET_PIS', 'VL_RET_COFINS', 'IND_DEC'
        ],
        'F700': [
            'REG', 'IND_ORI_DED', 'IND_NAT_DED', 'VL_DED_PIS', 'VL_DED_COFINS', 
            'VL_BC_OPER', 'CNPJ', 'INF_COMP'
        ],
        'F800': [
            'REG', 'IND_NAT_EVEN', 'DT_EVEN', 'CNPJ_SUCED', 'PA_CONT_CRED', 
            'COD_CRED', 'VL_CRED_PIS', 'VL_CRED_COFINS', 'PER_CRED_CIS'
        ],
        'F990': ['REG', 'QTD_LIN_F'],
        'I001': ['REG', 'IND_MOV'],
        'I010': ['REG', 'CNPJ', 'IND_ATIV', 'INFO_COMPL'],
        'I100': [
            'REG', 'VL_REC', 'CST_PIS_COFINS', 'VL_TOT_DED_GER', 'VL_TOT_DED_ESP', 
            'VL_BC_PIS', 'ALIQ_PIS', 'VL_PIS', 
            'VL_BC_COFINS', 'ALIQ_COFINS', 'VL_COFINS', 'INFO_COMPL'
        ],
        'I199': ['REG', 'NUM_PROC', 'IND_PROC'],
        'I200': ['REG', 'NUM_CAMPO', 'COD_DET', 'DET_VALOR', 'COD_CTA', 'INFO_COMPL'],            
        'I299': ['REG', 'NUM_PROC', 'IND_PROC'],
        'I300': ['REG', 'COD_COMP', 'DET_VALOR', 'COD_CTA', 'INFO_COMPL'],
        'I399': ['REG', 'NUM_PROC', 'IND_PROC'],
        'I990': ['REG', 'QTD_LIN_I'],
        'M001': ['REG', 'IND_MOV'],
        'M100': [
            'REG', 'COD_CRED', 'IND_CRED_ORI', 'VL_BC_PIS', 'ALIQ_PIS', 
            'QUANT_BC_PIS', 'ALIQ_PIS_QUANT', 'VL_CRED', 'VL_AJUS_ACRES', 
            'VL_AJUS_REDUC', 'VL_CRED_DIF', 'VL_CRED_DISP', 'IND_DESC_CRED', 
            'VL_CRED_DESC', 'SLD_CRED'
        ],
        'M105': [
            'REG', 'NAT_BC_CRED', 'CST_PIS', 'VL_BC_PIS_TOT', 'VL_BC_PIS_CUM',
            'VL_BC_PIS_NC', 'VL_BC_PIS', 'QUANT_BC_PIS_TOT', 'QUANT_BC_PIS', 
            'DESC_CRED'
        ],
        'M110': ['REG', 'IND_AJ', 'VL_AJ', 'COD_AJ', 'NUM_DOC', 'DESCR_AJ', 'DT_REF'],
        'M115': [
            'REG', 'DET_VALOR_AJ', 'CST_PIS', 'DET_BC_CRED', 'DET_ALIQ', 
            'DT_OPER_AJ', 'DESC_AJ', 'COD_CTA', 'INFO_COMPL'
        ],
        'M200': [
            'REG', 'VL_TOT_CONT_NC_PER', 'VL_TOT_CRED_DESC', 'VL_TOT_CRED_DESC_ANT', 
            'VL_TOT_CONT_NC_DEV', 'VL_RET_NC', 'VL_OUT_DED_NC', 'VL_CONT_NC_REC',
            'VL_TOT_CONT_CUM_PER', 'VL_RET_CUM', 'VL_OUT_DED_CUM', 
            'VL_CONT_CUM_REC', 'VL_TOT_CONT_REC'
        ],
        'M205': ['REG', 'NUM_CAMPO', 'COD_REC', 'VL_DEBITO'],
        'M210': [
            'REG', 'COD_CONT', 'VL_REC_BRT', 'VL_BC_CONT', 'ALIQ_PIS', 'QUANT_BC_PIS',
            'ALIQ_PIS_QUANT', 'VL_CONT_APUR', 'VL_AJUS_ACRES', 'VL_AJUS_REDUC',
            'VL_CONT_DIFER', 'VL_CONT_DIFER_ANT', 'VL_CONT_PER'
        ],
        'M250':['REG','IND_AJ_BC','VL_AJ_BC','COD_AJ_BC','NUM_DOC','DESCR_AJ_BC','DT_REF','COD_CTA','CNPJ','INFO_COMPL'],
        'M211': [
            'REG', 'IND_TIP_COOP', 'VL_BC_CONT_ANT_EXC_COOP', 'VL_EXC_COOP_GER', 
            'VL_EXC_ESP_COOP', 'VL_BC_CONT'
        ],
        'M215':['REG','IND_AJ_BC','VL_AJ_BC','COD_AJ_BC','NUM_DOC','DESCR_AJ_BC','DT_REF','COD_CTA','CNPJ','INFO_COMPL'],
        'M220': ['REG', 'IND_AJ', 'VL_AJ', 'COD_AJ', 'NUM_DOC', 'DESCR_AJ', 'DT_REF'],
        'M225': [
            'REG', 'DET_VALOR_AJ', 'CST_PIS', 'DET_BC_CRED', 'DET_ALIQ', 
            'DT_OPER_AJ', 'DESC_AJ', 'COD_CTA', 'INFO_COMPL'
        ],
        'M230': [
            'REG', 'CNPJ', 'VL_VEND', 'VL_NAO_RECEB', 'VL_CONT_DIF', 'VL_CRED_DIF', 
            'COD_CRED'
        ],
        'M300': [
            'REG', 'COD_CONT', 'VL_CONT_APUR_DIFER', 'NAT_CRED_DESC', 
            'VL_CRED_DESC_DIFER', 'VL_CONT_DIFER_ANT', 'PER_APUR', 'DT_RECEB'
        ],
        'M350': [
            'REG', 'VL_TOT_FOL', 'VL_EXC_BC', 'VL_TOT_BC', 'ALIQ_PIS_FOL', 
            'VL_TOT_CONT_FOL'
        ],
        'M400': ['REG', 'CST_PIS', 'VL_TOT_REC', 'COD_CTA', 'DESC_COMPL'],
        'M410': ['REG', 'NAT_REC', 'VL_REC', 'COD_CTA', 'DESC_COMPL'],
        'M500': [
            'REG', 'COD_CRED', 'IND_CRED_ORI', 'VL_BC_COFINS', 'ALIQ_COFINS', 
            'QUANT_BC_COFINS', 'ALIQ_COFINS_QUANT', 'VL_CRED', 'VL_AJUS_ACRES',
            'VL_AJUS_REDUC', 'VL_CRED_DIFER', 'VL_CRED_DISP', 'IND_DESC_CRED', 
            'VL_CRED_DESC', 'SLD_CRED'
        ],
        'M505': [
            'REG', 'NAT_BC_CRED', 'CST_COFINS', 'VL_BC_COFINS_TOT', 
            'VL_BC_COFINS_CUM', 'VL_BC_COFINS_NC', 'VL_BC_COFINS',
            'QUANT_BC_COFINS_TOT', 'QUANT_BC_COFINS', 'DESC_CRED'
        ],
        'M510': ['REG', 'IND_AJ', 'VL_AJ', 'COD_AJ', 'NUM_DOC', 'DESCR_AJ', 'DT_REF'],
        'M515': [
            'REG', 'DET_VALOR_AJ', 'CST_COFINS', 'DET_BC_CRED', 'DET_ALIQ', 
            'DT_OPER_AJ', 'DESC_AJ', 'COD_CTA', 'INFO_COMPL'
        ],
        'M600': [
            'REG', 'VL_TOT_CONT_NC_PER', 'VL_TOT_CRED_DESC', 'VL_TOT_CRED_DESC_ANT',
            'VL_TOT_CONT_NC_DEV', 'VL_RET_NC', 'VL_OUT_DED_NC', 'VL_CONT_NC_REC',
            'VL_TOT_CONT_CUM_PER', 'VL_RET_CUM', 'VL_OUT_DED_CUM',
            'VL_CONT_CUM_REC', 'VL_TOT_CONT_REC'
        ],
        'M605': ['REG', 'NUM_CAMPO', 'COD_REC', 'VL_DEBITO'],
        'M610': [
            'REG', 'COD_CONT', 'VL_REC_BRT', 'VL_BC_CONT', 'ALIQ_COFINS', 
            'QUANT_BC_COFINS', 'ALIQ_COFINS_QUANT', 'VL_CONT_APUR',
            'VL_AJUS_ACRES', 'VL_AJUS_REDUC', 'VL_CONT_DIFER', 'VL_CONT_DIFER_ANT', 
            'VL_CONT_PER'
        ],
        'M611': [
            'REG', 'IND_TIP_COOP', 'VL_BC_CONT_ANT_EXC_COOP', 'VL_EXC_COOP_GER',
            'VL_EXC_ESP_COOP', 'VL_BC_CONT'
        ],
        'M615':['REG', 'IND_AJ_BC', 'VL_AJ_BC', 'COD_AJ_BC', 'NUM_DOC', 'DESCR_AJ_BC','DT_REF','COD_CTA','CNPJ','INFO_COMPL'],
        'M620': ['REG', 'IND_AJ', 'VL_AJ', 'COD_AJ', 'NUM_DOC', 'DESCR_AJ', 'DT_REF'],
        'M625': [
            'REG', 'DET_VALOR_AJ', 'CST_COFINS', 'DET_BC_CRED', 'DET_ALIQ', 
            'DT_OPER_AJ', 'DESC_AJ', 'COD_CTA', 'INFO_COMPL'
        ],
        'M630': [
            'REG', 'CNPJ', 'VL_VEND', 'VL_NAO_RECEB', 'VL_CONT_DIF', 
            'VL_CRED_DIF', 'COD_CRED'
        ],
        'M700': [
            'REG', 'COD_CONT', 'VL_CONT_APUR_DIFER', 'NAT_CRED_DESC', 
            'VL_CRED_DESC_DIFER', 'VL_CONT_DIFER_ANT', 'PER_APUR', 'DT_RECEB'
        ],
        'M800': ['REG', 'CST_COFINS', 'VL_TOT_REC', 'COD_CTA', 'DESC_COMPL'],
        'M810': ['REG', 'NAT_REC', 'VL_REC', 'COD_CTA', 'DESC_COMPL'],
        'M990': ['REG', 'QTD_LIN_M'],
        'P001': ['REG', 'IND_MOV'],
        'P010': ['REG', 'CNPJ'],
        'P100': [
            'REG', 'DT_INI', 'DT_FIN', 'VL_REC_TOT_EST', 'COD_ATIV_ECON',
            'VL_REC_ATIV_ESTAB', 'VL_EXC', 'VL_BC_CONT', 'ALIQ_CONT',
            'VL_CONT_APU', 'COD_CTA', 'INFO_COMPL'
        ],
        'P110': ['REG', 'NUM_CAMPO', 'COD_DET', 'DET_VALOR', 'INF_COMPL'],
        'P199': ['REG', 'NUM_PROC', 'IND_PROC'],
        'P200': [
            'REG', 'PER_REF', 'VL_TOT_CONT_APU', 'VL_TOT_AJ_REDUC', 
            'VL_TOT_AJ_ACRES', 'VL_TOT_CONT_DEV', 'COD_REC'
        ],
        'P210': ['REG', 'IND_AJ', 'VL_AJ', 'COD_AJ', 'NUM_DOC', 'DESCR_AJ', 'DT_REF'],
        'P990': ['REG', 'QTD_LIN_P'],
        '1001': ['REG', 'IND_MOV'],
        '1010': [
            'REG', 'NUM_PROC', 'ID_SEC_JUD', 'ID_VARA', 'IND_NAT_ACAO', 
            'DESC_DEC_JUD', 'DT_SENT_JUD'
        ],
        '1020': ['REG', 'NUM_PROC', 'IND_NAT_ACAO', 'DT_DEC_ADM'],
        '1050':['REG', 'DT_REF','IND_AJ_BC','CNPJ','VL_AJ_TOT','VL_AJ_CST01','VL_AJ_CST02','VL_AJ_CST03','VL_AJ_CST04','VL_AJ_CST05','VL_AJ_CST06',
                'VL_AJ_CST07','VL_AJ_CST08','VL_AJ_CST09','VL_AJ_CST','VL_AJ_CST49','VL_AJ_CST99','IND_APROP','NUM_REC','INFO_COMPL'],
        '1100': [
            'REG', 'PER_APU_CRED', 'ORIG_CRED', 'CNPJ_SUC', 'COD_CRED',
            'VL_CRED_APU', 'VL_CRED_EXT_APU', 'VL_TOT_CRED_APU',
            'VL_CRED_DESC_PA_ANT', 'VL_CRED_PER_PA_ANT', 'VL_CRED_DCOMP_PA_ANT',
            'SD_CRED_DISP_EFD', 'VL_CRED_DESC_EFD', 'VL_CRED_PER_EFD',
            'VL_CRED_DCOMP_EFD', 'VL_CRED_TRANS', 'VL_CRED_OUT', 'SLD_CRED_FIM'
        ],
        '1101': [
            'REG', 'COD_PART', 'COD_ITEM', 'COD_MOD', 'SER', 'SUB_SER', 'NUM_DOC',
            'DT_OPER', 'CHV_NFE', 'VL_OPER', 'CFOP', 'NAT_BC_CRED', 'IND_ORIG_CRED',
            'CST_PIS', 'VL_BC_PIS', 'ALIQ_PIS', 'VL_PIS', 'COD_CTA', 'COD_CCUS',
            'DESC_COMPL', 'PER_ESCRIT', 'CNPJ'
        ],
        '1102': ['REG', 'VL_CRED_PIS_TRIB_MI', 'VL_CRED_PIS_NT_MI', 'VL_CRED_PIS_EXP'],
        '1200': [
            'REG', 'PER_APUR_ANT', 'NAT_CONT_REC', 'VL_CONT_APUR', 'VL_CRED_PIS_DESC',
            'VL_CONT_DEV', 'VL_OUT_DED', 'VL_CONT_EXT', 'VL_MUL', 'VL_JUR', 'DT_RECOL'
        ],
        '1210': [
            'REG', 'CNPJ', 'CST_PIS', 'COD_PART', 'DT_OPER', 'VL_OPER', 'VL_BC_PIS',
            'ALIQ_PIS', 'VL_PIS', 'COD_CTA', 'DESC_COMPL'
        ],
        '1220': ['REG', 'PER_APU_CRED', 'ORIG_CRED', 'COD_CRED', 'VL_CRED'],
        '1300': [
            'REG', 'IND_NAT_RET', 'PR_REC_RET', 'VL_RET_APU', 'VL_RET_DED',
            'VL_RET_PER', 'VL_RET_DCOMP', 'SLD_RET'
        ],
        '1500': [
            'REG', 'PER_APU_CRED', 'ORIG_CRED', 'CNPJ_SUC', 'COD_CRED', 'VL_CRED_APU',
            'VL_CRED_EXT_APU', 'VL_TOT_CRED_APU', 'VL_CRED_DESC_PA_ANT',
            'VL_CRED_PER_PA_ANT', 'VL_CRED_DCOMP_PA_ANT', 'SD_CRED_DISP_EFD',
            'VL_CRED_DESC_EFD', 'VL_CRED_PER_EFD', 'VL_CRED_DCOMP_EFD', 
            'VL_CRED_TRANS', 'VL_CRED_OUT', 'SLD_CRED_FIM'
        ],
        '1501': [
            'REG', 'COD_PART', 'COD_ITEM', 'COD_MOD', 'SER', 'SUB_SER', 'NUM_DOC',
            'DT_OPER', 'CHV_NFE', 'VL_OPER', 'CFOP', 'NAT_BC_CRED', 'IND_ORIG_CRED',
            'CST_COFINS', 'VL_BC_COFINS', 'ALIQ_COFINS', 'VL_COFINS', 'COD_CTA',
            'COD_CCUS', 'DESC_COMPL', 'PER_ESCRIT', 'CNPJ'
        ],
        '1502': ['REG', 'VL_CRED_COFINS_TRIB_MI', 'VL_CRED_COFINS_NT_MI', 'VL_CRED_COFINS_EXP'],
        '1600': [
            'REG', 'PER_APUR_ANT', 'NAT_CONT_REC', 'VL_CONT_APUR', 'VL_CRED_COFINS_DESC',
            'VL_CONT_DEV', 'VL_OUT_DED', 'VL_CONT_EXT', 'VL_MUL', 'VL_JUR', 'DT_RECOL'
        ],
        '1610': [
            'REG', 'CNPJ', 'CST_COFINS', 'COD_PART', 'DT_OPER', 'VL_OPER', 'VL_BC_COFINS',
            'ALIQ_COFINS', 'VL_COFINS', 'COD_CTA', 'DESC_COMPL'
        ],
        '1620': ['REG', 'PER_APU_CRED', 'ORIG_CRED', 'COD_CRED', 'VL_CRED'],
        '1700': [
            'REG', 'IND_NAT_RET', 'PR_REC_RET', 'VL_RET_APU', 'VL_RET_DED', 
            'VL_RET_PER', 'VL_RET_DCOMP', 'SLD_RET'
        ],
        '1800': [
            'REG', 'INC_IMOB', 'REC_RECEB_RET', 'REC_FIN_RET', 'BC_RET', 
            'ALIQ_RET', 'VL_REC_UNI', 'DT_REC_UNI', 'COD_REC'
        ],
        '1809': ['REG', 'NUM_PROC', 'IND_PROC'],
        '1900': [
            'REG', 'CNPJ', 'COD_MOD', 'SER', 'SUB_SER', 'COD_SIT', 'VL_TOT_REC', 
            'QUANT_DOC', 'CST_PIS', 'CST_COFINS', 'CFOP', 'INF_COMPL', 'COD_CTA'
        ],
        '1990': ['REG', 'QTD_LIN_1'],
        '9001': ['REG', 'IND_MOV'],
        '9900': ['REG', 'REG_BLC', 'QTD_REG_BLC'],
        '9990': ['REG', 'QTD_LIN_9'],
        '9999': ['REG', 'QTD_LIN'],
    }



    @classmethod
    def get_headers(cls, block_type: str) -> list:
        """
        Retrieve headers for a specific block type
        
        Args:
            block_type (str): The block type identifier
        
        Returns:
            list: A list of headers for the specified block type
        """
        return cls.BLOCK_HEADERS.get(block_type, [])

    @classmethod
    def get_all_block_types(cls) -> list:
        """
        Retrieve all configured block types
        
        Returns:
            list: A list of all block type identifiers
        """
        return list(cls.BLOCK_HEADERS.keys())
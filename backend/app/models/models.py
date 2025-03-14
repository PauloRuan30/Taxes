# models.py
from pydantic import BaseModel, Field, EmailStr
from typing import Optional, Union, List, Any

#
# -----------------------------
#      DOCUMENTS MODELS
# -----------------------------
#

class DocumentUpdate(BaseModel):
    sheets: List[Any]

#
# -----------------------------
#      USER MODELS
# -----------------------------
#
class UserCreate(BaseModel):
    username: str
    password: str
    confirm_password: str

class UserInDB(BaseModel):
    username: str
    hashed_password: str
    email: Optional[EmailStr] = None
    is_active: bool = True
    is_superuser: bool = False
    is_verified: bool = False

class UserLogin(BaseModel):
    username: str
    password: str

class UserPublic(BaseModel):
    id: str
    username: str

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


#
# -----------------------------
#    BUSINESS MODELS
# -----------------------------
#
class BusinessBase(BaseModel):
    cnpj: str = Field(..., min_length=14, max_length=18)
    razao_social: str
    porte_empresa: str

    inscricao_estadual: Optional[str] = None
    inscricao_municipal: Optional[str] = None
    endereco: Optional[str] = None
    bairro: Optional[str] = None
    numero: Optional[str] = None
    cep: Optional[str] = None
    cidade: Optional[str] = None
    nome_fantasia: Optional[str] = None
    servicos_produtos: Optional[str] = None
    nicho_mercado: Optional[str] = None

class BusinessUpdate(BaseModel):
    cnpj: Optional[str] = Field(None, min_length=14, max_length=18)
    inscricao_estadual: Optional[str] = None
    inscricao_municipal: Optional[str] = None
    razao_social: Optional[str] = None
    porte_empresa: Optional[str] = None
    endereco: Optional[str] = None
    bairro: Optional[str] = None
    numero: Optional[str] = None
    cep: Optional[str] = None
    cidade: Optional[str] = None
    nome_fantasia: Optional[str] = None
    servicos_produtos: Optional[str] = None
    nicho_mercado: Optional[str] = None

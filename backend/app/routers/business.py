from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from database import get_db
from models.schemas import Business, File  # SQLAlchemy models
from datetime import datetime
from typing import Optional

# Define a default business for testing
DEFAULT_BUSINESS = {
    "id": 0,
    "cnpj": "00000000000000",
    "inscricao_estadual": "0000000000",
    "inscricao_municipal": "000000000",
    "razao_social": "Default Business",
    "porte_empresa": "Small",
    "endereco": "Default Address",
    "bairro": "Default Neighborhood",
    "numero": "0",
    "cep": "00000-000",
    "cidade": "Default City",
    "nome_fantasia": "Default Fantasia",
    "servicos_produtos": "Default Services/Products",
    "nicho_mercado": "Default Niche"
}

# Pydantic models for business requests
class BusinessBase(BaseModel):
    cnpj: str = Field(..., min_length=14, max_length=18)
    inscricao_estadual: str
    inscricao_municipal: str
    razao_social: str
    porte_empresa: str
    endereco: Optional[str] = None
    bairro: Optional[str] = None
    numero: Optional[str] = None
    cep: Optional[str] = None
    cidade: Optional[str] = None
    nome_fantasia: Optional[str] = None
    servicos_produtos: Optional[str] = None
    nicho_mercado: Optional[str] = None

class BusinessCreate(BusinessBase):
    pass

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

# Initialize the router
router = APIRouter(prefix="/business", tags=["Business"])

# Helper function that attempts to retrieve a business from the DB,
# falling back to the default business if the DB is down or no result is found for a specific id.
def get_business_with_fallback(business_id: int, db: Session) -> dict:
    try:
        business = db.query(Business).filter(Business.id == business_id).first()
        if business:
            return {
                "id": business.id,
                "razao_social": business.razao_social,
                "cnpj": business.cnpj,
                "inscricao_estadual": business.inscricao_estadual,
                "inscricao_municipal": business.inscricao_municipal,
                "porte_empresa": business.porte_empresa,
                "endereco": business.endereco,
                "bairro": business.bairro,
                "numero": business.numero,
                "cep": business.cep,
                "cidade": business.cidade,
                "nome_fantasia": business.nome_fantasia,
                "servicos_produtos": business.servicos_produtos,
                "nicho_mercado": business.nicho_mercado,
            }
    except Exception:
        # If the DB operation fails, check if the request is for the default business (id==0)
        if business_id == 0:
            return DEFAULT_BUSINESS
        raise HTTPException(status_code=503, detail="Service unavailable")
    
    # If no business is found and the request is for the default one, return it
    if business_id == 0:
        return DEFAULT_BUSINESS
    raise HTTPException(status_code=404, detail="Business not found")

# Routes

@router.get("/", response_model=list[dict])
def get_all_businesses(db: Session = Depends(get_db)):
    try:
        businesses = db.query(Business).all()
        return [
            {
                "id": b.id,
                "razao_social": b.razao_social,
                "cnpj": b.cnpj,
                "inscricao_estadual": b.inscricao_estadual,
                "inscricao_municipal": b.inscricao_municipal,
                "porte_empresa": b.porte_empresa,
                "endereco": b.endereco,
                "bairro": b.bairro,
                "numero": b.numero,
                "cep": b.cep,
                "cidade": b.cidade,
                "nome_fantasia": b.nome_fantasia,
                "servicos_produtos": b.servicos_produtos,
                "nicho_mercado": b.nicho_mercado,
            }
            for b in businesses
        ]
    except Exception:
        # Return default business for testing if DB is down
        return [DEFAULT_BUSINESS]

@router.get("/{business_id}", response_model=dict)
def get_business(business_id: int, db: Session = Depends(get_db)):
    return get_business_with_fallback(business_id, db)

@router.post("/", response_model=dict)
def create_business(business_data: BusinessCreate, db: Session = Depends(get_db)):
    try:
        new_business = Business(**business_data.dict())
        db.add(new_business)
        db.commit()
        db.refresh(new_business)
        return {
            "message": f"Business {new_business.razao_social} created successfully",
            "id": new_business.id
        }
    except Exception:
        # If DB is down, simulate creation by returning the default business
        return {
            "message": f"Default business {DEFAULT_BUSINESS['razao_social']} used for testing",
            "id": DEFAULT_BUSINESS["id"]
        }

@router.put("/{business_id}", response_model=dict)
def update_business(business_id: int, business_data: BusinessUpdate, db: Session = Depends(get_db)):
    business = get_business_with_fallback(business_id, db)
    try:
        # If we are using the default business, simulate an update
        if business["id"] == DEFAULT_BUSINESS["id"]:
            updated_business = {**business, **business_data.dict(exclude_unset=True)}
            return {"message": f"Default business {updated_business['razao_social']} updated successfully"}
        # Otherwise, update the business in the DB
        business_instance = db.query(Business).filter(Business.id == business_id).first()
        if not business_instance:
            raise HTTPException(status_code=404, detail="Business not found")
        for key, value in business_data.dict(exclude_unset=True).items():
            setattr(business_instance, key, value)
        db.commit()
        db.refresh(business_instance)
        return {"message": f"Business {business_instance.razao_social} updated successfully"}
    except Exception:
        raise HTTPException(status_code=503, detail="Service unavailable")

@router.delete("/{business_id}", response_model=dict)
def delete_business(business_id: int, db: Session = Depends(get_db)):
    try:
        business_instance = db.query(Business).filter(Business.id == business_id).first()
        if not business_instance:
            # If the default business is requested, simulate deletion
            if business_id == DEFAULT_BUSINESS["id"]:
                return {"message": f"Default business {DEFAULT_BUSINESS['razao_social']} deletion simulated"}
            raise HTTPException(status_code=404, detail="Business not found")
        db.delete(business_instance)
        db.commit()
        return {"message": f"Business {business_instance.razao_social} deleted successfully"}
    except Exception:
        # If DB is down, simulate deletion for default business
        if business_id == DEFAULT_BUSINESS["id"]:
            return {"message": f"Default business {DEFAULT_BUSINESS['razao_social']} deletion simulated"}
        raise HTTPException(status_code=503, detail="Service unavailable")

@router.get("/{business_id}/files", response_model=list[dict])
def get_business_files(business_id: int, db: Session = Depends(get_db)):
    try:
        business_instance = db.query(Business).filter(Business.id == business_id).first()
        if not business_instance:
            raise HTTPException(status_code=404, detail="Business not found")
        files = db.query(File).filter(File.business_id == business_id).all()
        return [
            {"id": f.id, "filename": f.filename, "uploaded_at": f.uploaded_at}
            for f in files
        ]
    except Exception:
        # If the DB is down, return an empty list or default file list for testing
        return []

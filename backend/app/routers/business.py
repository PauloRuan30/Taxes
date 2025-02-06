# models/schemas.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from database import get_db
from models.schemas import Business
from datetime import datetime
from typing import Optional

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

# Router initialization
router = APIRouter(prefix="/business", tags=["Business"])

# Helper functions
def get_business_by_id(business_id: int, db: Session):
    business = db.query(Business).filter(Business.id == business_id).first()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    return business

# Routes
@router.get("/", response_model=list[dict])
def get_all_businesses(db: Session = Depends(get_db)):
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


@router.post("/", response_model=dict)
def create_business(business_data: BusinessCreate, db: Session = Depends(get_db)):
    new_business = Business(**business_data.dict())
    db.add(new_business)
    db.commit()
    db.refresh(new_business)
    return {"message": f"Business {new_business.razao_social} created successfully", "id": new_business.id}

@router.get("/{business_id}", response_model=dict)
def get_business(business_id: int, db: Session = Depends(get_db)):
    business = get_business_by_id(business_id, db)
    return {"id": business.id, "razao_social": business.razao_social, "cnpj": business.cnpj}

@router.put("/{business_id}", response_model=dict)
def update_business(business_id: int, business_data: BusinessUpdate, db: Session = Depends(get_db)):
    business = get_business_by_id(business_id, db)
    for key, value in business_data.dict(exclude_unset=True).items():
        setattr(business, key, value)
    db.commit()
    db.refresh(business)
    return {"message": f"Business {business.razao_social} updated successfully"}

@router.delete("/{business_id}", response_model=dict)
def delete_business(business_id: int, db: Session = Depends(get_db)):
    business = get_business_by_id(business_id, db)
    db.delete(business)
    db.commit()
    return {"message": f"Business {business.razao_social} deleted successfully"}

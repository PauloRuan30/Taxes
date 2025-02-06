# models.schemas.py
from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, ForeignKey, CheckConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)

class Business(Base):
    __tablename__ = 'businesses'

    id = Column(Integer, primary_key=True, index=True)
    cnpj = Column(String(18), nullable=False, unique=True)
    inscricao_estadual = Column(String(50), nullable=False)
    inscricao_municipal = Column(String(50), nullable=False)
    razao_social = Column(String(255), nullable=False)
    porte_empresa = Column(String(50), nullable=False)
    endereco = Column(String(255), nullable=True)
    bairro = Column(String(100), nullable=True)
    numero = Column(String(10), nullable=True)
    cep = Column(String(9), nullable=True)
    cidade = Column(String(100), nullable=True)
    nome_fantasia = Column(String(255), nullable=True)
    servicos_produtos = Column(Text, nullable=True)
    nicho_mercado = Column(String(255), nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())
    
    files = relationship("File", back_populates="business")
    
class File(Base):
    __tablename__ = "files"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    filepath = Column(String, nullable=False)
    business_id = Column(Integer, ForeignKey("businesses.id"), nullable=False)

    business = relationship("Business", back_populates="files")

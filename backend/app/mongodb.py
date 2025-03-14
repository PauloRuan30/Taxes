# mongodb.py
import motor.motor_asyncio
import logging
from fastapi import HTTPException

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

client = motor.motor_asyncio.AsyncIOMotorClient("mongodb://localhost:27017")
db = client["Tax-Track_PROD"]

documents_collection = db.get_collection("Documents")
business_collection = db.get_collection("business")
users_collection = db.get_collection("users")

def business_helper(business) -> dict:
    return {
        "id": str(business["_id"]),
        "cnpj": business["cnpj"],
        "inscricao_estadual": business["inscricao_estadual"],
        "inscricao_municipal": business["inscricao_municipal"],
        "razao_social": business["razao_social"],
        "porte_empresa": business["porte_empresa"],
        "endereco": business.get("endereco"),
        "bairro": business.get("bairro"),
        "numero": business.get("numero"),
        "cep": business.get("cep"),
        "cidade": business.get("cidade"),
        "nome_fantasia": business.get("nome_fantasia"),
        "servicos_produtos": business.get("servicos_produtos"),
        "nicho_mercado": business.get("nicho_mercado"),
        "created_at": business.get("created_at"),
    }

async def check_mongo_connection():
    """
    Asynchronously check if MongoDB is connected by issuing a ping command.
    """
    try:
        await client.admin.command("ping")
        logger.info("✅ Successfully connected to MongoDB")
    except Exception as e:
        logger.error("❌ Could not connect to MongoDB: %s", e)
        raise HTTPException(status_code=500, detail="MongoDB connection failed")

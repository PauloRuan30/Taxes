# business_routes.py
from fastapi import APIRouter, HTTPException, Body
from datetime import datetime
from bson import ObjectId

from mongodb import business_collection, business_helper, documents_collection
from models.models import BusinessBase, BusinessUpdate

business_router = APIRouter(prefix="/business", tags=["Business"])

#
# GET /business - Retrieve all business documents
#
@business_router.get("/", response_model=list[dict])
async def get_all_businesses():
    businesses = []
    async for biz in business_collection.find():
        businesses.append(business_helper(biz))
    return businesses

#
# GET /business/{business_id} - Retrieve a business by its ObjectId
#
@business_router.get("/{business_id}", response_model=dict)
async def get_business(business_id: str):
    try:
        obj_id = ObjectId(business_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid business id format")

    biz = await business_collection.find_one({"_id": obj_id})
    if biz:
        return business_helper(biz)
    raise HTTPException(status_code=404, detail="Business not found")

#
# POST /business - Create a new business document
#
@business_router.post("/", response_model=dict)
async def create_business(business_data: BusinessBase = Body(...)):
    business_dict = business_data.dict()
    business_dict["created_at"] = datetime.utcnow()
    result = await business_collection.insert_one(business_dict)
    created = await business_collection.find_one({"_id": result.inserted_id})
    return business_helper(created)

#
# PUT /business/{business_id} - Update an existing business
#
@business_router.put("/{business_id}", response_model=dict)
async def update_business(business_id: str, business_data: BusinessUpdate = Body(...)):
    try:
        obj_id = ObjectId(business_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid business id format")

    update_data = {k: v for k, v in business_data.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No data provided to update")

    result = await business_collection.update_one({"_id": obj_id}, {"$set": update_data})
    if result.modified_count == 1:
        updated = await business_collection.find_one({"_id": obj_id})
        return business_helper(updated)

    # If no modification was made, check if the doc exists
    existing = await business_collection.find_one({"_id": obj_id})
    if existing:
        return business_helper(existing)

    raise HTTPException(status_code=404, detail="Business not found")

#
# DELETE /business/{business_id} - Delete a business by its ObjectId
#
@business_router.delete("/{business_id}", response_model=dict)
async def delete_business(business_id: str):
    try:
        obj_id = ObjectId(business_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid business id format")

    result = await business_collection.delete_one({"_id": obj_id})
    if result.deleted_count == 1:
        return {"message": "Business deleted successfully"}
    raise HTTPException(status_code=404, detail="Business not found")


#
# GET /business/{business_id}/files - Return all documents for a given business
#
@business_router.get("/{business_id}/files")
async def list_business_files(business_id: str):
    """
    Return all 'documents' that belong to a specific business/company.
    Each doc might have a "sheets" array or other metadata.
    """
    docs = []
    try:
        # If you store 'company_id' as a *string*, it must match the actual 'business_id' string:
        cursor = documents_collection.find({"company_id": business_id})
        async for doc in cursor:
            docs.append({
                "id": str(doc["_id"]),
                "company_id": doc["company_id"],
                "sheets": doc["sheets"],
                # add "file_names": doc.get("file_names", []) if you want
            })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return docs

# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from beanie import init_beanie
from mongodb import db, check_mongo_connection
from routers.auth import auth_router  
from routers.user import user_router 
from routers.business import business_router
from routers.upload import router as upload_router



@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await check_mongo_connection()  # your own MongoDB connection check
    # Initialize beanie for your User collection
    yield
    # Shutdown logic if needed

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the auth router
app.include_router(auth_router)
app.include_router(user_router)
app.include_router(business_router)
app.include_router(upload_router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

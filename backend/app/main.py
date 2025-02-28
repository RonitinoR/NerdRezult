from fastapi import FastAPI
from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from contextlib import asynccontextmanager
from app.routes import auth, oauth
from app.db import database

@asynccontextmanager
async def lifespan(app: FastAPI):
    # create all the databases
    await database.create_all()
    yield

    # shutdown logic: disconnect from database
    await database.disconnect()

app = FastAPI(lifespan = lifespan)

# add HTTPS redirection
app.add_middleware(HTTPSRedirectMiddleware)

# adding CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins = ["frontend URL"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

app.include_router(auth.router, prefix = "/api/auth", tags = ["auth"])
app.include_router(oauth.router, prefix = "/api/oauth", tags = ["oauth"])

@app.exception_handler(RequestValidationError)
async def validation_execption_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code = 422,
        content = {"detail": exc.errors(), "body": exc.body},
    )
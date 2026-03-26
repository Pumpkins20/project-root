import os

from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, status

from core.security import create_access_token
from models.schemas import LoginRequest, TokenResponse

load_dotenv()
router = APIRouter()

DUMMY_USERNAME = os.getenv("DUMMY_USERNAME", "admin")
DUMMY_PASSWORD = os.getenv("DUMMY_PASSWORD", "admin123")


@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest) -> TokenResponse:
	if request.username != DUMMY_USERNAME or request.password != DUMMY_PASSWORD:
		raise HTTPException(
			status_code=status.HTTP_401_UNAUTHORIZED,
			detail="Username atau password salah",
		)

	token = create_access_token(data={"sub": request.username})
	return TokenResponse(access_token=token)

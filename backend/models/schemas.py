from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
	username: str
	password: str


class TokenResponse(BaseModel):
	access_token: str
	token_type: str = "bearer"


class SalesItem(BaseModel):
	product_id: str
	product_name: str
	jumlah_penjualan: int
	harga: int
	diskon: int
	status: str


class PredictRequest(BaseModel):
	jumlah_penjualan: float = Field(..., ge=0, description="Jumlah unit terjual")
	harga: float = Field(..., gt=0, description="Harga satuan per item")
	diskon: float = Field(..., ge=0, le=100, description="Persen diskon")


class PredictResponse(BaseModel):
	status: str
	confidence: float
	input_received: PredictRequest

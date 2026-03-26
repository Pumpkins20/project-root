from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import auth, predict, sales

app = FastAPI(
	title="Mini AI Sales Prediction API",
	description="API untuk manajemen data penjualan dan prediksi status produk",
	version="1.0.0",
)

app.add_middleware(
	CORSMiddleware,
	allow_origins=["http://localhost:5173", "http://localhost:3000"],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

app.include_router(auth.router, tags=["Authentication"])
app.include_router(sales.router, tags=["Sales"])
app.include_router(predict.router, tags=["Prediction"])


@app.get("/", tags=["Health"])
def health_check() -> dict[str, str]:
	return {"status": "ok", "message": "Mini AI Sales Prediction API is running"}

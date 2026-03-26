import os

import joblib
import pandas as pd
from fastapi import APIRouter, Depends, HTTPException

from core.security import verify_token
from models.schemas import PredictRequest, PredictResponse

router = APIRouter()

MODEL_PATH = os.path.abspath(
	os.path.join(os.path.dirname(__file__), "..", "..", "ml", "model.joblib")
)

_model_cache = None


def get_model():
	global _model_cache
	if _model_cache is None:
		if not os.path.exists(MODEL_PATH):
			raise HTTPException(
				status_code=500,
				detail="Model belum ditraining. Jalankan ml/train.py terlebih dahulu.",
			)
		_model_cache = joblib.load(MODEL_PATH)
	return _model_cache


@router.post("/predict", response_model=PredictResponse)
def predict(request: PredictRequest, _: str = Depends(verify_token)) -> PredictResponse:
	artifacts = get_model()
	model = artifacts["model"]
	scaler = artifacts["scaler"]

	features = pd.DataFrame(
		[
			{
				"jumlah_penjualan": request.jumlah_penjualan,
				"harga": request.harga,
				"diskon": request.diskon,
			}
		]
	)
	features_scaled = scaler.transform(features)

	prediction = int(model.predict(features_scaled)[0])
	proba = model.predict_proba(features_scaled)[0]

	label = "Laris" if prediction == 1 else "Tidak"
	confidence = float(proba[prediction])

	return PredictResponse(
		status=label,
		confidence=round(confidence, 4),
		input_received=request,
	)

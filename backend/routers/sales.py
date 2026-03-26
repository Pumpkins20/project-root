import os
from typing import List

import pandas as pd
from fastapi import APIRouter, Depends, HTTPException, Query

from core.security import verify_token
from models.schemas import SalesItem

router = APIRouter()

DATA_PATH = os.path.abspath(
	os.path.join(os.path.dirname(__file__), "..", "..", "data", "sales_data.csv")
)


def load_sales_data() -> pd.DataFrame:
	if not os.path.exists(DATA_PATH):
		raise HTTPException(status_code=500, detail="File data tidak ditemukan")
	return pd.read_csv(DATA_PATH)


@router.get("/sales", response_model=List[SalesItem])
def get_sales(
	skip: int = Query(0, ge=0, description="Skip N rows (pagination)"),
	limit: int = Query(100, ge=1, le=1000, description="Max rows to return"),
	_: str = Depends(verify_token),
) -> List[SalesItem]:
	df = load_sales_data()
	df_page = df.iloc[skip : skip + limit]
	return [SalesItem(**row) for row in df_page.to_dict(orient="records")]

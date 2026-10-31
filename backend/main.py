import os
import json
from datetime import datetime
from contextlib import asynccontextmanager
from typing import List, Optional
import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pymongo import MongoClient

def log_failure_local(error_details: Exception, module: str = "RecommendationEngine"):
    try:
        timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
        log_data = {
            "timestamp": timestamp,
            "error_message": str(error_details),
            "module": module,
            "status": "FAILED"
        }
        os.makedirs("crash-logs", exist_ok=True)
        with open(f"crash-logs/error-{timestamp}.json", "w") as f:
            json.dump(log_data, f, indent=4)
        print(f"✅ Local Log Saved: crash-logs/error-{timestamp}.json")
    except Exception as e:
        print(f"❌ Local Logging failed: {e}")

ml_assets = {
    "rf_model": None,
    "feature_columns": None,
    "sandbox_df": None
}

def resolve_file_path(filename: str, subfolder: str) -> str:
    base_dir = os.path.dirname(os.path.abspath(__file__))
    primary_path = os.path.join(base_dir, subfolder, filename)
    fallback_path = os.path.join(base_dir, filename)
    if os.path.exists(primary_path): return primary_path
    elif os.path.exists(fallback_path): return fallback_path
    else: raise FileNotFoundError(f"Required file '{filename}' not found.")

def build_sandbox() -> pd.DataFrame:
    print("⏳ Fetching data from Local MongoDB...")
    client = MongoClient("mongodb+srv://abhay_panchal:1234@cluster0.ois4m98.mongodb.net/collegeDB")
    db = client["collegeDB"]
    collection = db["colleges"]
    
    items = list(collection.find({}, {"_id": 0}))
    print(f"✅ Fetched {len(items)} records from MongoDB.")
    
    sandbox = pd.DataFrame(items)
    if "Base_Tuition_Fee" in sandbox.columns:
        sandbox["Base_Tuition_Fee"] = pd.to_numeric(sandbox["Base_Tuition_Fee"], errors='coerce').fillna(100000.0)
    sandbox = sandbox.dropna(subset=["Course_Domain"]).reset_index(drop=True)
    return sandbox

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Starting FastAPI Server (Local DB Mode)...")
    try:
        ml_assets["rf_model"] = joblib.load(resolve_file_path("rf_admission_predictor.pkl", "models"))
        ml_assets["feature_columns"] = joblib.load(resolve_file_path("model_features_list.pkl", "models"))
        ml_assets["sandbox_df"] = build_sandbox()
        print(f"✅ Sandbox Ready with {len(ml_assets['sandbox_df'])} Options!")
    except Exception as e:
        log_failure_local(e, module="Startup_Lifespan")
        raise e
    yield
    print("🛑 Shutting down FastAPI Server...")

app = FastAPI(title="Local Hybrid College Recommender", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

class StudentProfileRequest(BaseModel):
    ssc_marks: Optional[float] = Field(default=85.0, ge=0, le=100)
    hsc_marks: Optional[float] = Field(default=80.0, ge=0, le=100)
    percentile: float = Field(..., ge=0.0, le=100.0)
    category: str = Field(...)
    pref_budget: float = Field(..., ge=0)
    pref_city_tier: str = Field(...)
    pref_domain: str = Field(...)

class CollegeRecommendation(BaseModel):
    rank: int
    college_name: str
    city_name: str
    college_tier: str
    city_tier: str
    institute_type: str
    branch_name: str
    course_domain: str
    expected_fees: int
    avg_package_lpa: float
    highest_package_lpa: float
    top_recruiters: str
    admission_probability: float
    preference_score: float
    final_rank_score: float

class RecommendationResponse(BaseModel):
    total_evaluated: int
    qualified_branches: int
    recommendations: List[CollegeRecommendation]

@app.post("/api/recommend", response_model=RecommendationResponse)
def recommend_colleges(profile: StudentProfileRequest):
    try:
        if ml_assets["rf_model"] is None or ml_assets["sandbox_df"] is None:
            raise ValueError("ML Model or Sandbox not initialized.")

        rf_model = ml_assets["rf_model"]
        feature_columns = ml_assets["feature_columns"]
        sandbox = ml_assets["sandbox_df"].copy()

        input_data = sandbox[["Base_Tuition_Fee", "College_Tier", "City_Tier", "Course_Domain"]].copy()
        input_data.rename(columns={"Base_Tuition_Fee": "Tuition_Fee"}, inplace=True)
        input_data["Student_Percentile"] = profile.percentile
        input_data["Social_Category"] = profile.category

        input_encoded = pd.get_dummies(
            input_data,
            columns=["College_Tier", "City_Tier", "Course_Domain", "Social_Category"],
        )

        for col in feature_columns:
            if col not in input_encoded.columns:
                input_encoded[col] = 0
        input_encoded = input_encoded[feature_columns]

        probabilities = rf_model.predict_proba(input_encoded)[:, 1]
        sandbox["Admission_Probability"] = probabilities

        category_fee_map = {
            "OPEN": "Fee_OPEN", "OBC": "Fee_OBC", "SC": "Fee_SC", 
            "ST": "Fee_ST", "VJ/NT": "Fee_VJNT"
        }
        
        applicable_fee_col = category_fee_map.get(profile.category, "Fee_OPEN")
        if applicable_fee_col not in sandbox.columns:
            applicable_fee_col = "Base_Tuition_Fee"
            
        sandbox["Calculated_User_Fee"] = sandbox[applicable_fee_col].fillna(sandbox["Base_Tuition_Fee"])

        sandbox["Budget_Score"] = np.where(
            sandbox["Calculated_User_Fee"] <= profile.pref_budget,
            1.0,
            np.maximum(0.0, 1.0 - (sandbox["Calculated_User_Fee"] - profile.pref_budget) / 100000.0),
        )
        sandbox["Location_Score"] = np.where(
            sandbox["City_Tier"] == profile.pref_city_tier, 1.0, 0.5
        )
        sandbox["Domain_Score"] = np.where(
            sandbox["Course_Domain"] == profile.pref_domain, 1.0, 0.2
        )

        sandbox["Preference_Score"] = (
            (sandbox["Budget_Score"] * 0.4) + (sandbox["Location_Score"] * 0.2) + (sandbox["Domain_Score"] * 0.4)
        )

        valid_options = sandbox[sandbox["Admission_Probability"] >= 0.30].copy()
        qualified_count = len(valid_options)

        if valid_options.empty:
            return RecommendationResponse(total_evaluated=len(sandbox), qualified_branches=0, recommendations=[])

        valid_options["Final_Rank_Score"] = (
            (valid_options["Admission_Probability"] * 0.6) + (valid_options["Preference_Score"] * 0.4)
        )

        valid_options = valid_options.sort_values(by="Final_Rank_Score", ascending=False)
        top_10 = valid_options.drop_duplicates(subset=["College_Name"]).head(10)

        recommendations = []
        for idx, (_, row) in enumerate(top_10.iterrows(), start=1):
            recommendations.append(
                CollegeRecommendation(
                    rank=idx,
                    college_name=str(row["College_Name"]),
                    city_name=str(row["City_Name"]),
                    college_tier=str(row["College_Tier"]),
                    city_tier=str(row["City_Tier"]),
                    institute_type=str(row["Institute_Type"]),
                    branch_name=str(row["Branch_Name"]),
                    course_domain=str(row["Course_Domain"]),
                    expected_fees=int(row["Calculated_User_Fee"]),
                    avg_package_lpa=round(float(row["Current_Avg_Package"]), 1) if pd.notna(row["Current_Avg_Package"]) else 0.0,
                    highest_package_lpa=round(float(row["Current_Highest_Package"]), 1) if pd.notna(row["Current_Highest_Package"]) else 0.0,
                    top_recruiters=str(row["Top_Recruiters"]) if pd.notna(row["Top_Recruiters"]) else "N/A",
                    admission_probability=round(float(row["Admission_Probability"]) * 100, 1),
                    preference_score=round(float(row["Preference_Score"]) * 100, 1),
                    final_rank_score=round(float(row["Final_Rank_Score"]) * 100, 1),
                )
            )

        return RecommendationResponse(
            total_evaluated=len(sandbox),
            qualified_branches=qualified_count,
            recommendations=recommendations,
        )

    except Exception as e:
        log_failure_local(e, module="RecommendationAPI")
        raise HTTPException(status_code=500, detail="Backend engine failed. Local diagnostics saved.")
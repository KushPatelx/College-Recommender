import os
import json
from datetime import datetime
from contextlib import asynccontextmanager
from typing import List, Optional
import joblib
import numpy as np
import pandas as pd
import boto3
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from decimal import Decimal

# Load environment variables for AWS (from .env file)
load_dotenv()

# ==========================================
# AWS S3 SETUP (Logging)
# ==========================================
s3_client = boto3.client(
    's3',
    region_name=os.getenv('AWS_DEFAULT_REGION', 'us-east-1'),
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    aws_session_token=os.getenv('AWS_SESSION_TOKEN')
)
BUCKET_NAME = "abhay-college-logs-2026"

def log_failure_to_s3(error_details: Exception, module: str = "RecommendationEngine"):
    """Logs system failures to AWS S3 bucket for diagnostics."""
    try:
        timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
        file_name = f"crash-logs/error-{timestamp}.json"
        
        log_data = {
            "timestamp": timestamp,
            "error_message": str(error_details),
            "module": module,
            "status": "FAILED"
        }
        
        s3_client.put_object(
            Bucket=BUCKET_NAME,
            Key=file_name,
            Body=json.dumps(log_data, indent=4),
            ContentType='application/json'
        )
        print(f"✅ S3 Log Uploaded Successfully: {file_name}")
    except Exception as e:
        print(f"❌ S3 Upload failed: {e}")

# ==========================================
# GLOBAL STATE STORE (Loaded once at startup)
# ==========================================
ml_assets = {
    "rf_model": None,
    "feature_columns": None,
    "sandbox_df": None
}

def resolve_file_path(filename: str, subfolder: str) -> str:
    """Helper to locate files."""
    base_dir = os.path.dirname(os.path.abspath(__file__))
    primary_path = os.path.join(base_dir, subfolder, filename)
    fallback_path = os.path.join(base_dir, filename)

    if os.path.exists(primary_path):
        return primary_path
    elif os.path.exists(fallback_path):
        return fallback_path
    else:
        raise FileNotFoundError(f"Required file '{filename}' not found.")

def build_sandbox() -> pd.DataFrame:
    """Fetches data from AWS DynamoDB and builds the Pandas DataFrame."""
    print("⏳ Fetching data from AWS DynamoDB...")
    
    # DynamoDB connection setup
    dynamodb = boto3.resource(
        'dynamodb',
        region_name=os.getenv('AWS_DEFAULT_REGION', 'us-east-1'),
        aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
        aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
        aws_session_token=os.getenv('AWS_SESSION_TOKEN')
    )
    table = dynamodb.Table('CollegeRecommendationDB')
    
    # Scan karke saara data fetch karna
    response = table.scan()
    items = response.get('Items', [])
    
    # AWS pagination handle karna (agar data bada ho)
    while 'LastEvaluatedKey' in response:
        response = table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
        items.extend(response.get('Items', []))
        
    print(f"✅ Fetched {len(items)} records from DynamoDB.")
    
    # Cloud data ko Pandas DataFrame mein convert karna
    sandbox = pd.DataFrame(items)
    
    # AWS DynamoDB numbers ko 'Decimal' format mein bhejta hai, 
    # ML model ke liye inko float mein convert karna zaroori hai.
    for col in sandbox.columns:
        if sandbox[col].apply(lambda x: isinstance(x, Decimal)).any():
            sandbox[col] = sandbox[col].astype(float)
            
    # Purana data cleaning logic (Same as before)
    sandbox["Base_Tuition_Fee"] = pd.to_numeric(sandbox["Base_Tuition_Fee"], errors='coerce').fillna(100000.0)
    sandbox = sandbox.dropna(subset=["Course_Domain"]).reset_index(drop=True)
    
    return sandbox

# ==========================================
# FASTAPI LIFESPAN
# ==========================================
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Starting FastAPI Server: Loading ML Models & Building DWM Sandbox...")
    try:
        model_path = resolve_file_path("rf_admission_predictor.pkl", "models")
        features_path = resolve_file_path("model_features_list.pkl", "models")

        ml_assets["rf_model"] = joblib.load(model_path)
        ml_assets["feature_columns"] = joblib.load(features_path)
        ml_assets["sandbox_df"] = build_sandbox()

        print(f"✅ Loaded Random Forest Model & {len(ml_assets['feature_columns'])} Features.")
        print(f"✅ Sandbox Ready with {len(ml_assets['sandbox_df'])} Options!")
    except Exception as e:
        log_failure_to_s3(e, module="Startup_Lifespan")
        print(f"❌ Startup Error: {e}")
        raise e
    yield
    print("🛑 Shutting down FastAPI Server...")

app = FastAPI(
    title="Hybrid Engineering College Recommendation API",
    description="DWM Microproject - RF Predictor + S3 Error Logging",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# PYDANTIC SCHEMAS
# ==========================================
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

# ==========================================
# API ENDPOINTS
# ==========================================
@app.get("/")
def health_check():
    return {
        "status": "online",
        "project": "Hybrid College Recommender",
        "sandbox_branches": len(ml_assets["sandbox_df"]) if ml_assets["sandbox_df"] is not None else 0,
    }

@app.post("/api/recommend", response_model=RecommendationResponse)
def recommend_colleges(profile: StudentProfileRequest):
    try:
        if ml_assets["rf_model"] is None or ml_assets["sandbox_df"] is None:
            raise ValueError("ML Model or Sandbox not initialized.")

        rf_model = ml_assets["rf_model"]
        feature_columns = ml_assets["feature_columns"]
        sandbox = ml_assets["sandbox_df"].copy()

        # STEP 1: ENCODE FOR ML
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

        # STEP 2: PREDICT
        probabilities = rf_model.predict_proba(input_encoded)[:, 1]
        sandbox["Admission_Probability"] = probabilities

        # STEP 3: DYNAMIC CATEGORY FEES & SCORE
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

        # STEP 4: RANK & FILTER
        valid_options = sandbox[sandbox["Admission_Probability"] >= 0.30].copy()
        qualified_count = len(valid_options)

        if valid_options.empty:
            return RecommendationResponse(total_evaluated=len(sandbox), qualified_branches=0, recommendations=[])

        valid_options["Final_Rank_Score"] = (
            (valid_options["Admission_Probability"] * 0.6) + (valid_options["Preference_Score"] * 0.4)
        )

        valid_options = valid_options.sort_values(by="Final_Rank_Score", ascending=False)
        top_10 = valid_options.drop_duplicates(subset=["College_Name"]).head(10)

        # STEP 5: FORMAT RESPONSE
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
        # S3 LOGGING TRIGGERED ON ERROR
        log_failure_to_s3(e, module="RecommendationAPI")
        raise HTTPException(status_code=500, detail="Backend engine failed. Diagnostics sent to S3.")
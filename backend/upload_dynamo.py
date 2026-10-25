import os
import json
import uuid
import pandas as pd
import boto3
from decimal import Decimal
from dotenv import load_dotenv

# AWS Credentials Load karo
load_dotenv()

dynamodb = boto3.resource(
    'dynamodb',
    region_name=os.getenv('AWS_DEFAULT_REGION', 'us-east-1'),
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    aws_session_token=os.getenv('AWS_SESSION_TOKEN')
)
table = dynamodb.Table('CollegeRecommendationDB')

def upload_data():
    print("⏳ Reading Backend_Data.csv...")
    csv_path = os.path.join(os.path.dirname(__file__), 'data', 'Backend_Data.csv')
    df = pd.read_csv(csv_path)
    
    # Null values handle karna
    df = df.fillna(0)
    
    # NAYA CODE: Sirf DynamoDB ke liye ek unique 'id' column add kar rahe hain.
    # Isse tumhara original 'College_Name' column modify nahi hoga.
    df['id'] = [str(uuid.uuid4()) for _ in range(len(df))]
    
    records = df.to_dict(orient='records')
    items = json.loads(json.dumps(records), parse_float=Decimal)
    
    print(f"🚀 Uploading {len(items)} unique records to DynamoDB...")
    
    with table.batch_writer() as batch:
        for item in items:
            batch.put_item(Item=item)
            
    print("✅ Pura data successfully DynamoDB mein upload ho gaya bina ML model ko confuse kiye!")

if __name__ == "__main__":
    upload_data()
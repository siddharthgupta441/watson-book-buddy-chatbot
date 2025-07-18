from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import requests
from ibm_watson import AssistantV2
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator

load_dotenv()
app = Flask(__name__)
CORS(app)

API_KEY = "wkSWQC2K7Ztpd0xT_BxoM3BTcmvap2C6mLZajBq2y61R"
SERVICE_URL ="https://api.au-syd.assistant.watson.cloud.ibm.com"
ASSISTANT_ID = "02da2dca-9a60-4d79-b542-577a63afc9be"
ENV_ID = "draft"

print("API Key loaded:", API_KEY is not None)

def get_access_token():
    url = "https://iam.cloud.ibm.com/identity/token"
    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {
        "grant_type": "urn:ibm:params:oauth:grant-type:apikey",
        "apikey": API_KEY
    }

    response = requests.post(url, headers=headers, data=data)
    #print(response.json()["access_token"])
    return response.json()["access_token"]

@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message")
    access_token = get_access_token()
    # access_token = "eyJraWQiOiIyMDE5MDcyNCIsImFsZyI6IlJTMjU2In0.eyJpYW1faWQiOiJJQk1pZC02OTMwMDEwRVVKIiwiaWQiOiJJQk1pZC02OTMwMDEwRVVKIiwicmVhbG1pZCI6IklCTWlkIiwianRpIjoiMDgwNmI4OGYtNzI1MS00YjkwLWE4NzctODA2ZmFlYzBkMTQ5IiwiaWRlbnRpZmllciI6IjY5MzAwMTBFVUoiLCJnaXZlbl9uYW1lIjoiU2lkZGhhcnRoIiwiZmFtaWx5X25hbWUiOiJndXB0YSIsIm5hbWUiOiJTaWRkaGFydGggZ3VwdGEiLCJlbWFpbCI6InNpZGhhcnRoZ3VwdGE0NDFAZ21haWwuY29tIiwic3ViIjoic2lkaGFydGhndXB0YTQ0MUBnbWFpbC5jb20iLCJhdXRobiI6eyJzdWIiOiJzaWRoYXJ0aGd1cHRhNDQxQGdtYWlsLmNvbSIsImlhbV9pZCI6IklCTWlkLTY5MzAwMTBFVUoiLCJuYW1lIjoiU2lkZGhhcnRoIGd1cHRhIiwiZ2l2ZW5fbmFtZSI6IlNpZGRoYXJ0aCIsImZhbWlseV9uYW1lIjoiZ3VwdGEiLCJlbWFpbCI6InNpZGhhcnRoZ3VwdGE0NDFAZ21haWwuY29tIn0sImFjY291bnQiOnsidmFsaWQiOnRydWUsImJzcyI6IjY5YjBmMWExZDA2NjQ2MGZhOTE1NmRlM2I2NWY2NTFhIiwiZnJvemVuIjp0cnVlfSwiaWF0IjoxNzUyNDY0MDAxLCJleHAiOjE3NTI0Njc2MDEsImlzcyI6Imh0dHBzOi8vaWFtLmNsb3VkLmlibS5jb20vaWRlbnRpdHkiLCJncmFudF90eXBlIjoidXJuOmlibTpwYXJhbXM6b2F1dGg6Z3JhbnQtdHlwZTphcGlrZXkiLCJzY29wZSI6ImlibSBvcGVuaWQiLCJjbGllbnRfaWQiOiJkZWZhdWx0IiwiYWNyIjoxLCJhbXIiOlsicHdkIl19.qx7MlFGWkFvJtGg-Kqh9CJ8vlk2wc_GMxG8PSP0fGrh7ZfocJXWZS6WOcgbf2dq-8RYczekINfv49W7ApnLHsacy4qbxJ_5j4Cj0bauQQ6509pg64K5p1JwLqSa3TcihExgg3IkNg7wvelmVtFTbf5nZezTKpQFvyaGkiDSbFKqss6vx5tXoB1TPbAE3ntuZ7cVv7RiGVSrVTNXMJfQmyAA-h_ER6uDAyPrwKtIagdfzFZWlXBQbirPzt9sapfkbE6-BPRmHQ2G9VUQIVFLIapiNLEpCnmX5sD3mYV9zvTt_VbWUZ42hSKd6TtTNo-VLNRHmwficCQnFa9ZtAy-9pQ"

    url = "https://api.au-syd.assistant.watson.cloud.ibm.com/v2/assistants/02da2dca-9a60-4d79-b542-577a63afc9be/message?version=2025-07-18"
    #url = f"{SERVICE_URL}/v2/projects/{ASSISTANT_ID}/environments/{ENV_ID}/message?version=2024-05-01"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    payload = {
        "input": {
            "text": user_message
        }
    }

    response = requests.post(url, headers=headers, json=payload)
    res_json = response.json()
    #print("Calling:", url)
    print("Response JSON:", response.json())

    try:
        output_text = res_json['output']['generic'][0]['text']
    except (KeyError, IndexError):
        output_text = f"message:- {res_json.get('output')}, error:- {res_json.get('error')}"

    return jsonify({"reply": output_text})

if __name__ == "__main__":
    app.run(debug=True)
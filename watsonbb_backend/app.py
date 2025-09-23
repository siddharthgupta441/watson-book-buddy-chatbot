from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import requests
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator

load_dotenv()
app = Flask(__name__)
CORS(app)

API_KEY = os.getenv("API_KEY")
SERVICE_URL = os.getenv("SERVICE_URL")
ASSISTANT_ID = os.getenv("ASSISTANT_ID")
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
    return response.json()["access_token"]

@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message")
    access_token = get_access_token()

    url = SERVICE_URL+"/v2/assistants/"+ASSISTANT_ID+"/message?version=2025-07-18"
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

    try:
        output_text = res_json['output']['generic'][0]['text']
    except (KeyError, IndexError):
        output_text = f"message:- {res_json.get('output')}, error:- {res_json.get('error')}"

    return jsonify({"reply": output_text})

if __name__ == "__main__":
    app.run(debug=True)

@app.route("/", methods=["GET"])
def home():
    return jsonify({API_KEY})
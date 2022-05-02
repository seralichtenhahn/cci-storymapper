from flask import Flask, request, jsonify
from flask_cors import CORS
from ._parser import parse_query
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config.from_pyfile('settings.py')
 
@app.route("/parser", methods=["POST"])
def home_view():
  if not "query" in request.json:
    return jsonify({"error": "No query provided"}), 400
  query = request.json["query"]
  results = parse_query(query)
  return jsonify(results)
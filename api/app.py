from flask import Flask, request, jsonify
from ._parser import parse_query
 
app = Flask(__name__)
 
@app.route("/parser", methods=["POST"])
def home_view():
  if not "query" in request.json:
    return jsonify({"error": "No query provided"}), 400
  query = request.json["query"]
  results = parse_query(query)
  return jsonify(results)
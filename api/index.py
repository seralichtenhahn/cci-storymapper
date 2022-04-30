from http.server import BaseHTTPRequestHandler
import json
from ._parser import parse_query

class handler(BaseHTTPRequestHandler):
  def _set_headers(self):
    self.send_header('Content-type', 'application/json')
    self.end_headers()

  def do_GET(self):
    self.send_response(405)
    self._set_headers()
    self.wfile.write(json.dumps({'message': 'Method not allowed'}).encode('utf-8'))
    return

  def do_POST(self):
    content_len = int(self.headers.get('Content-Length'))
    body_string = self.rfile.read(content_len)
    body = json.loads(body_string)

    if not 'query' in body:
      self.send_response(400)
      self._set_headers()
      self.wfile.write(json.dumps({'message': 'Query is required'}).encode('utf-8'))
      return

    response = {
      "status": "success",
      "data": parse_query(body['query'])
    }

    self.send_response(200)
    self._set_headers()
    self.wfile.write(json.dumps(response).encode('utf-8'))
    return
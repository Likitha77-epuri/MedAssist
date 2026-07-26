import urllib.request
import json

BASE = "http://localhost:8000"

print("=== Testing Login with new password ===")
login_data = json.dumps({
    "email": "test@test.com",
    "password": "Admin@123"
}).encode()
try:
    req = urllib.request.Request(
        f"{BASE}/login",
        data=login_data,
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    resp = urllib.request.urlopen(req)
    body = json.loads(resp.read().decode())
    print(f"Status: {resp.status} - SUCCESS!")
    print(f"User: {body.get('user')}")
    print(f"Role: {body['user'].get('role')}")
except urllib.error.HTTPError as e:
    print(f"HTTP Error: {e.code}")
    print(f"Body: {e.read().decode()}")
except Exception as e:
    print(f"Error: {e}")

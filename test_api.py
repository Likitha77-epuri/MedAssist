import urllib.request
import json

BASE = "http://localhost:8000"

# Test 1: Health check
print("=== Test 1: Health Check ===")
try:
    resp = urllib.request.urlopen(f"{BASE}/")
    print(f"Status: {resp.status}")
    print(f"Body: {resp.read().decode()}")
except Exception as e:
    print(f"Error: {e}")

# Test 2: Register a new user
print("\n=== Test 2: Register ===")
register_data = json.dumps({
    "email": "loginfix3@test.com",
    "password": "password123",
    "full_name": "Login Fix Test",
    "role": "user"
}).encode()
try:
    req = urllib.request.Request(
        f"{BASE}/register",
        data=register_data,
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    resp = urllib.request.urlopen(req)
    print(f"Status: {resp.status}")
    print(f"Body: {resp.read().decode()}")
except urllib.error.HTTPError as e:
    print(f"HTTP Error: {e.code}")
    print(f"Body: {e.read().decode()}")
except Exception as e:
    print(f"Error: {e}")

# Test 3: Login
print("\n=== Test 3: Login ===")
login_data = json.dumps({
    "email": "loginfix3@test.com",
    "password": "password123"
}).encode()
try:
    req = urllib.request.Request(
        f"{BASE}/login",
        data=login_data,
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    resp = urllib.request.urlopen(req)
    print(f"Status: {resp.status}")
    body = json.loads(resp.read().decode())
    print(f"Token: {body.get('token', 'N/A')[:50]}...")
    print(f"Token type: {body.get('token_type', 'N/A')}")
    print(f"User: {body.get('user', 'N/A')}")
except urllib.error.HTTPError as e:
    print(f"HTTP Error: {e.code}")
    print(f"Body: {e.read().decode()}")
except Exception as e:
    print(f"Error: {e}")

# Test 4: Login with existing user
print("\n=== Test 4: Login with existing user (test@test.com) ===")
login_data2 = json.dumps({
    "email": "test@test.com",
    "password": "password123"
}).encode()
try:
    req = urllib.request.Request(
        f"{BASE}/login",
        data=login_data2,
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    resp = urllib.request.urlopen(req)
    print(f"Status: {resp.status}")
    body = json.loads(resp.read().decode())
    print(f"Token: {body.get('token', 'N/A')[:50]}...")
    print(f"User: {body.get('user', 'N/A')}")
except urllib.error.HTTPError as e:
    print(f"HTTP Error: {e.code}")
    print(f"Body: {e.read().decode()}")
except Exception as e:
    print(f"Error: {e}")

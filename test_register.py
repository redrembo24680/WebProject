import requests
import json
import uuid

# Generate unique email
email = f"test_{uuid.uuid4().hex[:8]}@example.com"

# Register user
response = requests.post(
    'http://localhost:8000/api/v1/auth/register',
    json={'email': email, 'password': 'testpassword123'}
)
print(f"Register Status: {response.status_code}")
print(f"Register Response: {response.text}")

# Test login
login_response = requests.post(
    'http://localhost:8000/api/v1/auth/login',
    data={'username': email, 'password': 'testpassword123'}
)
print(f"\nLogin Status: {login_response.status_code}")
if login_response.status_code == 200:
    print(f"Login Response: {json.dumps(login_response.json(), indent=2)}")
else:
    print(f"Login Error: {login_response.text}")

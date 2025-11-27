import requests
import json

BASE_URL = "http://127.0.0.1:8000"

print("=" * 50)
print("TESTING ALL API ENDPOINTS")
print("=" * 50)

# Test Clients
print("\n1. CLIENTS:")
try:
    response = requests.get(f"{BASE_URL}/clients")
    print(f"   Status: {response.status_code}")
    print(f"   Data: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"   Error: {e}")

# Test Projects
print("\n2. PROJECTS:")
try:
    response = requests.get(f"{BASE_URL}/projects")
    print(f"   Status: {response.status_code}")
    print(f"   Data: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"   Error: {e}")

# Test Vendors
print("\n3. VENDORS:")
try:
    response = requests.get(f"{BASE_URL}/vendors")
    print(f"   Status: {response.status_code}")
    print(f"   Data: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"   Error: {e}")

# Test Bills
print("\n4. BILLS:")
try:
    response = requests.get(f"{BASE_URL}/bills")
    print(f"   Status: {response.status_code}")
    print(f"   Data: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"   Error: {e}")

# Test Transactions (Finance/Amount)
print("\n5. TRANSACTIONS (Amount):")
try:
    response = requests.get(f"{BASE_URL}/transactions")
    print(f"   Status: {response.status_code}")
    print(f"   Data: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"   Error: {e}")

# Test Valuations
print("\n6. VALUATIONS:")
try:
    response = requests.get(f"{BASE_URL}/valuations")
    print(f"   Status: {response.status_code}")
    print(f"   Data: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"   Error: {e}")

print("\n" + "=" * 50)
print("TEST COMPLETE")
print("=" * 50)

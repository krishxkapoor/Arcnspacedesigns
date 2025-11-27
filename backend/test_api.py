import requests
import uuid

BASE_URL = "http://localhost:8000"

def test_clients():
    print("Testing Clients...")
    # Create
    client_data = {
        "name": "Test Client",
        "address": "123 Test St",
        "sno": "TEST001"
    }
    response = requests.post(f"{BASE_URL}/clients/", json=client_data)
    if response.status_code != 200:
        print(f"Failed to create client. Status: {response.status_code}, Response: {response.text}")
    assert response.status_code == 200
    client_id = response.json()["id"]
    print(f"Created client: {client_id}")

    # Read
    response = requests.get(f"{BASE_URL}/clients/")
    assert response.status_code == 200
    assert len(response.json()) > 0
    print("Read clients successfully")

    # Delete
    response = requests.delete(f"{BASE_URL}/clients/{client_id}")
    assert response.status_code == 200
    print("Deleted client successfully")

def test_projects():
    print("\nTesting Projects...")
    # Create
    project_data = {
        "name": "Test Project"
    }
    response = requests.post(f"{BASE_URL}/projects/", json=project_data)
    assert response.status_code == 200
    project_id = response.json()["id"]
    print(f"Created project: {project_id}")

    # Read
    response = requests.get(f"{BASE_URL}/projects/")
    assert response.status_code == 200
    assert len(response.json()) > 0
    print("Read projects successfully")

    # Delete
    response = requests.delete(f"{BASE_URL}/projects/{project_id}")
    assert response.status_code == 200
    print("Deleted project successfully")

if __name__ == "__main__":
    try:
        test_clients()
        test_projects()
        print("\nAll tests passed!")
    except requests.exceptions.ConnectionError:
        print("\nError: Could not connect to the backend. Make sure it is running on http://localhost:8000")
    except AssertionError as e:
        print(f"\nTest failed: {e}")
    except Exception as e:
        print(f"\nAn error occurred: {e}")

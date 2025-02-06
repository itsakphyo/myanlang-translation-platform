# from fastapi.testclient import TestClient
# from app.main import app

# client = TestClient(app)

# def test_send_verification_code():
#     response = client.post(
#         "/auth/send-code",
#         json={"email": "test@example.com"}
#     )
#     assert response.status_code == 200
#     assert "code" in response.json()

# def test_register():
#     response = client.post(
#         "/auth/register",
#         json={
#             "email": "test@example.com",
#             "full_name": "Test User",
#             "age": 25,
#             "phone_number": "+1234567890",
#             "password": "testpassword"
#         }
#     )
#     assert response.status_code == 200
#     assert response.json()["email"] == "test@example.com" 
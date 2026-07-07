from app.core.security import create_access_token

token = create_access_token(
    {
        "sub": "student@test.com",
        "role": "student"
    }
)

print(token)
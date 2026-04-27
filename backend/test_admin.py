import asyncio
from httpx import AsyncClient, ASGITransport
from app.gateway.app import app
from app.auth.models import User
from app.gateway.deps import async_session_maker

async def test_admin_route():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # 1. Create a normal user
        res = await ac.post("/auth/register", json={
            "username": "testuser",
            "email": "test@test.com",
            "password": "testpassword"
        })
        print("Register user:", res.status_code, res.json())

        # 2. Login to get token
        res = await ac.post("/auth/login", data={
            "username": "testuser",
            "password": "testpassword"
        })
        token = res.json()["access_token"]
        print("Login user:", res.status_code)

        # 3. Access admin route with normal user (should fail 403)
        res = await ac.get("/api/admin/users", headers={"Authorization": f"Bearer {token}"})
        print("Normal user accessing admin route:", res.status_code, res.json())

        # 4. Make user an admin in DB
        async with async_session_maker() as session:
            from sqlalchemy.future import select
            result = await session.execute(select(User).where(User.username == "testuser"))
            user = result.scalars().first()
            user.role = "admin"
            await session.commit()
        
        # 5. Access admin route with admin user (should succeed 200)
        res = await ac.get("/api/admin/users", headers={"Authorization": f"Bearer {token}"})
        print("Admin user accessing admin route:", res.status_code, res.json())

if __name__ == "__main__":
    asyncio.run(test_admin_route())
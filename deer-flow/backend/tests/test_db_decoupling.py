import os
import pytest
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.future import select

from app.auth.models import Base, User
from app.gateway.deps import get_db_session, get_auth_db

@pytest.mark.anyio
async def test_db_decoupling(tmp_path, monkeypatch):
    """
    Verify that writing a user with get_auth_db doesn't affect get_db_session
    when AUTH_DATABASE_URL differs from DATABASE_URL.
    """
    # Create two different SQLite databases
    main_db_path = tmp_path / "main.db"
    auth_db_path = tmp_path / "auth.db"
    
    main_db_url = f"sqlite+aiosqlite:///{main_db_path}"
    auth_db_url = f"sqlite+aiosqlite:///{auth_db_path}"
    
    # Create engines and session makers
    test_engine = create_async_engine(main_db_url, echo=False)
    test_auth_engine = create_async_engine(auth_db_url, echo=False)
    
    test_session_maker = async_sessionmaker(test_engine, expire_on_commit=False, class_=AsyncSession)
    test_auth_session_maker = async_sessionmaker(test_auth_engine, expire_on_commit=False, class_=AsyncSession)
    
    import app.gateway.deps as deps
    monkeypatch.setattr(deps, "async_session_maker", test_session_maker)
    monkeypatch.setattr(deps, "auth_session_maker", test_auth_session_maker)
            
    # Initialize tables in both databases
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
    async with test_auth_engine.begin() as auth_conn:
        await auth_conn.run_sync(Base.metadata.create_all)
        
    # Write a user using the auth session
    auth_db_gen = get_auth_db()
    auth_session = await anext(auth_db_gen)
    
    test_user = User(
        username="testuser",
        email="test@example.com",
        hashed_password="hashed_password_abc",
        role="user"
    )
    auth_session.add(test_user)
    await auth_session.commit()
    
    # Verify the user exists in auth_db
    result = await auth_session.execute(select(User).where(User.username == "testuser"))
    user_in_auth = result.scalars().first()
    assert user_in_auth is not None
    assert user_in_auth.username == "testuser"
    
    # Verify the user does NOT exist in main_db
    main_db_gen = get_db_session()
    main_session = await anext(main_db_gen)
    
    result_main = await main_session.execute(select(User).where(User.username == "testuser"))
    user_in_main = result_main.scalars().first()
    assert user_in_main is None
    
    # Clean up generators
    try:
        await anext(auth_db_gen)
    except StopAsyncIteration:
        pass
        
    try:
        await anext(main_db_gen)
    except StopAsyncIteration:
        pass
        
    # Close engines
    await test_engine.dispose()
    await test_auth_engine.dispose()

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool
from app.core.config import settings

# Add pooling configuration
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=True,
    pool_pre_ping=True,  # Add connection health check
    pool_size=5,         # Set maximum number of connections
    max_overflow=10,     # Allow up to 10 connections to overflow
    pool_timeout=30,     # Connection timeout in seconds
    pool_recycle=1800,   # Recycle connections every 30 minutes
)

async_session = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

async def get_db():
    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

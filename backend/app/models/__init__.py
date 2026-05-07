from app.core.database import Base

# Import models to ensure they are registered on the metadata
from app.models import user  # noqa: F401
from app.models import note  # noqa: F401

__all__ = ["Base"]

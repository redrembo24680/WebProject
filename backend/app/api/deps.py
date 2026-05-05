from typing import Annotated

from fastapi import Depends


def get_db_session() -> Annotated[None, Depends]:
    return None

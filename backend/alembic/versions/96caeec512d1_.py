"""...

Revision ID: 96caeec512d1
Revises: 7ca1c270e229
Create Date: 2025-01-28 17:17:26.968473

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '96caeec512d1'
down_revision: Union[str, None] = '7ca1c270e229'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass

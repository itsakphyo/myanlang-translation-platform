"""add admin

Revision ID: e3ec01af0632
Revises: c077d5776871
Create Date: 2025-03-18 16:15:23.286295

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import text



# revision identifiers, used by Alembic.
revision: str = 'e3ec01af0632'
down_revision: Union[str, None] = 'c077d5776871'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # Get the connection to execute raw SQL
    conn = op.get_bind()

    hashed_password = "$2b$12$7qzketikQj1N1HjSQVIebO82AM8rqDChF2mENmr4ebFsKjHXm1wD6"

    # Insert the Super Admin user
    conn.execute(
        text("""
            INSERT INTO admin (admin_id, username, password_hash, email)
            VALUES (:admin_id, :username, :password_hash, :email)
            ON CONFLICT (admin_id) DO NOTHING
        """),
        {"admin_id": 1, "username": "Super Admin", "password_hash": hashed_password, "email": "superadmin@email.com"}
    )

def downgrade():
    # Remove the Super Admin user if rollback is needed
    conn = op.get_bind()
    conn.execute(text("DELETE FROM admin WHERE admin_id = 1"))

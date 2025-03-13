"""Modify report_status column type to new ENUM with rpstatus

Revision ID: 533c5ea92bc2
Revises: b65cdd887259
Create Date: 2025-03-13 15:06:09.356974

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# Revision identifiers, used by Alembic.
revision = '533c5ea92bc2'
down_revision = 'b65cdd887259'
branch_labels = None
depends_on = None

# Define the old and new ENUM types
old_enum = postgresql.ENUM('UNDER_REVIEW', 'PROCEED', name='reportstatus')
# New enum values: include 'REJECTED' along with the old ones.
# We'll create a temporary ENUM type first with a temporary name.
temp_new_enum = postgresql.ENUM('REJECTED', 'UNDER_REVIEW', 'PROCEED', name='rpstatus_new')

def upgrade() -> None:
    # 1. Create a temporary new ENUM type (rpstatus_new)
    new_enum = postgresql.ENUM('REJECTED', 'UNDER_REVIEW', 'PROCEED', name='rpstatus_new')
    new_enum.create(op.get_bind(), checkfirst=True)

    # 2. Alter the column using the temporary ENUM type with explicit cast
    op.execute("""
        ALTER TABLE issue_report 
        ALTER COLUMN report_status 
        TYPE rpstatus_new 
        USING report_status::text::rpstatus_new;
    """)

    # 3. Drop the old ENUM type if not used elsewhere
    op.execute("DROP TYPE reportstatus")

    # 3. Rename the new ENUM type to the target name 'rpstatus'
    op.execute("ALTER TYPE rpstatus_new RENAME TO rpstatus")

def downgrade():
    # 1. Recreate the old ENUM type with a temporary name
    old_enum_temp = postgresql.ENUM('UNDER_REVIEW', 'PROCEED', name='reportstatus_new')
    old_enum_temp.create(op.get_bind(), checkfirst=True)

    # 2. Change the column back to text before converting to the old ENUM type
    op.execute("""
        ALTER TABLE issue_report
        ALTER COLUMN report_status TYPE TEXT;
    """)

    # 2. Drop the current ENUM type (rpstatus)
    op.execute("DROP TYPE rpstatus")

    # 3. Rename the temporary old enum to 'reportstatus'
    op.execute("ALTER TYPE reportstatus_temp RENAME TO reportstatus")

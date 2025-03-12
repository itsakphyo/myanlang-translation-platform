from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '3ff12b9ca244'
down_revision = '3fea4535cde7'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create the new ENUM type
    new_enum = postgresql.ENUM('WRONG_SOURCE_LANGUAGE', 'NOT_ENOUGH_TIME', 'PAYMENT_DELAY', 'ACCURACY_APPEAL', 'OTHER', name='issues', create_type=True)
    new_enum.create(op.get_bind())

    # Alter the column using explicit casting
    op.execute("ALTER TABLE issue_report ALTER COLUMN issue_type TYPE issues USING issue_type::text::issues")

    # Drop the old ENUM type
    op.execute("DROP TYPE issuetype")


def downgrade() -> None:
    # Recreate the old ENUM type
    old_enum = postgresql.ENUM('WRONG_SOURCE_LANGUAGE', 'PAYMENT_DELAY', 'ACCURACY_APPEAL', 'OTHER', name='issuetype', create_type=True)
    old_enum.create(op.get_bind())

    # Alter the column back to the old ENUM type
    op.execute("ALTER TABLE issue_report ALTER COLUMN issue_type TYPE issuetype USING issue_type::text::issuetype")

    # Drop the new ENUM type
    op.execute("DROP TYPE issues")

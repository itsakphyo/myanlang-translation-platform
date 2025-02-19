from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'c96a394ce7d2'
down_revision = '73dd97bb9304'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create the enum type first
    ass_submission_status = sa.Enum('UNDER_REVIEW', 'COMPLETE', name='ass_submission_status')
    ass_submission_status.create(op.get_bind(), checkfirst=True)

    # Now add the column using the created enum type
    op.add_column(
        'freelancer_language_pair',
        sa.Column('status', ass_submission_status, nullable=False)
    )


def downgrade() -> None:
    # Remove the column first
    op.drop_column('freelancer_language_pair', 'status')

    # Then drop the enum type
    ass_submission_status = sa.Enum('UNDER_REVIEW', 'COMPLETE', name='ass_submission_status')
    ass_submission_status.drop(op.get_bind(), checkfirst=True)

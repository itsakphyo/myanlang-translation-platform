"""job status for both job and task tables

Revision ID: 93647887eb1a
Revises: 34ef2136c6ac
Create Date: 2025-02-01 18:28:50.658471

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '93647887eb1a'
down_revision: Union[str, None] = '34ef2136c6ac'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# Optionally, import your enum so that you don’t duplicate the values:
from app.schemas.enums import JobStatus
# Extract the values from your enum. This assumes your JobStatus is defined as:
#   class JobStatus(str, Enum):
#       IN_PROGRESS = "in_progress"
#       COMPLETED = "completed"
#       CLOSED = "closed"
# ENUM_JOB_VALUES = (JobStatus.IN_PROGRESS.value,
#                    JobStatus.COMPLETED.value,
#                    JobStatus.CLOSED.value)
# Alternatively, you could simply define:
# ENUM_JOB_VALUES = ('in_progress', 'completed', 'closed')

def upgrade() -> None:
    # -------------------------------------------------------
    # Add job_status column to the "job" table
    # -------------------------------------------------------
    op.add_column(
        'job',
        sa.Column(
            'job_status',
            sa.Enum('IN_PROGRESS', 'COMPLETED', 'CLOSED', name='jobstatus'),
            nullable=True  # add as nullable to avoid issues with existing rows
        )
    )
    # Set a default value for existing rows (use uppercase)
    op.execute("UPDATE job SET job_status = 'IN_PROGRESS'")
    # Now, alter the column to be NOT NULL:
    op.alter_column('job', 'job_status', nullable=False)

    # -------------------------------------------------------
    # Add job_status column to the "task" table
    # -------------------------------------------------------
    # op.add_column(
    #     'task',
    #     sa.Column(
    #         'job_status',
    #         sa.Enum('IN_PROGRESS', 'COMPLETED', 'CLOSED', name='jobstatus'),
    #         nullable=True  # add as nullable first
    #     )
    # )
    # op.execute("UPDATE task SET job_status = 'IN_PROGRESS'")
    # op.alter_column('task', 'job_status', nullable=False)



def downgrade() -> None:
    # Remove the job_status column from both tables.
    op.drop_column('task', 'job_status')
    op.drop_column('job', 'job_status')

"""adicionar foto ao usuario

Revision ID: c4e9b2a7d158
Revises: a7c3f1d92b44
Create Date: 2026-10-29 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c4e9b2a7d158'
down_revision: Union[str, Sequence[str], None] = 'a7c3f1d92b44'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('usuarios', sa.Column('foto_url', sa.String(length=500), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('usuarios', 'foto_url')

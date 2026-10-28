"""adicionar descricao ao produto

Revision ID: a7c3f1d92b44
Revises: e348e7211928
Create Date: 2026-10-28 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a7c3f1d92b44'
down_revision: Union[str, Sequence[str], None] = 'e348e7211928'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('produto', sa.Column('descricao', sa.Text(), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('produto', 'descricao')

"""Add ssn column to users table

Revision ID: 588131984822
Revises: bfc122a455e6
Create Date: 2024-04-23 18:58:25.793391

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '588131984822'
down_revision = 'bfc122a455e6'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('users', sa.Column('ssn', sa.String(length=20), nullable=True))


def downgrade():
    op.drop_column('users', 'ssn')

"""create_magazines_table

Revision ID: a077d93dd325
Revises: b22b1888bf2a
Create Date: 2024-04-24 14:47:48.876965

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a077d93dd325'
down_revision = 'b22b1888bf2a'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('magazines',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name_of_magazine', sa.String(length=255), nullable=True),
    sa.Column('publisher_id', sa.Integer(), sa.ForeignKey('publishers.id'), nullable=True),
    sa.Column('issn', sa.String(length=255), nullable=True),
    sa.Column('volume', sa.Integer(), nullable=True),
    sa.Column('year', sa.Integer(), nullable=True),
    sa.Column('month', sa.Integer(), nullable=True),
    sa.Column('status', sa.Enum('active', 'inactive', name='magazine_status'), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.Index('ix_magazines_publisher_id', 'publisher_id', unique=False),
    sa.Index('ix_magazines_status', 'status', unique=False)
    )



def downgrade():
    op.drop_table('magazines')
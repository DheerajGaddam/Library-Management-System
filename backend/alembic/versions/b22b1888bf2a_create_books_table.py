"""create Books table

Revision ID: b22b1888bf2a
Revises: 5ba220db472b
Create Date: 2024-04-24 14:06:31.096715

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b22b1888bf2a'
down_revision = '5ba220db472b'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('books',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=True),
        sa.Column('author_id', sa.Integer(), sa.ForeignKey('authors.id'), nullable=True),
        sa.Column('publisher_id', sa.Integer(), sa.ForeignKey('publishers.id'), nullable=True),
        sa.Column('isbn', sa.String(length=255), nullable=True),
        sa.Column('edition', sa.Integer(), nullable=True),
        sa.Column('status', sa.Enum('active', 'inactive', name='book_status'), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
    )


def downgrade():
    op.drop_table('books')

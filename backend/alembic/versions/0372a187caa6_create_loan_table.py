"""create loan table

Revision ID: 0372a187caa6
Revises: 9c40c8b4fa62
Create Date: 2024-04-25 15:01:28.347361

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0372a187caa6'
down_revision = '9c40c8b4fa62'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'loans',
        sa.Column('id', sa.Integer(), nullable=False,index=True),
        sa.Column('document_id', sa.Integer(), sa.ForeignKey('documents.id'),index=True),
        sa.Column('lend_date', sa.DateTime(), nullable=True),
        sa.Column('return_date', sa.DateTime(), nullable=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id')),     
        sa.Column('status', sa.Enum('active', 'inactive', name='loan_status'), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade():
    op.drop_table('loans')

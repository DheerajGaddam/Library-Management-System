"""create users table

Revision ID: bfc122a455e6
Revises: 
Create Date: 2024-04-21 17:38:41.771939

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'bfc122a455e6'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'users',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('name', sa.String(255)),
        sa.Column('email', sa.String(255), unique=True),
        sa.Column('hashedPassword', sa.String, nullable=False),
        sa.Column('address', sa.String(255), nullable=True),
        sa.Column('user_type', sa.Enum('librarian', 'client', name='user_types'), default='client'),
        sa.Column('salary', sa.DECIMAL(10, 2), nullable=True),
        sa.Column('status', sa.Enum('active', 'inactive', name='user_status'), default='active'),
        sa.Column('created_at', sa.DateTime,default=None),
        sa.Column('updated_at', sa.DateTime,default=None)
    )

    op.create_index(op.f('ix_users_email'), 'users', ['email'])
    op.create_index(op.f('ix_users_user_type'), 'users', ['user_type'])
    op.create_index(op.f('ix_users_status'), 'users', ['status'])

def downgrade():
    op.drop_table('users')

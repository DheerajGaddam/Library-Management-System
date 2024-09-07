"""Add user_id to payments and creditcards

Revision ID: 13e25916a856
Revises: e01052bd5359
Create Date: 2024-04-27 05:25:31.073304

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '13e25916a856'
down_revision = 'e01052bd5359'
branch_labels = None
depends_on = None


def upgrade():
    # Add user_id column to payments table
    op.add_column('payments', sa.Column('user_id', sa.Integer, nullable=False))
    op.create_foreign_key('fk_payments_user_id', 'payments', 'users', ['user_id'], ['id'])

    # Add user_id column to creditcards table
    op.add_column('creditcards', sa.Column('user_id', sa.Integer, nullable=False))
    op.create_foreign_key('fk_creditcards_user_id', 'creditcards', 'users', ['user_id'], ['id'])


def downgrade():
    # Remove foreign key constraint and user_id column from payments table
    op.drop_constraint('fk_payments_user_id', 'payments', type_='foreignkey')
    op.drop_column('payments', 'user_id')

    # Remove foreign key constraint and user_id column from creditcards table
    op.drop_constraint('fk_creditcards_user_id', 'creditcards', type_='foreignkey')
    op.drop_column('creditcards', 'user_id')

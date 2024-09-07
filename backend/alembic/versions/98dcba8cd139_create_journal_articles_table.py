"""create_journal_articles_table

Revision ID: 98dcba8cd139
Revises: a077d93dd325
Create Date: 2024-04-24 15:06:00.489515

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '98dcba8cd139'
down_revision = 'a077d93dd325'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('journal_articles',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name_of_journal', sa.String(length=255), nullable=True),
    sa.Column('title', sa.String(length=255), nullable=True),
    sa.Column('author_id', sa.Integer(), sa.ForeignKey('public.authors.id'), nullable=True),
    sa.Column('date_of_article', sa.Date(), nullable=True),
    sa.Column('issue', sa.Integer(), nullable=True),
    sa.Column('year', sa.Integer(), nullable=True),
    sa.Column('publisher_id', sa.Integer(), sa.ForeignKey('public.publishers.id'), nullable=True),
    sa.Column('status', sa.Enum('active', 'inactive', name='journal_article_status'), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True, server_default=sa.text('CURRENT_TIMESTAMP')),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_journal_articles_name_of_journal'), 'journal_articles', ['name_of_journal'], unique=False)
    op.create_index(op.f('ix_journal_articles_author_id'), 'journal_articles', ['author_id'], unique=False)
    op.create_index(op.f('ix_journal_articles_publisher_id'), 'journal_articles', ['publisher_id'], unique=False)
    op.create_index(op.f('ix_journal_articles_status'), 'journal_articles', ['status'], unique=False)
    op.create_index(op.f('ix_journal_articles_created_at'), 'journal_articles', ['created_at'], unique=False)
    op.create_index(op.f('ix_journal_articles_updated_at'), 'journal_articles', ['updated_at'], unique=False)


def downgrade():
    op.drop_index(op.f('ix_journal_articles_updated_at'), table_name='journal_articles')
    op.drop_index(op.f('ix_journal_articles_created_at'), table_name='journal_articles')
    op.drop_index(op.f('ix_journal_articles_status'), table_name='journal_articles')
    op.drop_index(op.f('ix_journal_articles_publisher_id'), table_name='journal_articles')
    op.drop_index(op.f('ix_journal_articles_author_id'), table_name='journal_articles')
    op.drop_index(op.f('ix_journal_articles_name_of_journal'), table_name='journal_articles')
    op.drop_table('journal_articles')


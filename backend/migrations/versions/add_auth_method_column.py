"""add auth_method column

Revision ID: {random_id}
Revises: {previous_revision}
Create Date: 2024-03-05 19:50:29.894

"""
from alembic import op
import sqlalchemy as sa

def upgrade():
    op.add_column('users', sa.Column('auth_method', sa.String(), nullable=True, server_default='email'))

def downgrade():
    op.drop_column('users', 'auth_method')
#!/bin/bash

# Create frontend directory structure
mkdir -p src/{components/{auth,common},hooks,pages,types,utils}
mkdir -p public/assets
mkdir -p backend/{app,tests,logs,alembic/versions}

# Create necessary empty files
touch backend/__init__.py
touch backend/app/__init__.py
touch backend/tests/__init__.py
touch backend/alembic/__init__.py

# Create frontend files
touch src/components/auth/Login.tsx
touch src/components/auth/Register.tsx
touch src/components/common/ProtectedRoute.tsx
touch src/hooks/useAuth.ts
touch src/pages/Auth.tsx
touch src/pages/Dashboard.tsx
touch src/types/auth.ts
touch src/types/global.d.ts
touch src/types/mui-tel-input.d.ts
touch src/App.tsx
touch src/main.tsx
touch src/theme.ts

# Create backend files
touch backend/app/auth.py
touch backend/app/database.py
touch backend/app/db_utils.py
touch backend/app/deps.py
touch backend/app/email.py
touch backend/app/logger.py
touch backend/app/main.py
touch backend/app/models.py
touch backend/app/schemas.py
touch backend/tests/conftest.py
touch backend/tests/test_auth.py

# Create other necessary files
touch .env
touch .env.backend
touch .gitignore
touch .npmrc
touch index.html

echo "Project structure created successfully!" 
@echo off

:: Create frontend directory structure
mkdir src\components\auth
mkdir src\components\common
mkdir src\hooks
mkdir src\pages
mkdir src\types
mkdir src\utils
mkdir public\assets

:: Create backend directory structure
mkdir backend\app
mkdir backend\tests
mkdir backend\logs
mkdir backend\alembic\versions

:: Create necessary empty files
echo. > backend\__init__.py
echo. > backend\app\__init__.py
echo. > backend\tests\__init__.py
echo. > backend\alembic\__init__.py

:: Create frontend files
echo. > src\components\auth\Login.tsx
echo. > src\components\auth\Register.tsx
echo. > src\components\common\ProtectedRoute.tsx
echo. > src\hooks\useAuth.ts
echo. > src\pages\Auth.tsx
echo. > src\pages\Dashboard.tsx
echo. > src\types\auth.ts
echo. > src\types\global.d.ts
echo. > src\types\mui-tel-input.d.ts
echo. > src\App.tsx
echo. > src\main.tsx
echo. > src\theme.ts

:: Create backend files
echo. > backend\app\auth.py
echo. > backend\app\database.py
echo. > backend\app\db_utils.py
echo. > backend\app\deps.py
echo. > backend\app\email.py
echo. > backend\app\logger.py
echo. > backend\app\main.py
echo. > backend\app\models.py
echo. > backend\app\schemas.py
echo. > backend\tests\conftest.py
echo. > backend\tests\test_auth.py

:: Create other necessary files
echo. > .env
echo. > .env.backend
echo. > .gitignore
echo. > .npmrc
echo. > index.html

echo Project structure created successfully!
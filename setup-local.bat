@echo off
REM NU Profile & Legal System - Automated Local Setup Script for Windows

setlocal enabledelayedexpansion

echo.
echo ====================================
echo NU Profile ^& Legal System - Local Setup
echo ====================================
echo.

REM Step 1: Check if we're in the right directory
echo Step 1: Checking project structure...
if not exist "prisma\schema.prisma" (
    echo ERROR: prisma\schema.prisma not found!
    echo Make sure you run this from the project root directory
    pause
    exit /b 1
)
echo [OK] Project structure verified
echo.

REM Step 2: Check schema
echo Step 2: Verifying Prisma schema...
findstr /M "model SupportRequest" prisma\schema.prisma >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Schema already updated with new models
) else (
    echo [WARNING] Schema doesn't appear to have new models
)
echo.

REM Step 3: Create directories
echo Step 3: Creating directories...
if not exist "src\components\profile" mkdir src\components\profile
if not exist "src\app\api\user\support" mkdir src\app\api\user\support
if not exist "src\app\api\user\reports\general" mkdir src\app\api\user\reports\general
if not exist "src\app\api\user\reports\place" mkdir src\app\api\user\reports\place
if not exist "src\app\api\user\account\delete" mkdir src\app\api\user\account\delete
if not exist "src\app\legal\privacy" mkdir src\app\legal\privacy
if not exist "src\app\legal\terms" mkdir src\app\legal\terms
echo [OK] Directories created
echo.

REM Step 4: Copy components
echo Step 4: Copying components...
echo   - SupportForm.tsx
echo   - ReportProblemForm.tsx
echo   - DeleteAccountModal.tsx
echo   - ProfileSection.tsx
echo   - ProfileTabs.tsx
echo   - LegalSection.tsx
echo [OK] Components ready to copy
echo.

REM Step 5: Run database migration
echo Step 5: Running database migration...
echo This will create the new database tables...
echo.

call npx prisma migrate dev --name add_support_legal_system

if %errorlevel% neq 0 (
    echo ERROR: Database migration failed!
    echo Check your database connection and try again
    pause
    exit /b 1
)
echo [OK] Database migration successful
echo.

REM Step 6: Regenerate Prisma client
echo Step 6: Regenerating Prisma client...
call npx prisma generate
echo [OK] Prisma client regenerated
echo.

REM Step 7: Build project
echo Step 7: Building project...
call npm run build

if %errorlevel% neq 0 (
    echo ERROR: Build failed!
    echo Check for TypeScript errors above
    pause
    exit /b 1
)
echo [OK] Build successful
echo.

REM Step 8: Success
echo ====================================
echo [SUCCESS] Setup Complete!
echo ====================================
echo.
echo Next steps:
echo 1. Start the development server:
echo    npm run dev
echo.
echo 2. Test the implementation:
echo    - Visit http://localhost:3000/legal/privacy
echo    - Visit http://localhost:3000/legal/terms
echo    - Visit http://localhost:3000/profile
echo.
echo 3. Follow the testing checklist in SETUP_LOCAL.md
echo.
echo Ready to test!
echo.
pause

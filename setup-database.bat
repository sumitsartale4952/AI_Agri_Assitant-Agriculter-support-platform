@echo off
REM Setup MySQL Database for AI Agri Assistant
REM This script initializes the irrigation schedules database

echo.
echo ============================================================================
echo AI Agri Assistant - MySQL Database Setup
echo ============================================================================
echo.

REM Check if MySQL is installed
WHERE mysql >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    echo ERROR: MySQL is not installed or not in PATH
    echo Please install MySQL and ensure it is added to your system PATH
    echo Download from: https://dev.mysql.com/downloads/mysql/
    pause
    exit /b 1
)

echo ✓ MySQL found
echo.

REM Database credentials
set DB_USER=root
set DB_HOST=localhost
set DB_PORT=3306
set DB_NAME=ai_agri_assistant

echo Database Configuration:
echo   Host: %DB_HOST%
echo   Port: %DB_PORT%
echo   Database: %DB_NAME%
echo   User: %DB_USER%
echo.

echo Connecting to MySQL...
echo.

REM Run the initialization script
mysql -u %DB_USER% -h %DB_HOST% -P %DB_PORT% < database\init_mysql.sql

IF %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Failed to initialize database
    echo Please verify:
    echo   1. MySQL server is running
    echo   2. Database credentials are correct (root/Sunny@4952)
    echo   3. You have permission to create databases
    echo.
    pause
    exit /b 1
)

echo.
echo ============================================================================
echo ✓ Database setup completed successfully!
echo ============================================================================
echo.
echo Next steps:
echo   1. Update backend/.env with your database credentials
echo   2. Run: python backend/main.py (to start the backend)
echo   3. Run: npm run dev (in frontend folder to start the frontend)
echo.
echo The API will be available at: http://localhost:8000
echo The frontend will be available at: http://localhost:4173
echo.
pause

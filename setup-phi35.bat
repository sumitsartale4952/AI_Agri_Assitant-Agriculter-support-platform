@echo off
REM Phi-3.5 Mini Setup Script for Windows
REM This script helps set up Ollama and pull the Phi-3.5 Mini model

echo.
echo ============================================
echo Phi-3.5 Mini Setup for AI-Agri Assistant
echo ============================================
echo.

REM Check if Ollama is installed
where ollama >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Ollama is not installed or not in PATH
    echo.
    echo Please download and install Ollama from: https://ollama.ai
    echo.
    pause
    exit /b 1
)

echo [OK] Ollama found!
echo.

REM Check if Ollama is running
echo Checking if Ollama is running...
curl -s http://localhost:11434/api/tags >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Ollama service is not running
    echo.
    echo Please start Ollama first:
    echo 1. Open Ollama application
    echo 2. Or run: ollama serve
    echo.
    pause
    exit /b 1
)

echo [OK] Ollama is running!
echo.

REM Pull Phi-3.5 model
echo Pulling Phi-3.5 Mini model...
echo This may take a few minutes on first run...
echo.

ollama pull phi3.5

echo.
echo ============================================
echo Setup Complete!
echo ============================================
echo.
echo Phi-3.5 Mini is now installed and running.
echo.
echo You can now use the FAQ generation with real responses.
echo Test it with: http://localhost:8000/api/faq/generate?question=How%20to%20grow%20wheat?
echo.
pause

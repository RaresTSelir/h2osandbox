@echo off
echo ==================================@echo off
echo =======================================
echo   UNIVERSAL JSP DEVELOPMENT ENVIRONMENT
echo =======================================
echo.
echo Checking Node.js installation...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Minimum version required: 14.x
    pause
    exit /b 1
)

echo ✅ Node.js found: 
node --version

echo.
echo Checking dependencies...

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies!
        pause
        exit /b 1
    )
    echo ✅ Dependencies installed successfully!
) else (
    echo ✅ Dependencies already installed
)

echo.
echo 📁 Checking JSP files...

REM Check JSPUnderConstruction folder
if not exist "JSPUnderConstruction" (
    echo 📁 Creating JSPUnderConstruction folder...
    mkdir JSPUnderConstruction
)

REM Count JSP files
for /f %%i in ('dir "JSPUnderConstruction\*.jsp" 2^>nul ^| find " File(s)" ^| findstr /o ".*"') do set jsp_count=%%i
if not defined jsp_count set jsp_count=0

if %jsp_count%==0 (
    echo ⚠️  No JSP files found in JSPUnderConstruction folder
    echo.
    echo 💡 HOW TO START:
    echo    1. Drop any .jsp file into JSPUnderConstruction/ folder
    echo    2. Run this script again, or start with: npm run dev
    echo.
    pause
    exit /b 0
) else (
    echo ✅ Found JSP files ready for development
)

echo.
echo 🚀 Starting Universal JSP Development Environment...
echo.
echo ⚡ Features:
echo   - Universal JSP file support
echo   - Ultra-fast live reload
echo   - Browser auto-refresh
echo   - SuperCSS styling included
echo   - Drag & Drop JSP files
echo.
echo 🌐 Access URLs:
echo   - Application: http://localhost:3010
echo   - Browser Sync UI: http://localhost:3011
echo.
echo 💡 Drop any JSP file into JSPUnderConstruction/ and see it instantly!
echo.
echo Press Ctrl+C to stop the development server
echo.

npm run dev====
echo   JSP DEVELOPMENT ENVIRONMENT
echo =======================================
echo.
echo Checking Node.js installation...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Minimum version required: 14.x
    pause
    exit /b 1
)

echo ✅ Node.js found: 
node --version

echo.
echo Checking dependencies...

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies!
        pause
        exit /b 1
    )
    echo ✅ Dependencies installed successfully!
) else (
    echo ✅ Dependencies already installed
)

echo.
echo 🚀 Starting JSP Development Environment...
echo.
echo ⚡ Features:
echo   - Ultra-fast JSP live reload
echo   - Browser auto-refresh
echo   - SuperCSS styling included
echo.
echo 🌐 Access URLs:
echo   - Application: http://localhost:3010
echo   - Browser Sync UI: http://localhost:3011
echo.
echo � Edit InserimentoNuovoMassimaleJSP.jsp and see changes instantly!
echo.
echo Press Ctrl+C to stop the development server
echo.

npm run dev
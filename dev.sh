#!/bin/bash

echo "======================================="
echo "   JSP DEVELOPMENT ENVIRONMENT"
echo "======================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Checking Node.js installation...${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found!${NC}"
    echo ""
    echo "Please install Node.js from: https://nodejs.org/"
    echo "Minimum version required: 14.x"
    echo ""
    echo "Installation options:"
    echo "  - Download from: https://nodejs.org/"
    echo "  - macOS: brew install node"
    echo "  - Ubuntu/Debian: curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - && sudo apt-get install -y nodejs"
    exit 1
fi

echo -e "${GREEN}✅ Node.js found:${NC} $(node --version)"

echo ""
echo -e "${BLUE}Checking dependencies...${NC}"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to install dependencies!${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Dependencies installed successfully!${NC}"
else
    echo -e "${GREEN}✅ Dependencies already installed${NC}"
fi

echo ""
echo -e "${GREEN}🚀 Starting JSP Development Environment...${NC}"
echo ""
echo -e "${YELLOW}⚡ Features:${NC}"
echo "  - Ultra-fast JSP live reload"
echo "  - Browser auto-refresh"  
echo "  - SuperCSS styling included"
echo ""
echo -e "${BLUE}🌐 Access URLs:${NC}"
echo "  - Application: http://localhost:3010"
echo "  - Browser Sync UI: http://localhost:3011"
echo ""
echo -e "${YELLOW}💡 Edit InserimentoNuovoMassimaleJSP.jsp and see changes instantly!${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop the development server${NC}"
echo ""

npm run dev
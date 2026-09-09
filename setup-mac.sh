#!/bin/bash

# ============================================
# Script de Automação - Pratos Fichas Técnicas
# Sistema: macOS / Linux
# ============================================

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}  🚀 PRATOS - Fichas Técnicas${NC}"
echo -e "${CYAN}  Script de Configuração Automática${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

# Função para verificar se um comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# ============================================
# 1. VERIFICAR NODE.JS
# ============================================
echo -e "${YELLOW}[1/6] Verificando Node.js...${NC}"

if command_exists node; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js encontrado: $NODE_VERSION${NC}"
else
    echo -e "${RED}❌ Node.js não encontrado!${NC}"
    echo ""
    echo -e "${YELLOW}Por favor, instale o Node.js:${NC}"
    echo -e "${WHITE}Opção 1 - Via Homebrew:${NC}"
    echo "  brew install node"
    echo -e "${WHITE}Opção 2 - Via Site Oficial:${NC}"
    echo "  https://nodejs.org/"
    echo ""
    read -p "Pressione ENTER para sair"
    exit 1
fi

# ============================================
# 2. VERIFICAR NPM
# ============================================
echo -e "${YELLOW}[2/6] Verificando NPM...${NC}"

if command_exists npm; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✅ NPM encontrado: $NPM_VERSION${NC}"
else
    echo -e "${RED}❌ NPM não encontrado!${NC}"
    read -p "Pressione ENTER para sair"
    exit 1
fi

# ============================================
# 3. VERIFICAR ARQUIVO .ENV
# ============================================
echo -e "${YELLOW}[3/6] Verificando arquivo .env...${NC}"

if [ -f .env ]; then
    echo -e "${GREEN}✅ Arquivo .env encontrado${NC}"
else
    echo -e "${YELLOW}⚠️  Arquivo .env não encontrado. Criando...${NC}"
    
    cat > .env << 'EOF'
APP_NAME="Pratos - Fichas Tecnicas"
NODE_ENV=development
PORT=3000

# Configuração SQLite (recomendado para desenvolvimento)
DB_DIALECT=sqlite
DB_STORAGE=./database.sqlite

# Configurações MySQL (opcional)
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=pratos_dev
DB_USER=root
DB_PASS=root

DEFAULT_MARKUP=3.5

EVENT_BROKER_URL=
EVENT_BROKER_SERVICE_TOKEN=
EOF
    
    echo -e "${GREEN}✅ Arquivo .env criado com sucesso!${NC}"
fi

# ============================================
# 4. INSTALAR DEPENDÊNCIAS
# ============================================
echo -e "${YELLOW}[4/6] Instalando dependências...${NC}"

if [ -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  node_modules já existe. Deseja reinstalar?${NC}"
    read -p "Digite 's' para reinstalar ou 'n' para pular (s/n): " choice
    
    if [[ $choice == "s" || $choice == "S" ]]; then
        echo -e "${YELLOW}Removendo node_modules...${NC}"
        rm -rf node_modules
        echo -e "${YELLOW}Instalando dependências...${NC}"
        npm install
    else
        echo -e "${GREEN}✅ Pulando reinstalação${NC}"
    fi
else
    echo -e "${YELLOW}Instalando dependências...${NC}"
    npm install
fi

# ============================================
# 5. VERIFICAR SQLITE3
# ============================================
echo -e "${YELLOW}[5/6] Verificando SQLite3...${NC}"

if npm list sqlite3 --depth=0 >/dev/null 2>&1; then
    echo -e "${GREEN}✅ SQLite3 instalado${NC}"
else
    echo -e "${YELLOW}⚠️  SQLite3 não encontrado. Instalando...${NC}"
    npm install sqlite3 --save
fi

# ============================================
# 6. VERIFICAR PORTA 3000
# ============================================
echo -e "${YELLOW}[6/6] Verificando porta 3000...${NC}"

PORT_PID=$(lsof -ti :3000 2>/dev/null)
if [ ! -z "$PORT_PID" ]; then
    echo -e "${RED}⚠️  Porta 3000 está em uso!${NC}"
    echo -e "${YELLOW}Processo usando a porta 3000: $PORT_PID${NC}"
    
    read -p "Deseja matar o processo? (s/n): " choice
    if [[ $choice == "s" || $choice == "S" ]]; then
        kill -9 $PORT_PID 2>/dev/null
        echo -e "${GREEN}✅ Processo $PORT_PID finalizado${NC}"
    fi
else
    echo -e "${GREEN}✅ Porta 3000 disponível${NC}"
fi

# ============================================
# 7. PERMISSÕES DE ARQUIVO (apenas macOS/Linux)
# ============================================
echo -e "${YELLOW}[7/7] Ajustando permissões...${NC}"

if [ -f "database.sqlite" ]; then
    chmod 755 database.sqlite 2>/dev/null
    echo -e "${GREEN}✅ Permissões ajustadas${NC}"
fi

# ============================================
# INICIAR APLICAÇÃO
# ============================================
echo ""
echo -e "${CYAN}========================================${NC}"
echo -e "${GREEN}  ✅ Configuração concluída com sucesso!${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""
echo -e "${YELLOW}🚀 Iniciando aplicação...${NC}"
echo ""

npm run dev
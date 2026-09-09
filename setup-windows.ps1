# ============================================
# Script de Automação - Pratos Fichas Técnicas
# Sistema: Windows
# ============================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ?? PRATOS - Fichas Técnicas" -ForegroundColor Cyan
Write-Host "  Script de Configuração Automática" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Função para verificar se um comando existe
function Test-CommandExists {
    param($command)
    $oldPreference = $ErrorActionPreference
    $ErrorActionPreference = 'stop'
    try {
        if (Get-Command $command) { return $true }
    }
    catch { return $false }
    finally { $ErrorActionPreference = $oldPreference }
}

# ============================================
# 1. VERIFICAR NODE.JS
# ============================================
Write-Host "[1/6] Verificando Node.js..." -ForegroundColor Yellow

if (Test-CommandExists node) {
    $nodeVersion = node --version
    Write-Host "? Node.js encontrado: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "? Node.js não encontrado!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Por favor, instale o Node.js:" -ForegroundColor Yellow
    Write-Host "1. Acesse: https://nodejs.org/" -ForegroundColor White
    Write-Host "2. Baixe e instale a versão LTS" -ForegroundColor White
    Write-Host "3. Reinicie este terminal após a instalação" -ForegroundColor White
    Write-Host ""
    Read-Host "Pressione ENTER para sair"
    exit 1
}

# ============================================
# 2. VERIFICAR NPM
# ============================================
Write-Host "[2/6] Verificando NPM..." -ForegroundColor Yellow

if (Test-CommandExists npm) {
    $npmVersion = npm --version
    Write-Host "? NPM encontrado: $npmVersion" -ForegroundColor Green
} else {
    Write-Host "? NPM não encontrado!" -ForegroundColor Red
    Read-Host "Pressione ENTER para sair"
    exit 1
}

# ============================================
# 3. VERIFICAR ARQUIVO .ENV
# ============================================
Write-Host "[3/6] Verificando arquivo .env..." -ForegroundColor Yellow

if (Test-Path .env) {
    Write-Host "? Arquivo .env encontrado" -ForegroundColor Green
} else {
    Write-Host "??  Arquivo .env não encontrado. Criando..." -ForegroundColor Yellow
    
    $envContent = @'
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
'@
    
    $envContent | Out-File -FilePath .env -Encoding utf8
    Write-Host "? Arquivo .env criado com sucesso!" -ForegroundColor Green
}

# ============================================
# 4. INSTALAR DEPENDÊNCIAS
# ============================================
Write-Host "[4/6] Instalando dependências..." -ForegroundColor Yellow

if (Test-Path node_modules) {
    Write-Host "??  node_modules já existe. Deseja reinstalar?" -ForegroundColor Yellow
    $choice = Read-Host "Digite 's' para reinstalar ou 'n' para pular (s/n)"
    
    if ($choice -eq 's' -or $choice -eq 'S') {
        Write-Host "Removendo node_modules..." -ForegroundColor Yellow
        Remove-Item -Path node_modules -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "Instalando dependências..." -ForegroundColor Yellow
        npm install
    } else {
        Write-Host "? Pulando reinstalação" -ForegroundColor Green
    }
} else {
    Write-Host "Instalando dependências..." -ForegroundColor Yellow
    npm install
}

# ============================================
# 5. VERIFICAR SQLITE3
# ============================================
Write-Host "[5/6] Verificando SQLite3..." -ForegroundColor Yellow

$sqliteCheck = npm list sqlite3 --depth=0 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "? SQLite3 instalado" -ForegroundColor Green
} else {
    Write-Host "??  SQLite3 não encontrado. Instalando..." -ForegroundColor Yellow
    npm install sqlite3 --save
}

# ============================================
# 6. VERIFICAR PORTA 3000
# ============================================
Write-Host "[6/6] Verificando porta 3000..." -ForegroundColor Yellow

$portInUse = netstat -ano | findstr :3000 | findstr LISTENING
if ($portInUse) {
    Write-Host "??  Porta 3000 está em uso!" -ForegroundColor Red
    Write-Host "Processos usando a porta 3000:" -ForegroundColor Yellow
    Write-Host $portInUse -ForegroundColor White
    
    $choice = Read-Host "Deseja matar os processos? (s/n)"
    if ($choice -eq 's' -or $choice -eq 'S') {
        $portInUse | ForEach-Object {
            $pid = [regex]::Match($_, '\s+(\d+)$').Groups[1].Value
            if ($pid) {
                Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
                Write-Host "? Processo $pid finalizado" -ForegroundColor Green
            }
        }
    }
} else {
    Write-Host "? Porta 3000 disponível" -ForegroundColor Green
}

# ============================================
# INICIAR APLICAÇÃO
# ============================================
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ? Configuração concluída com sucesso!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "?? Iniciando aplicação..." -ForegroundColor Yellow
Write-Host ""

npm run dev
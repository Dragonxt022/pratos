Aqui está o README.md completo e atualizado com os scripts de automação:

```markdown
# 📋 Guia Completo: Configuração e Execução do Projeto "Pratos - Fichas Técnicas"

## Índice
1. [Pré-requisitos](#1-pré-requisitos)
2. [Configuração do Ambiente](#2-configuração-do-ambiente)
3. [Instalação do Projeto](#3-instalação-do-projeto)
4. [Configuração do Banco de Dados](#4-configuração-do-banco-de-dados)
5. [Scripts de Automação](#5-scripts-de-automação)
6. [Executando a Aplicação](#6-executando-a-aplicação)
7. [Solução de Problemas Comuns](#7-solução-de-problemas-comuns)
8. [Estrutura do Projeto](#8-estrutura-do-projeto)
9. [Comandos Úteis Rápidos](#9-comandos-úteis-rápidos)
10. [Dicas Adicionais](#10-dicas-adicionais)
11. [Checklist de Verificação Final](#11-checklist-de-verificação-final)

---

## 1. Pré-requisitos

### Windows
- **Node.js** (versão 14 ou superior)
- **Git** (opcional, para clonar o repositório)
- **Editor de código** (recomendado: VS Code)
- **PowerShell** (para scripts de automação)

### macOS
- **Node.js** (versão 14 ou superior)
- **Git** (opcional, para clonar o repositório)
- **Editor de código** (recomendado: VS Code)
- **Homebrew** (recomendado para instalações)

### 📌 Instalando o Node.js

#### Windows
1. Acesse: https://nodejs.org/
2. Baixe o instalador LTS (versão recomendada)
3. Execute o instalador e siga os passos (Next > Next > Finish)
4. Verifique a instalação:
```bash
node --version
npm --version
```

#### macOS
**Opção 1 - Via Site Oficial:**
1. Acesse: https://nodejs.org/
2. Baixe o instalador LTS para macOS
3. Execute o arquivo `.pkg` e siga as instruções

**Opção 2 - Via Homebrew (recomendado):**
```bash
# Instalar Homebrew (se não tiver)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Instalar Node.js
brew install node

# Verificar instalação
node --version
npm --version
```

---

## 2. Configuração do Ambiente

### Clonando o Repositório (ou baixando o projeto)

#### Windows (Git Bash/Prompt)
```bash
# Clonar via Git
git clone <URL_DO_REPOSITORIO>
cd pratos

# Ou se já tiver a pasta, navegue até ela
cd caminho/para/o/projeto/pratos
```

#### macOS (Terminal)
```bash
# Clonar via Git
git clone <URL_DO_REPOSITORIO>
cd pratos

# Ou se já tiver a pasta
cd caminho/para/o/projeto/pratos
```

---

## 3. Instalação do Projeto

### Passo 1: Instalar dependências

**Windows e macOS:**
```bash
npm install
```

### Passo 2: Verificar dependências instaladas

```bash
# Verificar se o sqlite3 foi instalado
npm list sqlite3
```

Se o `sqlite3` não estiver instalado, instale manualmente:
```bash
npm install sqlite3 --save
```

---

## 4. Configuração do Banco de Dados

### Opção A: SQLite (Recomendado para desenvolvimento)

O SQLite é a opção mais simples pois não requer servidor.

#### Passo 1: Configurar arquivo `.env`

Crie ou edite o arquivo `.env` na raiz do projeto:

**Windows (Bloco de Notas/VS Code):**
```env
APP_NAME="Pratos - Fichas Tecnicas"
NODE_ENV=development
PORT=3000

# Configuração SQLite (recomendado para desenvolvimento)
DB_DIALECT=sqlite
DB_STORAGE=./database.sqlite

# Configurações MySQL (opcional - não usado com SQLite)
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=pratos_dev
DB_USER=root
DB_PASS=root

DEFAULT_MARKUP=3.5

EVENT_BROKER_URL=
EVENT_BROKER_SERVICE_TOKEN=
```

**macOS (Terminal com nano/vim ou VS Code):**
```bash
# Criar arquivo .env
nano .env
# ou
code .env
```

Cole o conteúdo acima e salve.

#### Passo 2: Configuração do banco (já existe)

O arquivo `config/database.js` já está configurado para usar SQLite quando `DB_DIALECT=sqlite`.

### Opção B: MySQL (Opcional - Produção)

Se preferir usar MySQL em vez de SQLite:

#### Windows
1. Baixe e instale XAMPP ou MySQL Installer
2. Inicie o serviço MySQL
3. Crie o banco de dados:
```sql
CREATE DATABASE pratos_dev;
```

#### macOS
```bash
# Instalar MySQL via Homebrew
brew install mysql

# Iniciar MySQL
brew services start mysql

# Configurar senha root
mysql_secure_installation

# Criar banco
mysql -u root -p
CREATE DATABASE pratos_dev;
```

#### Configurar `.env` para MySQL:
```env
DB_DIALECT=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=pratos_dev
DB_USER=root
DB_PASS=sua_senha
```

---

## 5. Scripts de Automação

Para facilitar a configuração e execução do projeto, criamos scripts automáticos para ambos os sistemas operacionais.

### 📁 Estrutura dos Scripts

```
pratos/
├── setup-windows.ps1      # Script para Windows (PowerShell)
├── setup-windows.bat      # Script para Windows (CMD)
├── setup-mac.sh           # Script para macOS/Linux
├── start.bat              # Versão rápida para Windows
└── start.sh               # Versão rápida para macOS/Linux
```

### 🚀 Como usar os scripts

#### Windows (PowerShell):
```powershell
# Abra o PowerShell como Administrador
# Navegue até a pasta do projeto
cd C:\caminho\para\pratos

# Execute o script completo
.\setup-windows.ps1
```

Se der erro de permissão, execute:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### Windows (CMD/Batch):
```cmd
# Abra o Prompt de Comando
cd C:\caminho\para\pratos

# Execute o script completo
setup-windows.bat
```

#### macOS/Linux:
```bash
# Abra o Terminal
cd /caminho/para/pratos

# Dê permissão de execução
chmod +x setup-mac.sh

# Execute o script completo
./setup-mac.sh
```

### ⚡ Versões Rápidas

Para iniciar rapidamente (após a configuração inicial):

#### Windows (`start.bat`):
```batch
@echo off
echo 🚀 Iniciando Pratos...
npm run dev
```

#### macOS/Linux (`start.sh`):
```bash
#!/bin/bash
echo "🚀 Iniciando Pratos..."
npm run dev
```

### 📋 O que os scripts fazem automaticamente

Os scripts de automação realizam todas as etapas necessárias:

1. ✅ **Verifica Node.js** - Confirma se o Node.js está instalado
2. ✅ **Verifica NPM** - Confirma se o NPM está disponível
3. ✅ **Cria .env** - Gera automaticamente o arquivo de configuração
4. ✅ **Instala dependências** - Executa `npm install` com verificação
5. ✅ **Verifica SQLite3** - Instala automaticamente se necessário
6. ✅ **Libera porta 3000** - Detecta e finaliza processos conflitantes
7. ✅ **Ajusta permissões** (macOS/Linux) - Configura permissões de arquivo
8. ✅ **Inicia aplicação** - Executa `npm run dev` automaticamente

---

## 6. Executando a Aplicação

### Ambiente de Desenvolvimento

**Windows e macOS:**
```bash
npm run dev
```

**Usando scripts automáticos:**
```bash
# Windows PowerShell
.\setup-windows.ps1

# Windows CMD
setup-windows.bat

# macOS/Linux
./setup-mac.sh
```

**Saída esperada:**
```
> pratos-fichas-tecnicas@1.0.0 dev
> node --watch app.js

[2026-09-09T11:36:04.725Z] [INFO] Servidor iniciado na porta 3000
[2026-09-09T11:36:04.725Z] [INFO] Banco de dados SQLite conectado com sucesso!
```

### Acessar a aplicação
Abra o navegador e acesse: `http://localhost:3000`

### Ambiente de Produção

**Windows e macOS:**
```bash
# Iniciar em produção
NODE_ENV=production npm start

# Ou
npm start
```

---

## 7. Solução de Problemas Comuns

### ❌ Erro: `connect ECONNREFUSED 127.0.0.1:3306`

**Causa:** Tentando conectar ao MySQL sem o serviço rodando.

**Solução:**
1. Verifique se está usando SQLite no `.env`:
```env
DB_DIALECT=sqlite
```
2. Ou inicie o serviço MySQL.

### ❌ Erro: `Cannot find module 'sqlite3'`

**Solução:**
```bash
npm install sqlite3
```

### ❌ Erro: `EACCES: permission denied`

**Windows:**
- Execute o terminal como Administrador
- Verifique permissões da pasta

**macOS:**
```bash
# Dar permissão à pasta
sudo chmod -R 755 .

# Ou para o arquivo específico
sudo chmod 755 database.sqlite
```

### ❌ Erro: `Port 3000 already in use`

**Windows (PowerShell):**
```bash
# Encontrar processo usando a porta
netstat -ano | findstr :3000
# Matar processo (substitua PID)
taskkill /PID <PID> /F
```

**Windows (CMD):**
```cmd
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**macOS:**
```bash
# Encontrar processo
lsof -i :3000
# Matar processo
kill -9 <PID>
```

### ❌ Erro: `SQLITE_ERROR: no such table`

**Solução:** Verifique se as migrations/seeders foram executadas:
```bash
# Se tiver migrations configuradas
npx sequelize-cli db:migrate

# Se tiver seeders
npx sequelize-cli db:seed:all
```

### ❌ Erro ao executar script PowerShell no Windows

**Solução:**
```powershell
# Executar como Administrador
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### ❌ Erro de permissão no script macOS/Linux

**Solução:**
```bash
chmod +x setup-mac.sh
./setup-mac.sh
```

---

## 8. Estrutura do Projeto

```
pratos/
├── config/
│   └── database.js          # Configuração do banco de dados
├── models/                   # Modelos Sequelize
├── controllers/              # Controladores da aplicação
├── routes/                   # Rotas da API
├── middlewares/              # Middlewares Express
├── scripts/                  # Scripts de automação
│   ├── setup-windows.ps1    # Script PowerShell (Windows)
│   ├── setup-windows.bat    # Script Batch (Windows)
│   └── setup-mac.sh         # Script Bash (macOS/Linux)
├── .env                      # Variáveis de ambiente
├── .env.example              # Exemplo de variáveis
├── app.js                    # Arquivo principal
├── package.json              # Dependências e scripts
├── database.sqlite           # Banco SQLite (criado automaticamente)
├── start.bat                 # Inicialização rápida (Windows)
├── start.sh                  # Inicialização rápida (macOS/Linux)
└── README.md                 # Documentação do projeto
```

---

## 9. Comandos Úteis Rápidos

### Windows (PowerShell/CMD)
```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Rodar em produção
npm start

# Setup automático (PowerShell)
.\setup-windows.ps1

# Setup automático (CMD)
setup-windows.bat

# Início rápido
start.bat

# Ver versão do Node
node --version

# Ver versão do NPM
npm --version
```

### macOS/Linux
```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Rodar em produção
npm start

# Setup automático
./setup-mac.sh

# Início rápido
./start.sh

# Ver versão do Node
node --version

# Ver versão do NPM
npm --version

# Acessar banco SQLite (opcional)
sqlite3 database.sqlite
.tables                      # Listar tabelas
.quit                        # Sair
```

---

## 10. Dicas Adicionais

### 🔧 VS Code Extensões Recomendadas
- **SQLite Viewer** - Visualizar banco SQLite
- **ESLint** - Verificação de código
- **Prettier** - Formatação automática
- **DotENV** - Syntax highlighting para .env
- **PowerShell** - Suporte para scripts .ps1
- **Shell Script** - Suporte para scripts .sh

### 📦 Dependências Principais
```json
{
  "express": "^4.18.0",      // Framework web
  "sequelize": "^6.0.0",     // ORM
  "sqlite3": "^5.1.0",       // Driver SQLite
  "dotenv": "^16.0.0",       // Variáveis de ambiente
  "cors": "^2.8.5",          // CORS
  "helmet": "^7.0.0"         // Segurança
}
```

### 🌐 URLs Importantes
- **Documentação Node.js:** https://nodejs.org/docs/
- **Documentação Sequelize:** https://sequelize.org/docs/
- **Documentação SQLite:** https://www.sqlite.org/docs.html
- **Download Node.js:** https://nodejs.org/
- **Download Git:** https://git-scm.com/

### 🛠️ Ferramentas Úteis
- **Postman** - Teste de APIs
- **DBeaver** - Cliente de banco de dados multi-plataforma
- **TablePlus** - Cliente de banco de dados moderno
- **SQLite Browser** - Visualizador SQLite

---

## 11. Checklist de Verificação Final

- [ ] Node.js instalado (versão 14+)
- [ ] Projeto clonado/baixado
- [ ] Dependências instaladas (`npm install`)
- [ ] Arquivo `.env` configurado com `DB_DIALECT=sqlite`
- [ ] Scripts de automação com permissão de execução
- [ ] Porta 3000 disponível
- [ ] Aplicação rodando (`npm run dev` ou script automático)
- [ ] Acessível em `http://localhost:3000`

---

## 12. Contribuindo com o Projeto

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Commit
- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação de código
- `refactor:` Refatoração
- `test:` Testes
- `chore:` Tarefas de manutenção

---

## 13. Licença

Este projeto está sob a licença [MIT](LICENSE).

---

**🎉 Parabéns!** Agora você tem um guia completo para rodar o projeto em qualquer ambiente!

Qualquer dúvida, consulte a seção de [Solução de Problemas](#7-solução-de-problemas-comuns) ou abra uma issue no repositório.

---

**Última atualização:** Setembro de 2026

**Suporte:** Para dúvidas ou problemas, entre em contato com a equipe de desenvolvimento.
```

---

## Como salvar o arquivo:

### Opção 1: Salvar direto no VS Code
1. Abra o VS Code
2. Crie um novo arquivo (`Ctrl+N` ou `Cmd+N`)
3. Cole todo o conteúdo acima
4. Salve como `README.md` na raiz do projeto
5. VS Code detectará automaticamente a sintaxe Markdown

### Opção 2: Via Terminal
```bash
# Criar arquivo
nano README.md
# ou
vim README.md

# Colar o conteúdo
# Ctrl+Shift+V (terminal Linux/Mac) ou botão direito (Windows)

# Salvar e sair
# No nano: Ctrl+O, Enter, Ctrl+X
# No vim: ESC, :wq
```

### Opção 3: Via PowerShell/CMD
```powershell
# Criar arquivo com conteúdo
@"
COLE O CONTEÚDO AQUI
"@ | Out-File -FilePath README.md -Encoding utf8
```

O README.md está pronto para ser a documentação oficial do seu projeto! 🎉
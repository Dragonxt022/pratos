Aqui está o arquivo em formato Markdown (.md) completo. Você pode copiar o conteúdo abaixo e salvar como `README.md` ou `GUIA-INSTALACAO.md`:

---

```markdown
# 📋 Guia Completo: Configuração e Execução do Projeto "Pratos - Fichas Técnicas"

## Índice
1. [Pré-requisitos](#1-pré-requisitos)
2. [Configuração do Ambiente](#2-configuração-do-ambiente)
3. [Instalação do Projeto](#3-instalação-do-projeto)
4. [Configuração do Banco de Dados](#4-configuração-do-banco-de-dados)
5. [Executando a Aplicação](#5-executando-a-aplicação)
6. [Solução de Problemas Comuns](#6-solução-de-problemas-comuns)
7. [Estrutura do Projeto](#7-estrutura-do-projeto)
8. [Comandos Úteis Rápidos](#8-comandos-úteis-rápidos)
9. [Dicas Adicionais](#9-dicas-adicionais)
10. [Checklist de Verificação Final](#10-checklist-de-verificação-final)

---

## 1. Pré-requisitos

### Windows
- **Node.js** (versão 14 ou superior)
- **Git** (opcional, para clonar o repositório)
- **Editor de código** (recomendado: VS Code)

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

# Configuração SQLite
DB_DIALECT=sqlite
DB_STORAGE=./database.sqlite

# Configurações MySQL (não usadas com SQLite, mas mantidas)
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

## 5. Executando a Aplicação

### Ambiente de Desenvolvimento

**Windows e macOS:**
```bash
npm run dev
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

## 6. Solução de Problemas Comuns

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

**Windows:**
```bash
# Encontrar processo usando a porta
netstat -ano | findstr :3000
# Matar processo (substitua PID)
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

---

## 7. Estrutura do Projeto

```
pratos/
├── config/
│   └── database.js          # Configuração do banco de dados
├── models/                   # Modelos Sequelize
├── controllers/              # Controladores da aplicação
├── routes/                   # Rotas da API
├── middlewares/              # Middlewares Express
├── .env                      # Variáveis de ambiente
├── .env.example              # Exemplo de variáveis
├── app.js                    # Arquivo principal
├── package.json              # Dependências e scripts
├── database.sqlite           # Banco SQLite (criado automaticamente)
└── README.md                 # Documentação do projeto
```

---

## 8. Comandos Úteis Rápidos

### Windows
```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Rodar em produção
npm start

# Ver versão do Node
node --version

# Ver versão do NPM
npm --version
```

### macOS
```bash
# Mesmos comandos do Windows
npm install
npm run dev
npm start
node --version
npm --version

# Além disso, para SQLite (opcional)
sqlite3 database.sqlite     # Acessar banco via linha de comando
.tables                      # Listar tabelas
.quit                        # Sair
```

---

## 9. Dicas Adicionais

### 🔧 VS Code Extensões Recomendadas
- **SQLite Viewer** - Visualizar banco SQLite
- **ESLint** - Verificação de código
- **Prettier** - Formatação automática
- **DotENV** - Syntax highlighting para .env

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

---

## 10. Checklist de Verificação Final

- [ ] Node.js instalado (versão 14+)
- [ ] Projeto clonado/baixado
- [ ] Dependências instaladas (`npm install`)
- [ ] Arquivo `.env` configurado com `DB_DIALECT=sqlite`
- [ ] Porta 3000 disponível
- [ ] Aplicação rodando (`npm run dev`)
- [ ] Acessível em `http://localhost:3000`

---

## 11. Contribuindo com o Projeto

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 12. Licença

Este projeto está sob a licença [MIT](LICENSE).

---

**🎉 Parabéns!** Agora você tem um guia completo para rodar o projeto em qualquer ambiente!

Qualquer dúvida, consulte a seção de [Solução de Problemas](#6-solução-de-problemas-comuns) ou abra uma issue no repositório.

---

**Última atualização:** Setembro de 2026
```

---

## Como salvar o arquivo:

### Windows:
1. Abra o **Bloco de Notas** ou **VS Code**
2. Copie todo o conteúdo acima
3. Clique em **Arquivo > Salvar Como...**
4. Escolha o local (raiz do projeto)
5. No campo "Nome do arquivo", digite: `README.md`
6. Em "Salvar como tipo", selecione **Todos os arquivos** (ou *.*)
7. Clique em **Salvar**

### macOS:
1. Abra o **VS Code** ou **TextEdit** (em formato plain text)
2. Copie todo o conteúdo acima
3. Pressione `Cmd + S`
4. Escolha o local (raiz do projeto)
5. No campo "Nome", digite: `README.md`
6. Certifique-se de que não está adicionando extensão extra (ex: `.txt`)
7. Clique em **Salvar**

### Via Terminal (rápido):
```bash
# Criar arquivo e abrir para edição
nano README.md
# ou
vim README.md
# ou
code README.md  # VS Code

# Colar o conteúdo, salvar e sair
# No nano: Ctrl+O, Enter, Ctrl+X
# No vim: pressione 'i' para inserir, cole, ESC, :wq
```

---

O arquivo está pronto para ser usado como documentação do seu projeto! 🎉
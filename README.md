# Pratos — Fichas Técnicas

Aplicação para gestão de fichas técnicas de pratos (cálculo de custo, markup e preço sugerido), construída em Node.js (Express 5 + Sequelize + EJS) e empacotada como app desktop com Electron.

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- npm (instalado junto com o Node.js)
- Banco de dados MySQL/MariaDB (opcional — por padrão a aplicação usa SQLite local)

## Instalação

1. Clone o repositório e instale as dependências:

   ```bash
   git clone https://github.com/Dragonxt022/pratos.git
   cd pratos
   npm install
   ```

2. Copie o arquivo de variáveis de ambiente e ajuste os valores conforme necessário:

   ```bash
   cp .env.example .env
   ```

   Variáveis disponíveis:

   | Variável | Descrição | Padrão |
   |---|---|---|
   | `APP_NAME` | Nome exibido da aplicação | `Pratos - Fichas Tecnicas` |
   | `NODE_ENV` | Ambiente de execução | `development` |
   | `PORT` | Porta do servidor Express | `3000` |
   | `DB_DIALECT` | `sqlite` ou `mysql` | `sqlite` |
   | `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS` | Credenciais usadas quando `DB_DIALECT=mysql` | — |
   | `DEFAULT_MARKUP` | Markup padrão usado no cálculo de preço sugerido | `3.5` |
   | `EVENT_BROKER_URL`, `EVENT_BROKER_SERVICE_TOKEN` | Integração opcional com o Event Broker (arquivos em `client/`) | — |

   Por padrão (`DB_DIALECT=sqlite`), nenhum banco externo é necessário — o arquivo `database.sqlite` é criado automaticamente na raiz do projeto.

3. Rode as migrations (e, se desejar, os seeders) para criar/popular as tabelas:

   ```bash
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   ```

## Executando em desenvolvimento

### Modo web (navegador)

```bash
npm start
```

ou, com reinício automático ao alterar arquivos:

```bash
npm run dev
```

A aplicação fica disponível em `http://localhost:3000` (ou na porta definida em `PORT`).

### Modo desktop (Electron)

```bash
npm run electron
```

Isso sobe o servidor Express internamente e abre a janela do Electron apontando para ele. Nesse modo o banco usado é sempre SQLite, armazenado na pasta de dados do usuário do sistema operacional.

### Tailwind CSS

Os estilos (`public/stylesheets/tailwind.css`) são gerados a partir de `src/tailwind.css`. Para desenvolver com rebuild automático:

```bash
npm run tw:watch
```

Para gerar o CSS uma única vez:

```bash
npm run tw:build
```

## Build (gerar instalador desktop)

O build é feito com [electron-builder](https://www.electron.build/) e gera os artefatos na pasta `dist-electron/` (ignorada pelo Git).

```bash
# Windows (gera instalador NSIS)
npm run dist:win

# macOS (gera .dmg)
npm run dist:mac

# Plataforma atual
npm run dist
```

> No Windows, se o módulo nativo `sqlite3` apresentar problemas após trocar de versão do Electron, rode `npm run rebuild` antes do build.

## Estrutura do projeto

```
app.js              # Bootstrap do servidor Express
main.js              # Processo principal do Electron
config/              # Configuração de ambiente e banco de dados
controllers/         # Lógica das rotas
routes/              # Definição das rotas Express
models/              # Modelos Sequelize
migrations/          # Migrations do banco de dados
seeders/             # Seeders (dados iniciais)
views/               # Views EJS
public/              # Assets estáticos (CSS, imagens)
src/                 # Fonte do Tailwind CSS
client/              # Integração com o Event Broker
```

## Licença

Uso interno / privado.

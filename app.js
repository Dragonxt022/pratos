const Config = require('./config/Config');

const path = require('path');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const logger = require('./utils/logger');
const routes = require('./routes');
const iniciarAgendadorIntegracoes = require('./utils/agendadorIntegracoes');
const { sequelize } = require('./models');

const app = express();

// ── VIEW ENGINE (EJS + layout padrao) ──
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/layout');

// ── BODY PARSERS ──
// urlencoded: formularios HTML simples das views (MVC sem fetch/JS)
// json: eventos enviados pelo Event Broker em client/ (routes/webhook.js)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ── ARQUIVOS ESTATICOS ──
app.use(express.static(path.join(__dirname, 'public')));
// Quando UPLOADS_PATH aponta para fora do public/ (modo Electron/userData)
if (process.env.UPLOADS_PATH) {
  app.use('/uploads/pratos', express.static(process.env.UPLOADS_PATH));
}

// ── LOCALS PADRAO PARA AS VIEWS ──
// currentPath alimenta o estado "active" das abas em partials/header.ejs.
// usuarioNome fica indefinido por enquanto (sem autenticacao nesta versao).
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

// ── ROTAS ──
// routes/index.js so direciona para os routers (dashboard, fichas, insumos,
// editor, config, webhook do broker); toda a logica fica nos controllers.
app.use('/', routes);

// ── 404 ──
app.use((req, res) => {
  res.status(404);
  if (req.path.startsWith('/api/')) {
    return res.json({ status: 'error', message: 'Rota nao encontrada' });
  }
  res.send('Pagina nao encontrada.');
});

// ── ERROR HANDLER ──
app.use((err, req, res, next) => {
  logger.error('Erro nao tratado', err);
  const status = err.status || 500;
  if (req.path.startsWith('/api/')) {
    return res.status(status).json({ status: 'error', message: err.message });
  }
  res.status(status).send('Ocorreu um erro ao processar a requisicao.');
});

async function start() {
  if (Config.db.dialect === 'sqlite') {
    await sequelize.sync();
    logger.info('SQLite: banco de dados pronto.');
  } else {
    await sequelize.authenticate();
    logger.info(`MySQL: conectado em ${Config.db.host}:${Config.db.port}/${Config.db.name}`);
  }
  return new Promise((resolve) => {
    app.listen(Config.app.port, () => {
      logger.info(`${Config.app.name} rodando em http://localhost:${Config.app.port} [${Config.app.env}]`);
      iniciarAgendadorIntegracoes();
      resolve();
    });
  });
}

if (require.main === module) {
  start().catch((err) => {
    logger.error('Erro fatal ao iniciar o servidor:', err);
    process.exit(1);
  });
}

module.exports = { app, start };

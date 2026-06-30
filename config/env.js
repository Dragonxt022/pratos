const path = require('path');

// Carrega as variaveis do .env uma unica vez. Todo modulo que precisa de
// variavel de ambiente deve dar require('./env') (ou '../config/env')
// antes de ler process.env, em vez de depender da ordem de carregamento.
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

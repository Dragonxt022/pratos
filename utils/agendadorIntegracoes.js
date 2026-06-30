const logger = require('./logger');

const INTERVALO_VERIFICACAO_MS = 60 * 1000; // checa a cada 1 minuto

// Agendador em processo para as integracoes de API marcadas como ativas
// (Bruno pediu sincronizacao "automatica e agendada", nao so manual). A cada
// minuto, verifica quais integracoes ativas ja passaram do seu
// intervalo_minutos desde a ultima sincronizacao (ou nunca sincronizaram) e
// dispara sincronizarIntegracaoApi para cada uma, sequencialmente para nao
// sobrecarregar o banco/API externa.
function iniciarAgendadorIntegracoes() {
  setInterval(async () => {
    // requires tardios para garantir que os models ja estao totalmente
    // carregados quando o agendador comeca a rodar (chamado no boot do app).
    const { IntegracaoApi } = require('../models');
    const sincronizarIntegracaoApi = require('../controllers/helpers/sincronizarIntegracaoApi');

    try {
      const ativas = await IntegracaoApi.findAll({ where: { ativo: true } });
      const agora = Date.now();

      for (const integracao of ativas) {
        const minutosPassados = integracao.ultima_sincronizacao
          ? (agora - new Date(integracao.ultima_sincronizacao).getTime()) / 60000
          : Infinity;

        if (minutosPassados >= integracao.intervalo_minutos) {
          try {
            logger.info(`Agendador: sincronizando integracao "${integracao.nome}" (id ${integracao.id})`);
            await sincronizarIntegracaoApi(integracao.id);
          } catch (err) {
            logger.warn(`Agendador: falha ao sincronizar integracao "${integracao.nome}": ${err.message}`);
          }
        }
      }
    } catch (err) {
      logger.error('Agendador de integracoes: erro ao verificar integracoes ativas', err);
    }
  }, INTERVALO_VERIFICACAO_MS);

  logger.info('Agendador de integracoes de API iniciado (verificacao a cada 1 min).');
}

module.exports = iniciarAgendadorIntegracoes;

const confirmaProcesso = require('../client/confirmaProcesso');
const logger = require('../utils/logger');

// Recebido via client/actions.js quando o Event Broker envia event-type 15
// (pedido criado). Implementacao de envio de e-mail fica como TODO -
// o que importa para a infra do broker e confirmar o processamento.
async function receivePedidoCriadoEvent(req, res) {
  const deliveryId = req.headers['delivery-id'];
  try {
    logger.info('Evento "pedido criado" recebido', req.body);
    // TODO: montar e enviar o e-mail de confirmacao de pedido para o cliente.
    await confirmaProcesso(deliveryId);
    res.status(200).json({ status: 'ok' });
  } catch (error) {
    logger.error('Erro ao processar evento de pedido criado', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
}

// Recebido quando o Event Broker envia event-type 57 (colaborador
// cadastrado).
async function receiveUserRegisteredEvent(req, res) {
  const deliveryId = req.headers['delivery-id'];
  try {
    logger.info('Evento "colaborador cadastrado" recebido', req.body);
    // TODO: montar e enviar o e-mail de bem-vindo para o novo colaborador.
    await confirmaProcesso(deliveryId);
    res.status(200).json({ status: 'ok' });
  } catch (error) {
    logger.error('Erro ao processar evento de colaborador cadastrado', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
}

module.exports = { receivePedidoCriadoEvent, receiveUserRegisteredEvent };

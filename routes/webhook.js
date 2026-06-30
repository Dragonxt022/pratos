const router = require('express').Router();
const { checkEvent, actions, heartbeat } = require('../client');

// Integracao com o Event Broker (logica em client/). checkEvent garante
// idempotencia (eventos_processados) antes de despachar para a action.
router.get('/heartbeat', heartbeat);
router.post('/api/event', checkEvent, actions);

module.exports = router;

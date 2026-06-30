const router = require('express').Router();

router.use('/', require('./webhook'));
router.use('/', require('./dashboard'));
router.use('/fichas', require('./pratos'));
router.use('/insumos', require('./insumos'));
router.use('/editor', require('./editor'));
router.use('/analise-precos', require('./analise'));
router.use('/config', require('./config'));
router.use('/api-integracoes', require('./integracoes'));

module.exports = router;
